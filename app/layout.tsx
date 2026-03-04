import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://basvuru.karbonkursplus.com'),
  title: "Sınav Başvuru Sistemi - Karbon Kurs Plus",
  description: "Karbon Kurs Plus için online sınav başvuru formu",
  openGraph: {
    title: "Sınav Başvuru Sistemi - Karbon Kurs Plus",
    description: "Karbon Kurs Plus için online sınav başvuru formu",
    url: 'https://basvuru.karbonkursplus.com',
    siteName: 'Karbon Kurs Plus Başvuru Sistemi',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Karbon Kurs Plus Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Sınav Başvuru Sistemi - Karbon Kurs Plus",
    description: "Karbon Kurs Plus için online sınav başvuru formu",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
//