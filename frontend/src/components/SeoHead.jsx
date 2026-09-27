import { useEffect } from "react";

export default function SeoHead({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const setMeta = (name, content) => {
      if (!content) return;

      let element = document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
  }, [title, description, keywords]);

  return null;
}
