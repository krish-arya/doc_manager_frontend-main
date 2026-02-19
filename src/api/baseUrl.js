const FALLBACK_API_BASE_URL = 'http://164.52.203.8:8081/api';

export const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL || FALLBACK_API_BASE_URL;

  if (configuredBaseUrl.startsWith('https://164.52.203.8:8081')) {
    return configuredBaseUrl.replace('https://164.52.203.8:8081', 'http://164.52.203.8:8081');
  }

  return configuredBaseUrl;
};
