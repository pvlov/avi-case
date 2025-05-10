export type Result<T, E> = {
  value?: T;
  error?: E;
};

export const ok = <T, E>(value: T): Result<T, E> => {
  return {
    value,
  } as Result<T, E>;
};

export const err = <T, E>(error: E): Result<T, E> => {
  return {
    error,
  } as Result<T, E>;
};

export const isError = <T, E>(result: Result<T, E>): result is { error: E } => {
  return result.error ? true : false;
};

export const isSuccess = <T, E>(result: Result<T, E>): result is { value: T } => {
  return result.value ? true : false;
};

export function flatten<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const r of results) {
    if (isError(r)) {
      return err(r.error);
    }
    // isSuccess(r) guarantees r.value
    values.push(r.value as T);
  }
  return ok(values);
}

export type UploadInfo = { uri: string; mimeType: string };
