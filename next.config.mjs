/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site is prerendered to `out/`.
  // The 3D site lives in public/immersive and is copied verbatim.
  output: "export",
  images: { unoptimized: true },
  // Vite still owns index.html at the repo root for the 3D build; keep Next off it.
  pageExtensions: ["jsx", "js", "tsx", "ts"],
};

export default nextConfig;
