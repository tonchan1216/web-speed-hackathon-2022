module.exports = {
  ci: {
    collect: {
      startServerCommand: "yarn serve",
      startServerReadyPattern: "listening",
      startServerReadyTimeout: 10000,
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/races/75fd1163-92a8-4a91-bd73-28923da4e94b/race-card",
        "http://localhost:3000/races/75fd1163-92a8-4a91-bd73-28923da4e94b/odds",
        "http://localhost:3000/races/99e14598-3b86-49ef-857c-6a2a678b3888/odds",
        "http://localhost:3000/races/75fd1163-92a8-4a91-bd73-28923da4e94b/result",
      ],
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
