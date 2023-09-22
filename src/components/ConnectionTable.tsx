import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import cx from 'clsx';
import { formatDistance } from 'date-fns';
import React from 'react';
import { ChevronDown } from 'react-feather';

import prettyBytes from '../misc/pretty-bytes';
import s from './ConnectionTable.module.scss';
import { MutableConnRefCtx } from './conns/ConnCtx';

const fullColumns = [
  { header: 'Id', accessorKey: 'id' },
  { header: 'Host', accessorKey: 'host' },
  { header: 'Process', accessorKey: 'process' },
  {
    header: 'DL',
    accessorKey: 'download',
    cell: (info: any) => prettyBytes(info.getValue()),
  },
  {
    header: 'UL',
    accessorKey: 'upload',
    cell: (info: any) => prettyBytes(info.getValue()),
  },
  {
    header: 'DL Speed',
    accessorKey: 'downloadSpeedCurr',
    cell: (info: any) => prettyBytes(info.getValue()) + '/s',
  },
  {
    header: 'UL Speed',
    accessorKey: 'uploadSpeedCurr',
    cell: (info: any) => prettyBytes(info.getValue()) + '/s',
  },
  { header: 'Chains', accessorKey: 'chains' },
  { header: 'Rule', accessorKey: 'rule' },
  {
    header: 'Time',
    accessorKey: 'start',
    cell: (info: any) => formatDistance(info.getValue(), 0),
  },
  { header: 'Source', accessorKey: 'source' },
  { header: 'Destination IP', accessorKey: 'destinationIP' },
  { header: 'Type', accessorKey: 'type' },
];

const COLUMN_SORT = [{ id: 'id', desc: true }];

const columns = fullColumns;
const columnsWithoutProcess = fullColumns.filter((item) => item.accessorKey !== 'process');

function Table({ data }: { data: any }) {
  const connCtx = React.useContext(MutableConnRefCtx);
  const [sorting, setSorting] = React.useState<SortingState>(COLUMN_SORT);
  const table = useReactTable({
    columns: connCtx.hasProcessPath ? columns : columnsWithoutProcess,
    data,
    state: {
      sorting,
      columnVisibility: { id: false },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <table className={s.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={header.column.getCanSort() ? cx(s.th, s.pointer) : s.th}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className={s.thWrap}>
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getIsSorted() ? (
                        <span
                          className={
                            header.column.getIsSorted() === 'desc'
                              ? s.sortIconContainer
                              : cx(s.rotate180, s.sortIconContainer)
                          }
                        >
                          <ChevronDown size={16} />
                        </span>
                      ) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
