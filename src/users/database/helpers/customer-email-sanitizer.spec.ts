import { sanitizeEmail } from './customer-email-sanitizer';

it('returns sanitized email when provided', () => {
  expect(sanitizeEmail(' Dev@applifting.cz ')).toStrictEqual(
    'dev@applifting.cz',
  );
});

it('returns null when email not provided (eg. due to database relation joining)', () => {
  expect(sanitizeEmail(null)).toStrictEqual(null);
});
