import type { Metadata } from 'next';
import { DM_Sans, Instrument_Serif } from 'next/font/google';
import { WorksProvider } from './_context/WorksContext';
import './_styles/agnes-index.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agnes AI',
  description: 'Agnes AI 多模态 Playground：文本对话、图像生成、视频生成',
};

export default function AgnesAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`agnes-playground ${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <WorksProvider>{children}</WorksProvider>
    </div>
  );
}
