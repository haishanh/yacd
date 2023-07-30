import * as React from 'react';
import Button from 'src/components/Button';
import { FlexCenter } from 'src/components/shared/Styled';

const { useRef, useEffect } = React;

type Props = {
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
};

export function ClosePrevConns({ onClickPrimaryButton, onClickSecondaryButton }: Props) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    primaryButtonRef.current.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      secondaryButtonRef.current.focus();
    } else if (e.code === 'ArrowLeft') {
      primaryButtonRef.current.focus();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={handleKeyDown}>
      <h2>Close Connections?</h2>
      <p>
        Click [Yes] to close those connections that are still using the old selected proxy in this
        group
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
