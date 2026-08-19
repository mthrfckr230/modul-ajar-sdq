export const isPopupBlockedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: string }).code === 'auth/popup-blocked';
};

export async function runPopupWithRedirectFallback<T>(
  openPopup: () => Promise<T>,
  openRedirect: () => Promise<void>,
): Promise<T | null> {
  try {
    return await openPopup();
  } catch (error) {
    if (!isPopupBlockedError(error)) throw error;
    await openRedirect();
    return null;
  }
}
