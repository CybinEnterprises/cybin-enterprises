import { useEffect } from "react";

interface SeoParams {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
}

export function useSeo({ title, description, canonical, image, noindex }: SeoParams) {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      (descMeta as HTMLMetaElement).name = "description";
      document.head.appendChild(descMeta);
    }
    (descMeta as HTMLMetaElement).content = description || "";

    // Set canonical
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        (canonicalLink as HTMLLinkElement).rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      (canonicalLink as HTMLLinkElement).href = canonical;
    }

    // Set noindex
    if (noindex) {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        (robotsMeta as HTMLMetaElement).name = "robots";
        document.head.appendChild(robotsMeta);
      }
      (robotsMeta as HTMLMetaElement).content = "noindex, nofollow";
    }
  }, [title, description, canonical, image, noindex]);
}