const chokidar = require("chokidar");
const convertXlsxToJson = require("./xlsxToJson");
class XlsxWatcherPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap("XlsxWatcherPlugin", () => {
      const watcher = chokidar.watch(this.options.filePath, {
        persistent: true,
      });

      watcher
        .on("change", (path) => {
          console.log(`File ${path} has been changed. Executing script...`);
          // 在这里执行你的脚本逻辑，例如调用 convertXlsxToJson 函数
          // 你需要确保这个函数在这个作用域内可访问或通过其他方式导入
          // 示例：convertXlsxToJson(filePath, outputJsonPath);
          convertXlsxToJson();
        })
        .on("error", (error) => console.error(`Watcher error: ${error}`));

      console.log(`Started watching ${this.options.filePath} for changes.`);
    });
  }
}

module.exports = XlsxWatcherPlugin;
