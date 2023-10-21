export const loadItem = (key) => {

  return JSON.parse(localStorage.getItem(key));
};

export const saveItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
