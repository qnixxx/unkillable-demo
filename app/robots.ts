import type { MetadataRoute } from "next";
import { product } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    rules: { userAgent: "*", allow: `${basePath}/`, disallow: [`${basePath}/app`, `${basePath}/onboarding`] },
    sitemap: `${product.url}/sitemap.xml`,
    host: new URL(product.url).origin,
  };
}
