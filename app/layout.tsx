import type { Metadata, Viewport } from "next";
import "./globals.css";
import { product } from "@/lib/config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(product.url),
  title: product.title,
  description: product.description,
  applicationName: product.name,
  keywords: ["resilience app", "discipline", "habit tracker", "consistency", "personal performance", "minimum day"],
  openGraph: {
    type: "website",
    url: product.url,
    title: product.title,
    description: product.description,
    siteName: product.name,
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: "Unkillable — Become Harder to Break" }],
  },
  twitter: {
    card: "summary_large_image",
    title: product.title,
    description: product.description,
    images: [`${basePath}/og.png`],
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
  manifest: `${basePath}/manifest.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: "#0a0b0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Unkillable",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: product.url,
    description: product.description,
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "9", priceCurrency: "USD", name: "Unkillable Pro Monthly" },
    ],
  };

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
