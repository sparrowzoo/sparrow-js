const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
      title: "环球校展",
      entry: "src/main.js"
    }
  },
  transpileDependencies: true,
  lintOnSave: false
})
