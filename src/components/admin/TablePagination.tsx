import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
  pageSizeOptions?: number[];
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'items',
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}) => {
  const effectivePageSize = pageSize >= 99999 ? Math.max(1, totalItems) : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * effectivePageSize + 1;
  const endItem = Math.min(currentPage * effectivePageSize, totalItems);

  // If there are only a few pages or totalPages <= 5
  const renderPageButtons = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition font-bold ${
              currentPage === pageNum
                ? 'bg-[#0B1536] text-white shadow-xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {pageNum}
          </button>
        );
      });
    }

    // If more than 5 pages
    const pages: (number | string)[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage, '...', totalPages);
    }

    return pages.map((p, idx) => {
      if (typeof p === 'string') {
        return (
          <span key={`dots-${idx}`} className="px-1 text-slate-400 select-none">
            {p}
          </span>
        );
      }
      return (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition font-bold ${
            currentPage === p
              ? 'bg-[#0B1536] text-white shadow-xs'
              : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div
      className={`px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white text-xs font-bold text-slate-600 ${className}`}
    >
      {/* Left: Rows Per Page Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-semibold">Rows per page:</span>
          <select
            value={pageSize >= 99999 ? 'all' : pageSize}
            onChange={(e) => {
              onPageSizeChange(e.target.value === 'all' ? 999999 : Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#FF4A00] cursor-pointer shadow-2xs hover:border-slate-300 transition"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="all">All ({totalItems})</option>
          </select>
        </div>

        <span className="text-slate-400 font-medium text-xs hidden sm:inline">
          Showing {startItem}–{endItem} of {totalItems} {itemLabel}
        </span>
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {renderPageButtons()}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
