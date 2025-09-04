import React, { useState, useMemo } from 'react';
import { Button, Input } from './index';
import '../../../styles/components/ui/Table.scss';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  sortable = true,
  filterable = false,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!globalFilter) return sortedData;
    
    return sortedData.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(globalFilter.toLowerCase());
      })
    );
  }, [sortedData, globalFilter, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.(new Set());
    } else {
      const allIds = new Set(paginatedData.map(row => row.id));
      setSelectedRows(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const handleRowSelect = (rowId) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const baseClass = 'admin-table';
  const tableClasses = [
    baseClass,
    loading && `${baseClass}--loading`,
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={tableClasses}>
        <div className={`${baseClass}__loading`}>
          <div className={`${baseClass}__loading-spinner`}></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={tableClasses} {...props}>
      {/* Table Header with Search */}
      {filterable && (
        <div className={`${baseClass}__header`}>
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            leftIcon="🔍"
            className={`${baseClass}__search`}
          />
          {selectable && selectedRows.size > 0 && (
            <div className={`${baseClass}__selection-info`}>
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className={`${baseClass}__container`}>
        <table className={`${baseClass}__table`}>
          <thead className={`${baseClass}__thead`}>
            <tr className={`${baseClass}__header-row`}>
              {selectable && (
                <th className={`${baseClass}__th ${baseClass}__th--checkbox`}>
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className={`${baseClass}__checkbox`}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${baseClass}__th ${sortable ? `${baseClass}__th--sortable` : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className={`${baseClass}__th-content`}>
                    <span className={`${baseClass}__th-text`}>{column.title}</span>
                    {sortable && (
                      <span className={`${baseClass}__sort-icon`}>
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className={`${baseClass}__tbody`}>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className={`${baseClass}__empty`}
                >
                  <div className={`${baseClass}__empty-content`}>
                    <div className={`${baseClass}__empty-icon`}>📋</div>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`${baseClass}__row ${onRowClick ? `${baseClass}__row--clickable` : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className={`${baseClass}__td ${baseClass}__td--checkbox`}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        className={`${baseClass}__checkbox`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={column.key} className={`${baseClass}__td`}>
                      {column.render ? (
                        column.render(row[column.key], row, rowIndex)
                      ) : (
                        <span className={`${baseClass}__cell-content`}>
                          {row[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className={`${baseClass}__pagination`}>
          <div className={`${baseClass}__pagination-info`}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          
          <div className={`${baseClass}__pagination-controls`}>
            <Button
              variant="outline"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              ≪
            </Button>
            
            <Button
              variant="outline"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ‹
            </Button>
            
            <div className={`${baseClass}__page-numbers`}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "primary" : "outline"}
                    size="small"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ›
            </Button>
            
            <Button
              variant="outline"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              ≫
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;