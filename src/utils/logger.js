const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log('[ChatGPT Notifier]', ...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error('[ChatGPT Notifier]', ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[ChatGPT Notifier]', ...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info('[ChatGPT Notifier]', ...args);
    }
  }
}; 
