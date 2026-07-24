import React from 'react';
import { SkeletonTableRow } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Pagination from './Pagination';

/**
 * DataTable — reusable table with built-in loading, empty, and error states.
 * @param {Array} columns - [{ key, label, render?, width? }]
 * @param {Array} data - array of row objects
 * @param {boolean} loading
 * @param {string|null} error
 * @param {string} [emptyTitle]
 * @param {string} [emptyDescription]
 * @param {ReactNode} [emptyAction]
 * @param {function} [onRetry]
 * @param {object} [pagination] - { currentPage, totalPages, onPageChange }
 * @param {ReactNode} [footer] - optional content below the table
 */
const DataTable = React.memo(({
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyTitle = 'No records found',
  emptyDescription = '',
  emptyAction,
  onRetry,
  pagination,
  footer,
}) => {
  const colCount = columns.length;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : {}}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Loading rows */}
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={colCount} />
            ))}

            {/* Error state */}
            {!loading && error && (
              <tr>
                <td colSpan={colCount} style={{ padding: 0 }}>
                  <ErrorState message={error} onRetry={onRetry} />
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={colCount} style={{ padding: 0 }}>
                  <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && !error && data.map((row, rowIdx) => (
              <tr key={row.id || row._id || rowIdx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      {!loading && !error && data.length > 0 && pagination && (
        <div style={{
          borderTop: '1px solid var(--color-gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
            {pagination.totalItems !== undefined && ` · ${pagination.totalItems} total`}
          </span>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}

      {footer && (
        <div style={{ borderTop: '1px solid var(--color-gray-200)', padding: '0.75rem 1rem' }}>
          {footer}
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
