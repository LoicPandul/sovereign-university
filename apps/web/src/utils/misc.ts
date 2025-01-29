export const getDomain = () => {
  return window.location.hostname;
};

export const isDevelopmentEnvironment = () =>
  window.location.hostname.startsWith('localhost');

export const isTestnetOrDevelopmentEnvironment = () =>
  isDevelopmentEnvironment() || window.location.hostname.startsWith('testnet');
