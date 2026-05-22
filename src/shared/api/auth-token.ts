/**
 * Provider de token Clerk. Se inyecta desde `<ClerkAuthBridge />` en el bootstrap
 * para evitar acoplar el cliente Axios al SDK de Clerk (testeable sin Clerk).
 */
type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter = async () => null;

export const setAuthTokenGetter = (fn: TokenGetter): void => {
  tokenGetter = fn;
};

export const getAuthToken = (): Promise<string | null> => tokenGetter();
