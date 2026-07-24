import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../api/config';

/**
 * usePagination — fetches a paginated API endpoint and manages all pagination state.
 *
 * @param {string} url - API endpoint (e.g. '/complaint/alllist')
 * @param {object} [initialFilters={}] - initial search/filter params (preserved on page change)
 * @param {number} [initialPage=1]
 * @param {number} [pageSize=10]
 * @param {boolean} [autoFetch=true] - set false to manually trigger the first fetch
 */
const usePagination = (url, initialFilters = {}, initialPage = 1, pageSize = 10, autoFetch = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize,
  });

  // In-memory page cache (key: JSON of page+filters)
  const cache = useRef({});

  const fetchData = useCallback(async (pageNum = page, currentFilters = filters) => {
    if (!url) return;

    const cacheKey = JSON.stringify({ pageNum, currentFilters });
    if (cache.current[cacheKey]) {
      const cached = cache.current[cacheKey];
      setData(cached.data);
      setPaginationMeta(cached.pagination);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = { page: pageNum, limit: pageSize, ...currentFilters };
      const res = await api.get(url, { params });

      let resultData, resultPagination;

      // Handle both paginated response shape and legacy array
      if (res.data && res.data.success && res.data.data && res.data.pagination) {
        resultData = res.data.data;
        resultPagination = res.data.pagination;
      } else if (Array.isArray(res.data)) {
        // Legacy response — treat entire array as one page
        resultData = res.data;
        resultPagination = {
          currentPage: 1,
          totalPages: 1,
          totalItems: res.data.length,
          pageSize: res.data.length,
        };
      } else {
        resultData = [];
        resultPagination = { currentPage: 1, totalPages: 1, totalItems: 0, pageSize };
      }

      // Cache the result
      cache.current[cacheKey] = { data: resultData, pagination: resultPagination };

      setData(resultData);
      setPaginationMeta(resultPagination);
    } catch (err) {
      console.error(`usePagination error for ${url}:`, err);
      setError(err.response?.data?.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url, page, filters, pageSize]);

  useEffect(() => {
    if (autoFetch) {
      fetchData(page, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, url]);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    // Reset to page 1 when filters change, and clear cache
    cache.current = {};
    setFilters(newFilters);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    // Clear cache and re-fetch current page
    cache.current = {};
    fetchData(page, filters);
  }, [fetchData, page, filters]);

  return {
    data,
    loading,
    error,
    page,
    filters,
    pagination: paginationMeta,
    goToPage,
    updateFilters,
    refresh,
    fetchData,
  };
};

export default usePagination;
