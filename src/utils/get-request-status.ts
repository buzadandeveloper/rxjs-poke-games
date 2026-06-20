import type { ResponseStatus } from '#types';

type RequestStatusFlags = {
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const getRequestStatus = (status?: ResponseStatus): RequestStatusFlags => ({
  isLoading: status === 'loading',
  isPending: status === 'pending',
  isSuccess: status === 'success',
  isError: status === 'error',
});
