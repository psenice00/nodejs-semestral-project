export const sanitizeEmail = (email: string | null): string | null => {
  return email?.trim()?.toLowerCase() ?? null;
};
