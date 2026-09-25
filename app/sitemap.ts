import type { MetadataRoute } from "next";
import { product } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: product.url, changeFrequency: "weekly", priority: 1 },
    { url: `${product.url}/manifesto`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${product.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${product.url}/changelog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${product.url}/help`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${product.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${product.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
