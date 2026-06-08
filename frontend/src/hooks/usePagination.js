import { useState, useEffect, useCallback, useRef } from 'react';
import useDebounce from './useDebounce';

/**
 * usePagination
 * 
 * @param {Function} fetchFn - The API call helper function, expected to be called as fetchFn(params)
 * @param {Object} options - Custom configuration options
 * @param {number} [options.initialPage=1] - Starting page number
 * @param {number} [options.initialLimit=10] - Starting items limit per page
 * @param {string} [options.initialSearch=''] - Initial search input
 * @param {Object} [options.additionalParams={}] - Other static/dynamic parameters to pass to fetchFn
 * @param {number} [options.debounceMs=500] - Debounce delay in milliseconds for search queries
 */
export default function usePagination(fetchFn, options = {}) {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSearch = '',
    additionalParams = {},
    debounceMs = 500,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, debounceMs);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(false);

  // Stringify additionalParams to safely include in dependency array
  const additionalParamsString = JSON.stringify(additionalParams);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch,
        ...JSON.parse(additionalParamsString),
      };
      const response = await fetchFn(params);
      if (response.success) {
        setData(response.data);
        if (response.pagination) {
          setTotal(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 0);
        } else {
          const count = response.count !== undefined ? response.count : response.data.length;
          setTotal(count);
          setTotalPages(Math.ceil(count / limit));
        }
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('usePagination hook error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, fetchFn, additionalParamsString]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    if (isMounted.current) {
      setPage(1);
    } else {
      isMounted.current = true;
    }
  }, [debouncedSearch]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage(prev => prev + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage(prev => prev - 1);
  }, [hasPrevPage]);

  return {
    data,
    setData,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refresh: loadData,
  };
}
