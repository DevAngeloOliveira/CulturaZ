export const never = (value: never): never => {
  throw new Error(`Caso não tratado: ${JSON.stringify(value)}`);
};

export const assertDefined = <T>(value: T | null | undefined, message?: string): T => {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Valor esperado não estava definido');
  }
  return value;
};
