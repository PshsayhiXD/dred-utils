export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const generateId = () => Math.random().toString(36).substring(2, 15);
