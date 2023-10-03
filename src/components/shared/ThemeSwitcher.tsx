import * as Menubar from '@radix-ui/react-menubar';
import { Tooltip } from '@reach/tooltip';
import cx from 'clsx';
import { useAtom } from 'jotai';
import * as React from 'react';
import { Check } from 'react-feather';
import { useTranslation } from 'react-i18next';

import { framerMotionResource } from '$src/misc/motion';
import { setTheme, themeAtom } from '$src/store/app';
import { ThemeType } from '$src/store/types';

import s from './ThemeSwitcher.module.scss';

const ALL = [
  { v: 'auto', l: 'Auto' },
  { v: 'dark', l: 'Dark' },
  { v: 'light', l: 'Light' },
];

function ThemeIcon({ theme }: { theme: ThemeType }) {
  switch (theme) {
    case 'dark':
      return <MoonA />;
    case 'auto':
      return <Auto />;
    case 'light':
      return <Sun />;
    default:
      console.assert(false, 'Unknown theme');
      return <MoonA />;
  }
}

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const [theme, setThemeAtom] = useAtom(themeAtom);
  const onSelect = React.useCallback(
    (v: ThemeType) => {
      setThemeAtom(v);
      setTheme(v);
    },
    [setThemeAtom],
  );

  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Tooltip label={t('switch_theme')} aria-label={'switch theme'}>
          <Menubar.Trigger className={s.MenubarTrigger}>
            <ThemeIcon theme={theme} />
          </Menubar.Trigger>
        </Tooltip>
        <Menubar.Portal>
          <Menubar.Content className={s.MenubarContent}>
            {ALL.map((it) => (
              <ThemeMenuItem
                key={it.v}
                value={it.v}
                label={it.l}
                active={theme === it.v}
                onSelect={onSelect}
              />
            ))}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

function ThemeMenuItem(props: {
  value: string;
  label: string;
  active: boolean;
  onSelect: (s: string) => void;
}) {
  const cls = cx(s.checkWrapper, { [s.active]: props.active });
  return (
    <Menubar.Item className={s.MenubarItem} onSelect={() => props.onSelect(props.value)}>
      <span className={cls}>
        <Check size={14} />
      </span>
      <span>{props.label}</span>
    </Menubar.Item>
  );
}

function MoonA() {
  const module = framerMotionResource.read();
  const motion = module.motion;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        initial={{ rotate: -30 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.7 }}
      />
    </svg>
  );
}

function Sun() {
  const module = framerMotionResource.read();
  const motion = module.motion;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <motion.g initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </motion.g>
    </svg>
  );
}

function Auto() {
  const module = framerMotionResource.read();
  const motion = module.motion;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="11" />
      <clipPath id="cut-off-bottom">
        <motion.rect
          x="12"
          y="0"
          width="12"
          height="24"
          initial={{ rotate: -30 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.7 }}
        />
      </clipPath>
      <circle cx="12" cy="12" r="6" clipPath="url(#cut-off-bottom)" fill="currentColor" />
    </svg>
  );
}
