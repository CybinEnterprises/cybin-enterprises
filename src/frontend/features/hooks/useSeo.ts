import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

const VERIFIED_ORIGIN = "https://cybin-enterprises-1.vercel.app";
const DEFAULT_OG_IMAGE = `${VERIFIED_ORIGIN}/assets/cybin-logo.png?v=3`;

/**
 * Dynamically updates page-level SEO meta tags on route changes.
 * Sets title, meta description, canonical URL, and Open Graph / Twitter tags.
 */
export function useSeo({ title, description, canonical, ogImage }: SeoProps) {
  useEffect(() => {
    // Page title
    document.title = title;

    // Meta description
    let desc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", description);

    // Canonical link
    let canon = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    // Always use the verified origin for canonicals to ensure boat consistency
    canon.setAttribute("href", `${VERIFIED_ORIGIN}${canonical}`);

    // Open Graph tags
    const setOgMeta = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const absoluteOgImage = ogImage?.startsWith("http") 
      ? (ogImage.includes("?") ? ogImage : `${ogImage}?v=3`)
      : (ogImage ? `${VERIFIED_ORIGIN}${ogImage}?v=3` : DEFAULT_OG_IMAGE);

    setOgMeta("og:title", title);
    setOgMeta("og:description", description);
    setOgMeta("og:url", `${VERIFIED_ORIGIN}${canonical}`);
    setOgMeta("og:type", "website");
    setOgMeta("og:image", absoluteOgImage);

    // Twitter tags
    const setTwitterMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitterMeta("twitter:title", title);
    setTwitterMeta("twitter:description", description);
    setTwitterMeta("twitter:card", "summary_large_image");
    setTwitterMeta("twitter:image", absoluteOgImage);
  }, [title, description, canonical, ogImage]);
}
