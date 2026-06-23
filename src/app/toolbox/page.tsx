import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../_components/Navbar';
import PageContainer from '../_components/PageContainer';
import Breadcrumb from '../_components/Breadcrumb';

export const metadata: Metadata = {
  title: '工具箱',
  description: '实用工具集合，包含 Agnes AI 多模态 Playground 等',
};

const tools = [
  {
    title: 'Agnes AI',
    description: '多模态 AI Playground：文本对话、图像生成、视频生成、我的作品',
    href: '/toolbox/agnes-ai',
    tags: ['文本', '图像', '视频'],
  },
  {
    title: '世界杯积分榜',
    description: '2026 美加墨世界杯 12 组积分榜，点击球队查看已赛比分与未赛场次',
    href: '/toolbox/worldcup-groups',
    tags: ['足球', '世界杯', '积分榜'],
  },
];

export default function ToolboxPage() {
  return (
    <PageContainer>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 w-full">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">工具箱</h1>
          <p className="mt-2 text-sm text-gray-600">
            实用小工具集合，点击卡片进入详情
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[#6c32fe]/40 hover:shadow-md"
            >
              <h2 className="text-lg font-medium text-gray-900 group-hover:text-[#6c32fe]">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
