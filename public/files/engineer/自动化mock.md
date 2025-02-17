**触发场景：** 后端服务挂了，用 mock 又是旧数据，前端推进工作受到阻碍。想必大家都碰到过类似的情况。手动更新 mock 数据太麻烦了。  
于是我想到一个方案，永久性解决该问题。

## 思路

1. 在服务端正常时，自动更新 mock 数据
2. 在服务端异常时，使用`yarn start:mock` 进入 mock 环境

## 实现

根据以往的 mock 经验，我们需要准备一个地方，来存放我们的 json 文件以备后续 mock 时使用，而这些文件往往需要我们手动维护。所以我思考的第一步就是：  
**能否在每一次服务端请求时，自动更新 mock 数据？**

## 请求拦截

首先，我们会想到拦截请求响应，例如：axios 的 interceptors，但是我们需要拦截到请求后，去操作 json 文件，所以不能在浏览器的执行环境中去做自动更新。  
那么，我们就只能另寻他法。在 webapck 中，我们一般会做 devServer 的 proxy 配置去做请求代理，可以尝试在这里去入手。

```js
const isMock = process.env.REACT_APP_ENV === "mock";

devServer: {
     proxy: {
        "/api/v1": {
          target: process.env.API_URL,
          changeOrigin: true,
          onProxyRes: !isMock ? updateMock : () => { }
        },
      },
}
// 在不是mock才执行更新mock数据的方法（process.env想必大家都会配置）
```

onProxyRes 提供了 proxyRes、req、res 三个参数。我们可以通过 req.url 来确定需要更新的 json 文件。具体看如下：

```js
const updateMock = (proxyRes, req) => {
  const pathName = req.url.split("?")[0];
  const fileName = pathName.slice(base_url.length).replace(/\//g, "-");

  let body = "";
  // 这里是解密响应数据，可以根据proxyRes.headers['content-encoding']来判断是gzip还是br
  const result = proxyRes.pipe(zlib.createBrotliDecompress());
  result.on("data", (chunk) => {
    body += chunk.toString("utf8");
  });

  result.on("end", () => {
    try {
      const formatBody = JSON.stringify(JSON.parse(body), null, 2);
      const json_path = path.join(__dirname, "../mock/", fileName + ".json");
      fs.writeFileSync(json_path, formatBody);、
    } catch (error) {
      console.log("mock数据同步失败", error, pathName);
    }
  });
};
```

我们可以尝试一下使用 mock 数据。  
在 webpack config 中，我们添加了一个 mock 插件：

```js
// webpack confgi plugins
isMock &&
  new MockWebpackPlugin({
    config: mockConfig,
    port: 5000,
  });
// mockConfig.js
const path = require("path");
module.exports = {
  "/api/v1/dict": {
    path: path.join(__dirname, "./dict.json"),
  },
};
```

到这里，我们就已经实现了自动更新 json 文件了。
但是 mockCofig.js 这个文件，还是需要我们手动维护，**能否把入口文件也改成自动维护呢？**

## 自动生成 mockConfig.js

我们既然知道了 req.url 和 json 文件的位置，那我们就可以根据这两个信息去生成 mockConfig.js 里的内容。

```js
// update-mock.js
const mockConfig = require("../mock");
// ...
// result.on
result.on("end", () => {
  try {
    const formatBody = JSON.stringify(JSON.parse(body), null, 2);
    const json_path = path.join(__dirname, "../mock/", fileName + ".json");
    fs.writeFileSync(json_path, formatBody);
    createMock(fileName, pathName);
  } catch (error) {
    console.log("mock数据同步失败", error, pathName);
  }
});

const url_map = {};
const createMock = (name, url) => {
  if (mockConfig[url]) return;

  url_map[name] = url;
  mockConfig[`[url_map['${name}']]`] = {
    path: `path.join(__dirname, './${name}.json')`,
  };

  const mock_content = `
const path = require('path');
const url_map = ${JSON.stringify(url_map, null, 2)}
module.exports = ${JSON.stringify(mockConfig, null, 2).replace(/"/g, "")}
`;

  fs.writeFileSync(path.join(__dirname, "../mock/index.js"), mock_content);
};
```

最终，我们可以看到 mockConfig.js 的内容：

```js
const path = require("path");
const url_map = {
  dict: "/api/v1/dict",
};
module.exports = {
  [url_map["dict"]]: {
    path: path.join(__dirname, "./dict.json"),
  },
};
```

虽然 mockConfig.js 的内容是自动生成了，但我们手动去修改后，也不会覆盖。  
到这里，我们就**大功告成**了。  
但是还有个问题，我在本地开发时，可能会频繁的去请求同一个 api，这样每次都会触发 mock 更新，我不需要这么频繁。  
**模拟浏览器缓存，加个 max-age**

## mock 缓存时间

我们可以先准备一个 cacheConfig.js 文件，里面记录着以下信息：

```js
module.exports = {
  cache_time: 60 * 60 * 1000, // 缓存时间1小时
  // 每个api上次更新的时间（自动生成）
  dict: 1725185557517,
  "initialize-data": 1725185557540,
  "recharge-channels": 1725185567662,
  profile: 1725185581496,
  "games-favorite": 1725185567693,
};
```

如何去自动生成？其实也是大同小异，添加如下代码:

```js
// update-mock.js
const cacheConfig = require("../mock/cache-config");
const cache_time = cacheConfig.cache_time;

// updateMock 函数
const noUpdate = cacheConfig[fileName] + cache_time > dayjs().valueOf();
if (noUpdate && cacheConfig[fileName]) return;

// result.on
cacheConfig[fileName] = dayjs().valueOf();
const cache_content = `module.exports = ${JSON.stringify(
  cacheConfig,
  null,
  2
)}`;
fs.writeFileSync(
  path.join(__dirname, "../mock/cache-config.js"),
  cache_content
);
```

## 总结

1. 通过拦截请求，拦截到请求后，去操作 json 文件，实现自动更新。
2. 通过自动生成 mockConfig.js，实现自动维护。
3. 通过自动生成 cacheConfig.js，避免频繁重复更新

附上完整 update-mock.js 代码:

```js
const path = require("path");
const zlib = require("zlib");
const fs = require("fs");
const cacheConfig = require("../mock/cache-config");
const base_url = "/api/vi/";

const mockConfig = require("../mock");
const dayjs = require("dayjs");
const cache_time = cacheConfig.cache_time;
const updateMock = (proxyRes, req) => {
  const pathName = req.url.split("?")[0];
  const fileName = pathName.slice(base_url.length).replace(/\//g, "-");
  console.log("同步Mock数据");
  const noUpdate = cacheConfig[fileName] + cache_time > dayjs().valueOf();
  if (noUpdate && cacheConfig[fileName]) return;

  console.log(fileName, dayjs().valueOf() - cacheConfig[fileName]);

  let body = "";
  const result = proxyRes.pipe(zlib.createBrotliDecompress());

  result.on("data", (chunk) => {
    body += chunk.toString("utf8");
  });

  result.on("end", () => {
    try {
      const formatBody = JSON.stringify(JSON.parse(body), null, 2);
      const json_path = path.join(__dirname, "../mock/", fileName + ".json");

      console.log(fileName, "写入中。。。");
      cacheConfig[fileName] = dayjs().valueOf();
      const cache_content = `module.exports = ${JSON.stringify(
        cacheConfig,
        null,
        2
      )}`;
      fs.writeFileSync(
        path.join(__dirname, "../mock/cache-config.js"),
        cache_content
      );
      fs.writeFileSync(json_path, formatBody);
      createMock(fileName, pathName);
    } catch (error) {
      console.log("mock数据同步失败", error, pathName);
    }
  });
};
const url_map = {};
const createMock = (name, url) => {
  if (mockConfig[url]) return;

  url_map[name] = url;
  mockConfig[`[url_map['${name}']]`] = {
    path: `path.join(__dirname, './${name}.json')`,
  };

  const mock_content = `
const path = require('path');
const url_map = ${JSON.stringify(url_map, null, 2)}
module.exports = ${JSON.stringify(mockConfig, null, 2).replace(/"/g, "")}
`;

  fs.writeFileSync(path.join(__dirname, "../mock/index.js"), mock_content);
};

module.exports = updateMock;
```
