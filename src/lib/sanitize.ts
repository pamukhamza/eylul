import sanitizeHtml from "sanitize-html";

export function cleanPostHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "del",
      "h1", "h2", "h3", "h4",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "img",
      "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right|justify)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    },
  });
}
