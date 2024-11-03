// orval.config.js
module.exports = {
  myApi: {
    output: {
      target: "./src/api/myApi.ts",
      client: "fetch",
      baseUrl: "http://backend:8000",
    },
    input: "./openapi.json",
  },
};
