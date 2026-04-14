// ── Articles / Blog ─────────────────────────────────────────
import { supabase } from '../lib/supabase'

/** Articles publiés (public) */
export async function getArticlesPublic() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('publie', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Article par slug */
export async function getArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

/** Admin — tous les articles */
export async function getAllArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Admin — créer / modifier un article */
export async function upsertArticle(article) {
  const { data, error } = await supabase
    .from('articles')
    .upsert(article)
    .select()
    .single()
  if (error) throw error
  return data
}
