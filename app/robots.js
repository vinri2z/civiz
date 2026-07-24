// The CV page itself is `public/index.html` — a self-contained dc-runtime
// document that Next copies to the export verbatim. This file is the only real
// route in the app; it also keeps `app/` present in git, which `next build`
// requires.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
  };
}
