import { ensureLeadingSlash } from './ensure-leading-slash'
import { isDynamicRoute } from '../router/utils'
import { posix } from '../isomorphic/path'

/**
 * Takes a page and transforms it into its file counterpart ensuring that the
 * output is normalized. Note this function is not idempotent because a page
 * `/index` can be referencing `/index/index.js` and `/index/index` could be
 * referencing `/index/index/index.js`. Examples:
 *  - `/` -> `/index`
 *  - `/index/foo` -> `/index/index/foo`
 *  - `/index` -> `/index/index`
 */
export function normalizePagePath(page: string): string {
  const normalized = ensureLeadingSlash(
    /^\/index(\/|$)/.test(page) && !isDynamicRoute(page)
      ? `/index${page}`
      : page === '/'
      ? '/index'
      : page
  )

  const resolvedPage = posix.normalize(normalized)
  if (resolvedPage !== normalized) {
    throw new Error(
      `Requested and resolved page mismatch: ${normalized} ${resolvedPage}`
    )
  }

  return normalized
}
