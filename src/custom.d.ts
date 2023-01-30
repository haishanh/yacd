/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />

// for css modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.woff2';

interface Window {
  i18n: any;
}

declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
declare const process = {
  env: {
    NODE_ENV: string,
    PUBLIC_URL: string,
    COMMIT_HASH: string,
  },
};

declare module 'react-table' {
  interface TableOptions {}

  interface Empty {}

  interface SortByToggleProps {}

  interface Header {
    getHeaderProps(p: SortByToggleProps): { role?: string };
    getSortByToggleProps(): SortByToggleProps;
    render(x: string): string;
    isSorted: boolean;
    isSortedDesc: boolean;
  }

  interface HeaderGroup {
    getHeaderGroupProps(): { role?: string };
    headers: Header[];
  }

  interface Cell {
    getCellProps(): { role?: string };

    column: { id: string };
    value: number;
  }

  interface Row {
    cells: Cell[];
  }

  export function useTable(
    options: TableOptions,
    useSortBy: useSortBy
  ): {
    headerGroups: HeaderGroup[];
    getTableProps(): { role?: string };
    rows: Row[];
    prepareRow(r: Row): void;
  };

  export function useSortBy(): Empty;
}
