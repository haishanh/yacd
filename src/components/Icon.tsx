import cx from 'clsx';
import React from 'react';

type Props = {
  id: string;
  width?: number;
  height?: number;
  className?: string;
};

const Icon = ({ id, width = 20, height = 20, className, ...props }: Props) => {
  const c = cx('icon', id, className);
  const href = '#' + id;
  return (
    <svg className={c} width={width} height={height} {...props}>
      <use xlinkHref={href} />
    </svg>
  );
};

export default React.memo(Icon);
