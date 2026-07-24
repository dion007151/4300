import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "4300 – Everything. For Free.",
    template: "%s | 4300"
  },
  description:
    "4300 is the all-in-one AI-powered platform for work, resumes, documents, images, productivity, and creativity — completely free.",
  keywords: ["AI tools", "resume builder", "PDF converter", "free tools", "productivity", "4300"],
  authors: [{ name: "4300 Team" }],
  openGraph: {
    title: "4300 – Everything. For Free.",
    description: "Your daily workspace for AI, resumes, documents, media, jobs, and notes.",
    type: "website"
  }
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
