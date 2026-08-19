import test from 'node:test';
import assert from 'node:assert/strict';
import { runPopupWithRedirectFallback } from './authFlow';

test('falls back to redirect when the popup is blocked', async () => {
  let redirectCalls = 0;

  const result = await runPopupWithRedirectFallback(
    async () => {
      throw { code: 'auth/popup-blocked' };
    },
    async () => {
      redirectCalls += 1;
    },
  );

  assert.equal(result, null);
  assert.equal(redirectCalls, 1);
});

test('rethrows authentication errors unrelated to popup blocking', async () => {
  const originalError = { code: 'auth/unauthorized-domain' };

  await assert.rejects(
    () => runPopupWithRedirectFallback(
      async () => {
        throw originalError;
      },
      async () => {
        throw new Error('redirect should not run');
      },
    ),
    (error) => error === originalError,
  );
});
