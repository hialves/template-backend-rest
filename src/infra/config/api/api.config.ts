export const apiConfig: { exposedHeaders: string[]; accessTokenHeaderKey: string } = {
  exposedHeaders: [],
  accessTokenHeaderKey: process.env.EXPOSED_ACCESS_TOKEN_HEADER,
};

apiConfig.exposedHeaders.push(apiConfig.accessTokenHeaderKey);
