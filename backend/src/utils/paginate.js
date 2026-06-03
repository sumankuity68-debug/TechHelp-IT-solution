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
 * parsePaginationParams — extract & sanitize page/limit/sort from req.query
 */
export const parsePaginationParams = (query, defaults = {}) => {
  const page  = Math.max(1, parseInt(query.page)  || defaults.page  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || defaults.limit || 10));
  const sort  = query.sort || defaults.sort || '-createdAt';
  const skip  = (page - 1) * limit;

  return { page, limit, sort, skip };
};

/**
 * paginate — runs a Mongoose query with pagination and returns a standard
 * pagination envelope.
 *
 * @param {import('mongoose').Query} baseQuery  — a Mongoose query (NOT yet awaited)
 * @param {object} reqQuery                     — req.query object from Express
 * @param {object} [defaults]                   — override defaults for page/limit/sort
 * @param {number} [totalCount]                 — pass total count if you have it (avoids extra DB call)
 * @returns {Promise<object>}                   — { data, pagination }
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
