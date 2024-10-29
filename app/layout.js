import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from './components/SessionWrapperProvider.js';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "TRF - The Right Fit",
  description: "The Right Fit - Your one-stop shop for quality products.",
  keywords: "ecommerce, online store, shopping, TRF STORE, The Right Fit, The Right Fit Kicks",
  authors: [
    {
      name: "TRF STORE",
      url: "https://trf-store.vercel.app",
    },
  ],
  openGraph: {
    title: "TRF STORE",
    description: "Shop the best products online with TRF STORE.",
    url: "https://trf-store.vercel.app",
    siteName: "TRF STORE",
    // images: [
    //   {
    //     url: "https://trfstore.com/og-image.jpg",
    //     width: 800,
    //     height: 600,
    //     alt: "TRF STORE Logo",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
