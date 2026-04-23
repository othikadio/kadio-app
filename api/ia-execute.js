// Vercel Serverless — IA Action Executor
// Permet à KADIO IA d'exécuter des actions: modifier la DB, lire/écrire du code, déployer
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = 'othikadio/kadio-app'
const GITHUB_BRANCH = 'main'

// ── GitHub API helpers ──
async function githubAPI(path, method = 'GET', body = null) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/${path}`, {
    method,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  })
  return res.json()
}

async function readFile(path) {
  const data = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`)
  if (data.content) {
    return { content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha, path: data.path }
  }
  return { error: data.message || 'File not found' }
}

async function writeFile(path, content, message) {
  const existing = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`)
  const body = {
    message: message || `fix: auto-correction IA — ${path}`,
    content: Buffer.from(content).toString('base64'),
    branch: GITHUB_BRANCH,
  }
  if (existing.sha) body.sha = existing.sha
  return githubAPI(`contents/${path}`, 'PUT', body)
}

async function listFiles(path) {
  const data = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`)
  if (Array.isArray(data)) {
    return data.map(f => ({ name: f.name, path: f.path, type: f.type, size: f.size }))
  }
  return { error: data.message || 'Directory not found' }
}

// ── Supabase DB actions ──
async function dbSelect(table, options = {}) {
  let query = supabase.from(table).select(options.select || '*')
  if (options.eq) Object.entries(options.eq).forEach(([k, v]) => { query = query.eq(k, v) })
  if (options.filter) Object.entries(options.filter).forEach(([k, v]) => { query = query.filter(k, 'eq', v) })
  if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending ?? false })
  if (options.limit) query = query.limit(options.limit)
  const { data, error } = await query
  return error ? { error: error.message } : { data, count: data?.length }
}

async function dbInsert(table, rows) {
  const { data, error } = await supabase.from(table).insert(rows).select()
  return error ? { error: error.message } : { data, count: data?.length }
}

async function dbUpdate(table, updates, match) {
  let query = supabase.from(table).update(updates)
  Object.entries(match).forEach(([k, v]) => { query = query.eq(k, v) })
  const { data, error } = await query.select()
  return error ? { error: error.message } : { data }
}

async function dbDelete(table, match) {
  let query = supabase.from(table).delete()
  Object.entries(match).forEach(([k, v]) => { query = query.eq(k, v) })
  const { data, error } = await query.select()
  return error ? { error: error.message } : { data }
}

async function dbUpsert(table, rows) {
  const { data, error } = await supabase.from(table).upsert(rows).select()
  return error ? { error: error.message } : { data }
}

async function runSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { query: sql }).single()
  if (error) {
    // Fallback: try direct query for simple selects
    return { error: error.message, hint: 'SQL direct non supporté, utilise les opérations CRUD' }
  }
  return { data }
}

// ── Action Router ──
async function executeAction(action) {
  const { type, params } = action

  switch (type) {
    // ── Database operations ──
    case 'db_select':
      return dbSelect(params.table, params.options || {})
    case 'db_insert':
      return dbInsert(params.table, params.rows)
    case 'db_update':
      return dbUpdate(params.table, params.updates, params.match)
    case 'db_delete':
      return dbDelete(params.table, params.match)
    case 'db_upsert':
      return dbUpsert(params.table, params.rows)

    // ── Code operations ──
    case 'read_file':
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré' }
      return readFile(params.path)
    case 'write_file':
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré' }
      return writeFile(params.path, params.content, params.message)
    case 'list_files':
      if (!GITHUB_TOKEN) return { error: 'GITHUB_TOKEN non configuré' }
      return listFiles(params.path)

    // ── Bulk operations ──
    case 'seed_services':
      return dbInsert('services', params.services)
    case 'seed_config':
      return dbUpsert('salon_config', params.configs)

    default:
      return { error: `Action inconnue: ${type}` }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { action, actions } = req.body

    // Single action
    if (action) {
      const result = await executeAction(action)
      return res.status(200).json({ success: !result.error, ...result })
    }

    // Batch actions
    if (actions && Array.isArray(actions)) {
      const results = []
      for (const act of actions) {
        results.push(await executeAction(act))
      }
      return res.status(200).json({ success: true, results })
    }

    return res.status(400).json({ error: 'Missing action or actions' })
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message })
  }
}
