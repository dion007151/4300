import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://4300.vercel.app"),
  title: {
    default: "4300 – Everything. For Free. | All-in-One AI Platform",
    template: "%s | 4300"
  },
  description:
    "4300 (pronounced 'For Free') is the open, all-in-one AI productivity platform featuring ATS resume scoring, AI writing, PDF tools, image/video generation, and job tracking.",
  keywords: [
    "4300",
    "For Free",
    "AI tools",
    "ATS resume builder",
    "AI writer",
    "PDF tools",
    "AI video generator",
    "job tracker",
    "free productivity software"
  ],
  authors: [{ name: "4300 Team", url: "https://4300.vercel.app" }],
  creator: "4300 Team",
  publisher: "4300 Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "4300 – Everything. For Free.",
    description: "The all-in-one AI productivity platform: ATS resume builder, AI writer, document tools, image generator, video creator, and job tracker.",
    url: "https://4300.vercel.app",
    siteName: "4300 Platform",
    images: [
      {
        url: "https://4300.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "4300 - Everything. For Free."
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "4300 – Everything. For Free.",
    description: "All-in-one free AI productivity suite. Rate, review, and use 40+ tools for free.",
    images: ["https://4300.vercel.app/logo.png"],
  },
  alternates: {
    canonical: "https://4300.vercel.app",
  }
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "4300 Platform",
  "alternateName": "For Free AI Productivity",
  "url": "https://4300.vercel.app",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "All (Web Browser, Next.js Edge)",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
    "bestRating": "5",
    "worstRating": "1"
  },
  "description": "4300 is an open, modern all-in-one AI productivity suite for resumes, writing, PDF documents, media generation, and job tracking."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        {/* JSON-LD Structured Data for AI & Search Engine Inspections */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {/* Prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem('4300-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
