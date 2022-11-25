module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn serve',
      startServerReadyPattern: 'listening',
      startServerReadyTimeout: 10000,
      url: ['http://localhost:3000/'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
