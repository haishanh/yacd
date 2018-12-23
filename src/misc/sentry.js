const dsn = 'https://7068a15928ae45cf884dd8398fe8649c@sentry.io/1359284';
let Sentry;
export async function getSentry() {
  if (Sentry) return Sentry;
  const s = await import('@sentry/browser');
  s.init({ dsn });
  Sentry = s;
  return Sentry;
}
