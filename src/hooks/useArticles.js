// ── Hook Articles — Supabase + fallback mock ─────────────────
import { useSupabaseData } from './useData'
import { getArticlesPublic, getArticleBySlug } from '@/services'
import { MOCK_ARTICLES } from '@/data/mockPublic'

/** Articles publiés (blog) */
export function useArticles() {
  return useSupabaseData(
    () => getArticlesPublic(),
    MOCK_ARTICLES
  )
}

/** Article unique par slug */
export function useArticle(slug) {
  const mockArticle = MOCK_ARTICLES.find(a => a.slug === slug) || null
  return useSupabaseData(
    slug ? () => getArticleBySlug(slug) : null,
    mockArticle,
    [slug],
    !slug
  )
}
