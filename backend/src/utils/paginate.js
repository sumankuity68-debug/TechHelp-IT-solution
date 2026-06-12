// FILE: backend/src/utils/paginate.js
// ─────────────────────────────────────────────────────────────────────────
// Reusable pagination helper for Mongoose queries.
//
// Usage:
//   const result = await paginate(Model.find(filter).populate(...), req.query);
//   res.json({ success: true, ...result });
//
// Query params supported:
//   ?page=1        — page number (default: 1)
//   ?limit=10      — items per page (default: 10, max: 100)
//   ?sort=-createdAt  — sort field (default: -createdAt)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Extracts, sanitizes, and prepares pagination parameters from a request query object.
 *
 * @param {object} query - The Express request query object (req.query).
 * @param {string|number} [query.page] - The requested page number (1-indexed).
 * @param {string|number} [query.limit] - The requested number of items per page (capped at 100).
 * @param {string} [query.sort] - The requested sorting criteria (field name prefixed with '-' for descending).
 * @param {object} [defaults={}] - Fallback default values if parameters are missing.
 * @param {number} [defaults.page=1] - Default page number.
 * @param {number} [defaults.limit=10] - Default limit of items per page.
 * @param {string} [defaults.sort='-createdAt'] - Default sorting order.
 * @returns {{page: number, limit: number, sort: string, skip: number}} An object containing sanitized page, limit, sort query, and skip offset.
 */
export const parsePaginationParams = (query, defaults = {}) => {
  const page  = Math.max(1, parseInt(query.page)  || defaults.page  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || defaults.limit || 10));
  const sort  = query.sort || defaults.sort || '-createdAt';
  const skip  = (page - 1) * limit;

  return { page, limit, sort, skip };
};

/**
 * Executes a Mongoose query with pagination, count estimation, and sorting.
 * Returns the matched documents along with standardized pagination metadata.
 *
 * @param {import('mongoose').Query<any, any>} baseQuery - The Mongoose Query object to execute (not yet awaited).
 * @param {object} reqQuery - The Express request query object (req.query) containing pagination instructions.
 * @param {object} [defaults={}] - Fallback parameters if not present in the request query.
 * @param {number} [defaults.page=1] - Default page number.
 * @param {number} [defaults.limit=10] - Default items per page.
 * @param {string} [defaults.sort='-createdAt'] - Default sorting rule.
 * @param {number|null} [totalCount=null] - Precalculated total count of documents to avoid an extra DB count query.
 * @returns {Promise<{data: any[], pagination: {total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean}}>} The paginated database results and metadata.
 */
export const paginate = async (baseQuery, reqQuery, defaults = {}, totalCount = null) => {
  const { page, limit, sort, skip } = parsePaginationParams(reqQuery, defaults);

  // Run data query and count in parallel for efficiency
  const [data, total] = await Promise.all([
    baseQuery.sort(sort).skip(skip).limit(limit),
    totalCount !== null
      ? Promise.resolve(totalCount)
      : baseQuery.model.countDocuments(baseQuery.getFilter()),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
