'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
  value?: (row: T) => string | number | null | undefined;
};

type SortState = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  totalLabel?: string;
  pageSize?: number;
  emptyState?: string;
};

function readColumnValue<T>(row: T, column: DataTableColumn<T>) {
  if (column.value) {
    return column.value(row);
  }

  return (row as Record<string, unknown>)[column.key as string] as string | number | null | undefined;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  totalLabel = 'Total Records',
  pageSize = 10,
  emptyState = 'No records found.',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const rows = normalizedQuery
      ? data.filter((row) =>
          columns.some((column) =>
            String(readColumnValue(row, column) || '')
              .toLowerCase()
              .includes(normalizedQuery)
          )
        )
      : data;

    if (!sort) {
      return rows;
    }

    const column = columns.find((item) => String(item.key) === sort.key);

    return [...rows].sort((a, b) => {
      const left = String(column ? readColumnValue(a, column) || '' : '').toLowerCase();
      const right = String(column ? readColumnValue(b, column) || '' : '').toLowerCase();

      return sort.direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    });
  }, [columns, data, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  function updateSort(column: DataTableColumn<T>) {
    if (!column.sortable) {
      return;
    }

    setSort((current) => {
      const key = String(column.key);

      if (current?.key !== key) {
        return { key, direction: 'asc' };
      }

      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="pl-9"
            placeholder={searchPlaceholder}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {totalLabel}: <span className="font-medium text-foreground">{filteredRows.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((column) => {
                const isSorted = sort?.key === String(column.key);

                return (
                  <TableHead key={String(column.key)} className={cn('whitespace-nowrap', column.className)}>
                    <button
                      type="button"
                      onClick={() => updateSort(column)}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-left',
                        column.sortable ? 'cursor-pointer hover:text-foreground' : 'cursor-default'
                      )}
                    >
                      {column.header}
                      {column.sortable ? (
                        isSorted ? (
                          sort.direction === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                        )
                      ) : null}
                    </button>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={cn('whitespace-nowrap', column.className)}>
                      {column.render ? column.render(row) : String(readColumnValue(row, column) || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
