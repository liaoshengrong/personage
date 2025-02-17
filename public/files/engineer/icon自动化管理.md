前端开发过程中，图标资源是必不可少的，在平时我们使用图标时，一般会这样使用：

```js
import avatar from '@/assets/svg/avatar.svg'
// 或者
const avatar = require('@/assets/svg/avatar.svg')

<Image src={avatar} />
```

如果有大量的图标，那么就会造成代码量增加，影响代码的可维护性,例如这样：

```js
import avatar from "@/assets/svg/avatar.svg";
import avatar1 from "@/assets/svg/avatar1.svg";
import avatar2 from "@/assets/svg/avatar2.svg";
import avatar3 from "@/assets/svg/avatar3.svg";
import avatar4 from "@/assets/svg/avatar4.svg";
import avatar5 from "@/assets/svg/avatar5.svg";
import avatar6 from "@/assets/svg/avatar6.svg";
// 或者
const avatar = require("@/assets/svg/avatar.svg");
const avatar1 = require("@/assets/svg/avatar1.svg");
const avatar2 = require("@/assets/svg/avatar2.svg");
const avatar3 = require("@/assets/svg/avatar3.svg");
// ...
```

这样写出来的代码，大大的影响了代码的优雅性。通过观察，我们不难发现，路径有很大一截是公共的，可以提取出来。

```js
const loadIcon = (name: string) => {
  return require(`@/assets/svg/${name}.svg`);
};
// 在使用时：
<Image src={loadIcon("avatar")} />;
```

**但是**我们又会发现一个问题，我们在写"avatar"时，没有 ts 的类型提示，不像写 require 或者 import 路径一样，有提示。  
所以我们可以把`name:string`改成`name: IconName`，IconName 是一个 ts 类型，它应该包含所有的图标名。

```ts
type IconName =
  | "avatar"
  | "avatar1"
  | "avatar2"
  | "avatar3"
  | "avatar4"
  | "avatar5"
  | "avatar6";
```

这样的话我们在写`loadIcon`时，就可以有提示了，但是问题又来了：  
我们每添加一个图标，都需要在`IconName`中添加一个类型，这样会很麻烦。
**可以把`IconName`改成自动生成吗？**

## webpack plugin 实现自动管理图标（webpack watchRun）

我们先来分析一下，在什么情况下需要更新`IconName`的类型?  
只要`文件变化`了，我们就需要更新`IconName`的类型。  
我们可以利用 webpack 自定义插件来实现这个功能。  
直接附上全部代码。

```js
const fs = require("fs");
const path = require("path");
const globSync = require("glob").sync;
// colors
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const read = (dir, typeName) => {
  const directory = path.resolve(__dirname, dir);
  const source = globSync("*", { cwd: directory });
  const names = source.map((icon) => `"${icon.split(".")[0]}"`);

  const typeContent = `export type ${typeName} = \n  | ${names.join("\n  | ")}`;
  return typeContent;
};

const write = (content, dir) => {
  const typesDirectory = path.resolve(__dirname, "../src/types/");
  fs.writeFileSync(path.join(typesDirectory, dir), content);
};

const updateSvg = () => {
  const svgDir = "../src/assets/svg/";

  const svgContext = read(svgDir, "SvgTypes");
  write(svgContext, "svg.ts");
  logGreen("svg types updated successfully!");
};

const updateIconEnum = (compiler) => {
  let svgSize = fs.readdirSync(svg_path).length;

  // webpack watchRun
  compiler.hooks.watchRun.tap("updateIconEnum", (compilation) => {
    const newSvgSize = fs.readdirSync(svg_path).length;
    if (svgSize !== newSvgSize) updateSvg();
    svgSize = newSvgSize;
  });
};
module.exports = {
  apply: updateIconEnum,
};
```

代码不多，也较为简单，主要是读取 svg 目录下的文件，然后生成一个类型，写入到 types 目录下。
**主要知识点：webpack watchRun**
