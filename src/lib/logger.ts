/* eslint-disable no-console */
// Minimal structured logger used across server-side code.
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

function envLevel(): LogLevel {
  const v = (process.env.LOG_LEVEL || 'info').toLowerCase();
  if (v === 'debug' || v === 'info' || v === 'warn' || v === 'error' || v === 'silent') return v;
  return 'info';
}

const CURRENT = envLevel();

function shouldLog(level: LogLevel) {
  return LEVELS[level] >= LEVELS[CURRENT];
}

function formatMessage(level: LogLevel, msg: unknown) {
  const base = { level, time: new Date().toISOString() };
  if (typeof msg === 'string') return JSON.stringify({ ...base, msg });
  try {
    return JSON.stringify({ ...base, msg });
  } catch {
    return JSON.stringify({ ...base, msg: String(msg) });
  }
}

export const logger = {
  debug: (m: unknown) => {
    if (shouldLog('debug')) console.debug(formatMessage('debug', m));
  },
  info: (m: unknown) => {
    if (shouldLog('info')) console.info(formatMessage('info', m));
  },
  warn: (m: unknown) => {
    if (shouldLog('warn')) console.warn(formatMessage('warn', m));
  },
  error: (m: unknown) => {
    if (shouldLog('error')) console.error(formatMessage('error', m));
  },
};

export default logger;
