export const DOES_NOT_SUPPORT_FETCH = 0;

export const errors = {
  [DOES_NOT_SUPPORT_FETCH]: {
    message: 'Browser not supported!',
    detail: 'This browser does not support "fetch", please choose another one.',
  },
  default: {
    message: 'Oops, something went wrong!',
  },
};

export type Err = { code: number };

export function deriveMessageFromError(err: Err) {
  const { code } = err;
  if (typeof code === 'number') {
    return errors[code];
  }
  return errors.default;
}
