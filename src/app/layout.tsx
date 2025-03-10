import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
export const metadata: Metadata = {
  title: "Mark's space",
  description: "Generated by create next app",
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
