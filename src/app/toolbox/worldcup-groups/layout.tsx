import type { Metadata } from 'next';
import { Bebas_Neue, DM_Mono, Noto_Serif_SC } from 'next/font/google';
import './_styles/worldcup-groups.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '2026 世界杯 · 小组积分榜',
  description:
    '2026 美加墨世界杯小组积分榜，实时追踪世界排名与小组赛积分，点击球队查看赛程',
};

export default function WorldcupGroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bebasNeue.variable} ${notoSerifSC.variable} ${dmMono.variable}`}
    >
      {children}
    </div>
  );
}
