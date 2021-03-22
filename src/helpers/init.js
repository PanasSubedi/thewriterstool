const initializeDB = () => {
  return fetch('/api/initializeDatabase');
}

export { initializeDB };
