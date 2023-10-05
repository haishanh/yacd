import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import * as React from 'react';
import { LogOut } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { updateConfigs } from '$src/api/configs';
import * as logsApi from '$src/api/logs';
import Select from '$src/components/shared/Select';
import {
  darkModePureBlackToggleAtom,
  latencyTestUrlAtom,
  selectedChartStyleIndexAtom,
  useApiConfig,
} from '$src/store/app';
import { useClashConfig } from '$src/store/configs';
import { ClashGeneralConfig } from '$src/store/types';

import Button from './Button';
import s0 from './Config.module.scss';
import { ContentHeader } from './ContentHeader';
import { ToggleInput } from './form/Toggle';
import Input, { SelfControlledInput } from './Input';
import { Selection2 } from './Selection';
import TrafficChartSample from './TrafficChartSample';

const { useEffect, useState, useCallback, useRef, useMemo } = React;

const propsList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const logLeveOptions = [
  ['debug', 'Debug'],
  ['info', 'Info'],
  ['warning', 'Warning'],
  ['error', 'Error'],
  ['silent', 'Silent'],
];

const portFields = [
  { key: 'port', label: 'HTTP Proxy Port' },
  { key: 'socks-port', label: 'SOCKS5 Proxy Port' },
  { key: 'mixed-port', label: 'Mixed Port' },
  { key: 'redir-port', label: 'Redir Port' },
];

const langOptions = [
  ['zh', '中文'],
  ['en', 'English'],
];

const modeOptions = [
  ['Global', 'Global'],
  ['Rule', 'Rule'],
  ['Direct', 'Direct'],
];

export default function ConfigContainer() {
  const { data } = useClashConfig();
  return <Config configs={data} />;
}

type ConfigImplProps = {
  configs: ClashGeneralConfig;
};

function Config({ configs }: ConfigImplProps) {
  const navigate = useNavigate();
  const [latencyTestUrl, setLatencyTestUrl] = useAtom(latencyTestUrlAtom);
  const [selectedChartStyleIndex, setSelectedChartStyleIndex] = useAtom(
    selectedChartStyleIndexAtom,
  );
  const apiConfig = useApiConfig();
  const [configState, setConfigStateInternal] = useState(configs);
  const refConfigs = useRef(configs);
  useEffect(() => {
    if (refConfigs.current !== configs) {
      setConfigStateInternal(configs);
    }
    refConfigs.current = configs;
  }, [configs]);
  const setConfigState = useCallback(
    (name: keyof ClashGeneralConfig, val: ClashGeneralConfig[keyof ClashGeneralConfig]) => {
      setConfigStateInternal({ ...configState, [name]: val });
    },
    [configState],
  );

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateConfigs(apiConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/configs'] });
    },
  });

  const handleSwitchOnChange = useCallback(
    (checked: boolean) => {
      const name = 'allow-lan';
      const value = checked;
      setConfigState(name, value);
      mutation.mutate({ 'allow-lan': value });
    },
    [mutation, setConfigState],
  );

  const handleChangeValue = useCallback(
    ({ name, value }) => {
      switch (name) {
        case 'mode':
        case 'log-level':
          setConfigState(name, value);
          mutation.mutate({ [name]: value });
          if (name === 'log-level') {
            logsApi.reconnect({ ...apiConfig, logLevel: value });
          }
          break;
        case 'redir-port':
        case 'socks-port':
        case 'mixed-port':
        case 'port':
          if (value !== '') {
            const num = parseInt(value, 10);
            if (num < 0 || num > 65535) return;
          }
          setConfigState(name, value);
          break;
        default:
          return;
      }
    },
    [apiConfig, mutation, setConfigState],
  );

  const handleInputOnChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => handleChangeValue(e.target),
    [handleChangeValue],
  );

  const handleInputOnBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (e) => {
      const target = e.target;
      const { name, value } = target;
      switch (name) {
        case 'port':
        case 'socks-port':
        case 'mixed-port':
        case 'redir-port': {
          const num = parseInt(value, 10);
          if (num < 0 || num > 65535) return;
          mutation.mutate({ [name]: num });
          break;
        }
        case 'latencyTestUrl': {
          setLatencyTestUrl(value);
          break;
        }
        default:
          throw new Error(`unknown input name ${name}`);
      }
    },
    [mutation, setLatencyTestUrl],
  );

  const mode = useMemo(() => {
    const m = configState.mode;
    return typeof m === 'string' && m[0].toUpperCase() + m.slice(1);
  }, [configState.mode]);

  const [pureBlack, setPureBlack] = useAtom(darkModePureBlackToggleAtom);

  const { t, i18n } = useTranslation();

  return (
    <div>
      <ContentHeader title={t('Config')} />
      <div className={s0.root}>
        {portFields.map((f) =>
          configState[f.key] !== undefined ? (
            <div key={f.key}>
              <div className={s0.label}>{f.label}</div>
              <Input
                name={f.key}
                value={configState[f.key]}
                onChange={handleInputOnChange}
                onBlur={handleInputOnBlur}
              />
            </div>
          ) : null,
        )}

        <div>
          <div className={s0.label}>Mode</div>
          <Select
            options={modeOptions}
            selected={mode}
            onChange={(e) => handleChangeValue({ name: 'mode', value: e.target.value })}
          />
        </div>

        <div>
          <div className={s0.label}>Log Level</div>
          <Select
            options={logLeveOptions}
            selected={configState['log-level']}
            onChange={(e) => handleChangeValue({ name: 'log-level', value: e.target.value })}
          />
        </div>

        <div className={s0.item}>
          <ToggleInput
            id="config-allow-lan"
            checked={configState['allow-lan']}
            onChange={handleSwitchOnChange}
          />
          <label htmlFor="config-allow-lan">Allow LAN</label>
        </div>
      </div>

      <div className={s0.sep}>
        <div />
      </div>

      <div className={s0.section}>
        <div>
          <div className={s0.label}>{t('latency_test_url')}</div>
          <SelfControlledInput
            name="latencyTestUrl"
            type="text"
            value={latencyTestUrl}
            onBlur={handleInputOnBlur}
          />
        </div>
        <div>
          <div className={s0.label}>{t('lang')}</div>
          <div>
            <Select
              options={langOptions}
              selected={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className={s0.label}>{t('chart_style')}</div>
          <Selection2
            OptionComponent={TrafficChartSample}
            optionPropsList={propsList}
            selectedIndex={selectedChartStyleIndex}
            onChange={(v: string) => setSelectedChartStyleIndex(parseInt(v, 10))}
          />
        </div>
        <div>
          <div className={s0.label}>
            {t('current_backend')}
            <p>{apiConfig.baseURL}</p>
          </div>
          <div className={s0.label}>Action</div>
          <Button
            start={<LogOut size={16} />}
            label={t('switch_backend')}
            onClick={() => navigate('/backend')}
          />
        </div>
        <div className={s0.item}>
          <ToggleInput
            id="dark-mode-pure-black-toggle"
            checked={pureBlack}
            onChange={setPureBlack}
          />
          <label htmlFor="dark-mode-pure-black-toggle">
            {t('dark_mode_pure_black_toggle_label')}
          </label>
        </div>
      </div>
    </div>
  );
}
