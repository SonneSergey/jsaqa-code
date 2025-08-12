const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      let viewport = { width: 1280, height: 800 };
      if (config.env.device === "mobile") {
        viewport = { width: 375, height: 667 };
      }
      config.viewportWidth = viewport.width;
      config.viewportHeight = viewport.height;
      return config;
    },
  },
});
