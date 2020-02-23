import React from 'react';
import { ChevronDown } from 'react-feather';
import prettyBytes from '../misc/pretty-bytes';
import { formatDistance } from 'date-fns';
import cx from 'classnames';
import { useTable, useSortBy } from 'react-table';

import s from './ConnectionTable.module.css';

const columns = [
  { accessor: 'id', show: false },
  { Header: 'Host', accessor: 'host' },
  { Header: 'Download', accessor: 'download' },
  { Header: 'Upload', accessor: 'upload' },
  { Header: 'Download Speed', accessor: 'downloadSpeedCurr' },
  { Header: 'Upload Speed', accessor: 'uploadSpeedCurr' },
  { Header: 'Network', accessor: 'network' },
  { Header: 'Type', accessor: 'type' },
  { Header: 'Chains', accessor: 'chains' },
  { Header: 'Rule', accessor: 'rule' },
  { Header: 'Time', accessor: 'start' },
  { Header: 'Source IP', accessor: 'sourceIP' },
  { Header: 'Source Port', accessor: 'sourcePort' },
  { Header: 'Destination IP', accessor: 'destinationIP' }
];

function renderCell(cell, now) {
  switch (cell.column.id) {
    case 'start':
      return formatDistance(-cell.value, now);
    case 'download':
    case 'upload':
      return prettyBytes(cell.value);
    case 'downloadSpeedCurr':
    case 'uploadSpeedCurr':
      return prettyBytes(cell.value) + '/s';
    default:
      return cell.value;
  }
}

const sortById = { id: 'id', desc: true };
const tableState = {
  sortBy: [
    // maintain a more stable order
    sortById
  ],
  hiddenColumns: ['id']
};

function Table({ data }) {
  const now = new Date();
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState: tableState,
      autoResetSortBy: false
    },
    useSortBy
  );
  return (
    <div {...getTableProps()}>
      <div className={s.thead}>
        {headerGroups.map(headerGroup => {
          return (
            <div {...headerGroup.getHeaderGroupProps()} className={s.tr}>
              {headerGroup.headers.map(column => (
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={s.th}
                >
                  <span>{column.render('Header')}</span>
                  <span className={s.sortIconContainer}>
                    {column.isSorted ? (
                      <span className={column.isSortedDesc ? '' : s.rotate180}>
                        <ChevronDown size={16} />
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}

              {rows.map((row, i) => {
                prepareRow(row);
                return row.cells.map((cell, j) => {
                  return (
                    <div
                      {...cell.getCellProps()}
                      className={cx(
                        s.td,
                        i % 2 === 0 ? s.odd : false,
                        j >= 1 && j <= 4 ? s.du : false
                      )}
                    >
                      {renderCell(cell, now)}
                    </div>
                  );
                });
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
