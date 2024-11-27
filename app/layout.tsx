import { Noto_Serif_SC, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from "@/app/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Atelier Fallenhh",
    default: "Atelier Fallenhh",
  },
  description: "Personal blog and photo gallery",
  metadataBase: new URL("https://fallen.moe"),
  openGraph: {
    title: "Atelier Fallenhh",
    description: "Personal blog and photo gallery",
    url: "https://fallen.moe",
    siteName: "Atelier Fallenhh",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://pic.fallen.moe/wallpaper.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Atelier Fallenhh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Fallenhh",
    description: "Personal blog and photo gallery",
    images: ["https://pic.fallen.moe/wallpaper.jpg"], // Same as OG image
  },
};

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
});

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
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
        <main className="pt-8 md:pl-8">{children}</main>
      </body>
    </html>
  );
}
