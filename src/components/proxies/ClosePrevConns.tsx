import * as React from 'react';

import Button from '../Button';
import { FlexCenter } from '../shared/Styled';

const { useRef, useEffect } = React;

type Props = {
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
};

export function ClosePrevConns({
  onClickPrimaryButton,
  onClickSecondaryButton,
}: Props) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    primaryButtonRef.current.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 39) {
      secondaryButtonRef.current.focus();
    } else if (e.keyCode === 37) {
      primaryButtonRef.current.focus();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <h2>Close Connections?</h2>
      <p>
        Click "Yes" to close those connections that are still using the old
        selected proxy in this group
      </p>
      <div style={{ height: 30 }} />
      <FlexCenter>
        <Button onClick={onClickPrimaryButton} ref={primaryButtonRef}>
          Yes
        </Button>
        <div style={{ width: 20 }} />
        <Button onClick={onClickSecondaryButton} ref={secondaryButtonRef}>
          No
        </Button>
      </FlexCenter>
    </div>
  );
}
