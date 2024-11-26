import { Noto_Serif_SC, Ubuntu_Mono } from 'next/font/google';
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from '@/app/components/Header';

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc',
});

const ubuntuMono = Ubuntu_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSerifSC.variable} ${ubuntuMono.variable} font-serif antialiased`}
      >
        <Header />
        <main className="pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
