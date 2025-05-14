export const sanitizeInput = (input) => {
  return String(input).replace(/[^a-zA-Z0-9]/g, '');
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
