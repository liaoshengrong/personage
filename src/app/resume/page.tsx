import React from "react";
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";

const Resume: React.FC = () => {
  return (
    <PageContainer>
      <Navbar stop />
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-y-auto overflow-x-hidden mt-8 animate__animated animate__fadeInUp">
        <div className="p-8">
          {/* 头部信息 */}
          <header className="mb-10 border-b pb-4">
            <h1 className="text-4xl font-bold text-gray-800">廖声荣</h1>
            <p className="mt-2 text-lg text-gray-600">26岁丨4年 前端</p>
            <p className="mt-2 text-lg text-gray-600">📧 14796743426@163.com</p>
            <p className="mt-2 text-lg">
              博客:{" "}
              <a
                href="https://shengrong.netlify.app/"
                className="text-blue-500 hover:underline"
              >
                https://shengrong.netlify.app/
              </a>
            </p>
          </header>

          {/* 个人技能 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">
              🔧 个人技能
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li className="leading-6">
                熟练掌握 React/Vue2/Vue3/Taro 小程序的开发使用。
              </li>
              <li className="leading-6">
                熟练掌握 HTML/Css/Javascript/TypeScript 等常用语法。
              </li>
              <li className="leading-6">
                熟悉使用 jest 编写 vm 层的 unit test。
              </li>
              <li className="leading-6">
                熟悉使用 Webpack、Vite
                工具做项目工程化，能不依赖官方脚手架搭建项目基础框架，
                熟练开发自定义 plugins 做自动化程序，以提高开发效率。
              </li>
              <li className="leading-6">
                熟练使用 git 等常用操作和 git hooks 进行代码和自动化管理。
              </li>
              <li className="leading-6">
                熟练使用 eslint 把控质量，使用 perttier 代码风格，使用 husky
                做提交规范。
              </li>
              <li className="leading-6">
                了解 react 源码，fiber 对象，scheduler，reconciler，commit，diff
                算法。
              </li>
            </ul>
          </section>

          {/* 工作经历 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">
              💻 工作经历
            </h2>
            {/* 深圳志远融通科技 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                深圳志远融通科技
              </h3>
              <p className="text-gray-500">前端开发工程师 (2022.8 - 2024.9)</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
                <li>
                  负责项目从 0 到 1 的独立开发搭建、组件/hooks 封装，参与 APP
                  项目的开发。
                </li>
                <li>
                  技术：React、React Native、Typescript、Jotai、Webpack、Jest。
                </li>
              </ul>
            </div>
            {/* 中电金信软件 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                中电金信软件
              </h3>
              <p className="text-gray-500">前端开发工程师 (2020.5 - 2022.8)</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
                <li>
                  前期负责数据展示页开发，后期负责需求分配、定制规范及图表组件封装等。
                </li>
                <li>技术：React、Umi、Echarts、Redux。</li>
              </ul>
            </div>
          </section>

          {/* 项目经验 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">
              💻 项目经验
            </h2>

            {/* 8c Game 平台 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                8c Game 平台
              </h3>
              <p className="text-gray-500">
                技术栈：React + Typescript + Jotai
              </p>
              <p className="mt-2 text-gray-600 leading-6">
                项目描述：该平台是给海外游戏做入口的 H5
                页面，展示游戏部门所开发的项目入口。涉及登录、注册、个人中心、个人钱包、游戏列表、游戏分类、游戏数据、游戏道具以及道具商城等。
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                <li className="leading-6">
                  基于 react-cli 和 webpack 做基础搭建，环境变量注入、配置
                  less、文件压缩、组件库按需加载等。开发自定义
                  plugin，实现静态资源自动化枚举和自动化约定式路由，提高项目开发效率。
                </li>
                <li className="leading-6">
                  为保证 Mock 数据的时效性，实现自动化更新
                  Mock，简化流程至一条指令即可开启 Mock 环境。
                </li>
                <li className="leading-6">
                  通过 React.lazy、prefetch、splitChunks、Tree shaking
                  等技术做项目加载优化，将首屏时间优化至 1.9s~2.3s 之间。
                </li>
                <li className="leading-6">
                  利用 fixBabelImports、source map、compression-webpack-plugin
                  等优化项目体积至 60%。
                </li>
                <li className="leading-6">
                  使用 thread-loader 和 cache、resolve.modules、noParse
                  等配置项提高构建效率。
                </li>
                <li className="leading-6">
                  对 antd 进行二次封装，封装
                  GameList、HorizontalTabs、CommonModal、FormModal 等组件。
                </li>
              </ol>
            </div>

            {/* Wealth */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Wealth</h3>
              <p className="text-gray-500">
                技术栈：React Native + Typescript + Nestjs + Jest
              </p>
              <p className="mt-2 text-gray-600 leading-6">
                项目描述：保险公司推出的基金购买平台，App 同时发布在 iOS 和
                Android 的应用市场，对于不同国家开发对应的功能模块，使用前端 BFF
                层做配置以区分和数据处理。
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                <li className="leading-6">
                  参与使用 React Native 开发 iOS、Android 和 Web 平台，利用
                  webpack 中的 resolve.extensions
                  配置项实现动态文件解析，以区分某些 Web 的特殊组件和页面文件。
                </li>
                <li className="leading-6">
                  为提高代码的可读性、可维护性以及方便书写 unit test，模仿 MVVM
                  架构模式分割代码层次。
                </li>
                <li className="leading-6">
                  利用 lokalise 和 git pre commit
                  实现双向国际化语言同步，以方便客户方修改国际化文案，实现自动化文件同步。
                </li>
                <li className="leading-6">
                  为减少页面请求以及定制化 API（App/Web、HK/SG），使用 Nestjs +
                  GraphQL 开发 BFF 层。
                </li>
                <li className="leading-6">
                  配合后台使用双 Token
                  无感刷新模式，实现（Web）多系统之间的单点登录。
                </li>
              </ol>
            </div>

            {/* Wealth admin */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Wealth admin
              </h3>
              <p className="text-gray-500">技术栈：Vue3、Vite、pinia</p>
              <p className="mt-2 text-gray-600 leading-6">
                项目描述：针对保险的 Wealth
                项目的数据，开发的后台管理项目，以便查看/管理用户、收益、偏好等用户信息。
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                <li className="leading-6">
                  增加页面配置，统一管理页面形式，以区分是否需要 keep-alive
                  做路由状态缓存。
                </li>
                <li className="leading-6">
                  二次封装 Element UI 基础组件，以统一项目组件的风格和使用。
                </li>
                <li className="leading-6">
                  配置 run dev:mock，利用 vite-plugin-mock 实现前端 mock
                  环境和数据。
                </li>
                <li className="leading-6">
                  利用 vite.config 中 rollupOptions.output.manualChunks
                  做分包策略，以避免 node_modules 下的文件多次请求和多次打包。
                </li>
              </ol>
            </div>

            {/* Ko咖啡小程序 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Ko咖啡小程序
              </h3>
              <p className="text-gray-500">技术栈：Taro + Typescript</p>
              <p className="mt-2 text-gray-600 leading-6">
                项目描述：给自动咖啡制作设备提供小程序点单功能，使用微信扫码进入小程序，具备基本的点单功能和模块。
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                <li className="leading-6">
                  基于 Taro 完成项目基本搭建（包含
                  pages、window、tabBar、permission 等），利用 Taro 内置 API
                  完成登录、支付和分享等功能。
                </li>
                <li className="leading-6">
                  因小程序 bundle 体积问题，利用 config subpackages
                  配置实现主包加载和次包懒加载功能优化。
                </li>
                <li className="leading-6">
                  利用 Taro 内置 getCurrentPages 和 relaunch
                  来避开路由栈（最大：10）的限制问题。
                </li>
                <li className="leading-6">
                  使用 Web API 中的 IntersectionObserver
                  实现咖啡列表页接口分页请求。
                </li>
              </ol>
            </div>

            {/* 腾讯 Databrain 数据大脑 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                腾讯 Databrain 数据大脑
              </h3>
              <p className="text-gray-500">
                技术栈：Umijs + Typescript + Echats
              </p>
              <p className="mt-2 text-gray-600 leading-6">
                项目描述：腾讯共培项目，打造数据大脑平台，对 Mobile、PC、Console
                平台的游戏数据进行经济、舆论、情报分析。利用微前端技术，将其分为情报、经分、舆情、看板系统。
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                <li className="leading-6">
                  基于开发业务需求封装一些公用的 React
                  hook，以便其他开发人员使用。
                </li>
                <li className="leading-6">
                  因有大量的图表数据展示需要，基于 Echats 封装常用的图表组件。
                </li>
                <li className="leading-6">
                  利用 umi locale 配置对应的 JSON 文件和内置 setLocale
                  API，以实现多语言国际化。
                </li>
                <li className="leading-6">
                  重构原有的页面，将逻辑部分进行抽离，封装成可复用组件。
                </li>
              </ol>
            </div>
          </section>

          {/* 教育经历 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">
              🎓 教育经历
            </h2>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                南昌教育学院
              </h3>
              <p className="text-gray-500">大专 (2017.09 - 2020.07)</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                西南科技大学
              </h3>
              <p className="text-gray-500">
                本科（计算机科与技术） (2022.03 - 2024.06)
              </p>
              <p className="mt-2 text-gray-600">
                主修课程：数据结构、操作系统、计算机组成原理、计算机网络、Web
                开发
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Resume;
