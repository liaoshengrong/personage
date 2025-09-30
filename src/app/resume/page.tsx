import React, { useState, useEffect } from 'react';
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import ProjectCard from "./ProjectCard";

const Resume: React.FC = () => {
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   setIsVisible(true);
  // }, []);

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="xs:px-5">
        <Navbar />
      </div>
      <div className="max-w-5xl mx-auto mt-6 mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-8 md:p-10">
            {/* 头部信息 */}
            <header className="mb-12 pb-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                    廖声荣
                  </h1>
                  <p className="mt-2 text-xl text-gray-600">
                    26岁 | 4年前端开发经验
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end text-sm text-gray-600 gap-2">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-500">📧</span>
                    <span className="hover:text-blue-500 transition-colors">14796743426@163.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-500">🔗</span>
                    <a
                      href="https://shengrong.netlify.app/"
                      className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      shengrong.netlify.app
                    </a>
                  </p>
                </div>
              </div>
            </header>

            {/* 个人技能 */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xl">🔧</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">个人技能</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟练掌握 React/Vue2/Vue3/Taro 小程序的开发使用。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟练掌握 HTML/Css/Javascript/TypeScript 等常用语法。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟悉使用 jest 编写 vm 层的 unit test。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟悉使用 Webpack、Vite 工具做项目工程化，能不依赖官方脚手架搭建项目基础框架，熟练开发自定义 plugins 做自动化程序，以提高开发效率。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟练使用 git 等常用操作和 git hooks 进行代码和自动化管理。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>熟练使用 eslint 把控质量，使用 perttier 代码风格，使用 husky 做提交规范。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>了解 react 源码，fiber 对象，scheduler，reconciler，commit，diff 算法。</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 工作经历 */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 text-xl">💼</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">工作经历</h2>
              </div>
              
              {/* 深圳志远融通科技 */}
              <div className="mb-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    深圳志远融通科技
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1 md:mt-0">
                    2022.8 - 2024.9
                  </p>
                </div>
                <p className="text-gray-600 font-medium mb-3">前端开发工程师</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>负责项目从 0 到 1 的独立开发搭建、组件/hooks 封装，参与 APP 项目的开发。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="font-medium">技术栈：</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">React</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">React Native</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Typescript</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Jotai</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Webpack</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Jest</span>
                  </li>
                </ul>
              </div>
              
              {/* 中电金信软件 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    中电金信软件
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1 md:mt-0">
                    2020.5 - 2022.8
                  </p>
                </div>
                <p className="text-gray-600 font-medium mb-3">前端开发工程师</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>前期负责数据展示页开发，后期负责需求分配、定制规范及图表组件封装等。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="font-medium">技术栈：</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">React</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Umi</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Echarts</span>
                    <span className="ml-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-sm">Redux</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 项目经验 */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 text-xl">💻</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">项目经验</h2>
              </div>

              {/* 腾讯SSV官网&admin */}
              <ProjectCard
                title="腾讯SSV官网&admin"
                techStack="Nextjs、Tailwind Css、zustand、TDesign"
                description="项目描述：该平台是腾讯ssv用于给各大机构介绍关于ssv的信息、产品、功能等作用，主要服务对象是已和ssv合作的机构和需要该能力的用户群体。"
                points={[
                  "基于Nextjs框架能力，区分服务端渲染和客户端渲染组件，以提升页面渲染性能",
                  "利用语义化标签、meta(og协议)和媒体属性等，做项目seo优化",
                  "使用framer-motion,@react-spring/web第三方库，实现队列动画，循环动画等过渡",
                  "为解决AI Tools结果页面接口loading缓慢问题，与后端协商使用Server-Sent Events流失传输方案，使页面可以逐个显示AI回复结果",
                  "利用iframe的容器特性，实现S大会页面的live streaming能力",
                ]}
              />
              {/* 8c Game 平台 */}
              <ProjectCard
                title="8c Game 平台"
                techStack="React + Typescript + Jotai"
                description="项目描述：该平台是给海外游戏做入口的 H5 页面，展示游戏部门所开发的项目入口。涉及登录、注册、个人中心、个人钱包、游戏列表、游戏分类、游戏数据、游戏道具以及道具商城等。"
                points={[
                  "基于 react-cli 和 webpack 做基础搭建，环境变量注入、配置 less、文件压缩、组件库按需加载等。开发自定义 plugin，实现静态资源自动化枚举和自动化约定式路由，提高项目开发效率。",
                  "为保证 Mock 数据的时效性，实现自动化更新 Mock，简化流程至一条指令即可开启 Mock 环境。",
                  "通过 React.lazy、prefetch、splitChunks、Tree shaking 等技术做项目加载优化，将首屏时间优化至 1.9s~2.3s 之间。",
                  "利用 fixBabelImports、source map、compression-webpack-plugin 等优化项目体积至 60%。",
                  "使用 thread-loader 和 cache、resolve.modules、noParse 等配置项提高构建效率。",
                  "对 antd 进行二次封装，封装 GameList、HorizontalTabs、CommonModal、FormModal 等组件。",
                ]}
              />

              {/* Wealth */}
              <ProjectCard
                title="Wealth"
                techStack="React Native + Typescript + Nestjs + Jest"
                description="项目描述：保险公司推出的基金购买平台，App 同时发布在 iOS 和 Android 的应用市场，对于不同国家开发对应的功能模块，使用前端 BFF 层做配置以区分和数据处理。"
                points={[
                  "参与使用 React Native 开发 iOS、Android 和 Web 平台，利用 webpack 中的 resolve.extensions 配置项实现动态文件解析，以区分某些 Web 的特殊组件和页面文件。",
                  "为提高代码的可读性、可维护性以及方便书写 unit test，模仿 MVVM 架构模式分割代码层次。",
                  "利用 lokalise 和 git pre commit 实现双向国际化语言同步，以方便客户方修改国际化文案，实现自动化文件同步。",
                  "为减少页面请求以及定制化 API（App/Web、HK/SG），使用 Nestjs + GraphQL 开发 BFF 层。",
                  "配合后台使用双 Token 无感刷新模式，实现（Web）多系统之间的单点登录。",
                ]}
              />

              {/* Wealth admin */}
              <ProjectCard
                title="Wealth admin"
                techStack="Vue3、Vite、pinia"
                description="项目描述：针对保险的 Wealth 项目的数据，开发的后台管理项目，以便查看/管理用户、收益、偏好等用户信息。"
                points={[
                  "增加页面配置，统一管理页面形式，以区分是否需要 keep-alive 做路由状态缓存。",
                  "二次封装 Element UI 基础组件，以统一项目组件的风格和使用。",
                  "配置 run dev:mock，利用 vite-plugin-mock 实现前端 mock 环境和数据。",
                  "利用 vite.config 中 rollupOptions.output.manualChunks 做分包策略，以避免 node_modules 下的文件多次请求和多次打包。",
                ]}
              />

              {/* Ko咖啡小程序 */}
              <ProjectCard
                title="Ko咖啡小程序"
                techStack="Taro + Typescript"
                description="项目描述：给自动咖啡制作设备提供小程序点单功能，使用微信扫码进入小程序，具备基本的点单功能和模块。"
                points={[
                  "基于 Taro 完成项目基本搭建（包含 pages、window、tabBar、permission 等），利用 Taro 内置 API 完成登录、支付和分享等功能。",
                  "因小程序 bundle 体积问题，利用 config subpackages 配置实现主包加载和次包懒加载功能优化。",
                  "利用 Taro 内置 getCurrentPages 和 relaunch 来避开路由栈（最大：10）的限制问题。",
                  "使用 Web API 中的 IntersectionObserver 实现咖啡列表页接口分页请求。",
                ]}
              />

              {/* 腾讯 Databrain 数据大脑 */}
              <ProjectCard
                title="腾讯 Databrain 数据大脑"
                techStack="Umijs + Typescript + Echats"
                description="项目描述：腾讯共培项目，打造数据大脑平台，对 Mobile、PC、Console 平台的游戏数据进行经济、舆论、情报分析。利用微前端技术，将其分为情报、经分、舆情、看板系统。"
                points={[
                  "基于开发业务需求封装一些公用的 React hook，以便其他开发人员使用。",
                  "因有大量的图表数据展示需要，基于 Echats 封装常用的图表组件。",
                  "利用 umi locale 配置对应的 JSON 文件和内置 setLocale API，以实现多语言国际化。",
                  "重构原有的页面，将逻辑部分进行抽离，封装成可复用组件。",
                ]}
              />

            </section>

            {/* 教育经历 */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <span className="text-amber-600 text-xl">🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">教育经历</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      西南科技大学
                    </h3>
                    <p className="text-sm font-medium text-amber-600 mt-1 md:mt-0">
                      2022.03 - 2024.06
                    </p>
                  </div>
                  <p className="text-gray-600 mb-2">本科（计算机科学与技术）</p>
                  <p className="text-sm text-gray-700">
                    主修课程：数据结构、操作系统、计算机组成原理、计算机网络、Web 开发
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      南昌教育学院
                    </h3>
                    <p className="text-sm font-medium text-amber-600 mt-1 md:mt-0">
                      2017.09 - 2020.07
                    </p>
                  </div>
                  <p className="text-gray-600">大专</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Resume;
