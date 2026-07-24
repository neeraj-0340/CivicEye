/**
 * Extracts and validates pagination parameters from a request query string.
 * @param {object} query - req.query
 * @param {number} [defaultLimit=10] - items per page if not provided
 * @returns {{ page, limit, skip }}
 */
export function getPagination(query, defaultLimit = 10) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Builds the pagination metadata object for API responses.
 * @param {number} totalItems - total documents matching the query
 * @param {number} page - current page number
 * @param {number} limit - page size
 * @returns {{ currentPage, totalPages, totalItems, pageSize }}
 */
export function buildPaginationMeta(totalItems, page, limit) {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    currentPage: page,
    totalPages,
    totalItems,
    pageSize: limit,
  };
}
