export const apiConfig: { exposedHeaders: string[]; authTokenHeaderKey: string } = {
  exposedHeaders: [],
  authTokenHeaderKey: 'api-auth-token',
};

apiConfig.exposedHeaders.push(apiConfig.authTokenHeaderKey);
