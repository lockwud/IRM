/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep `next dev` artifacts separate from `next build` artifacts. Reusing one directory caused
  // development requests for layout.css and main-app.js to resolve against an incompatible build.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  async headers() {
    return [
      {
        // Browsers must revalidate the worker script so a deployment cannot keep an obsolete cache policy.
        source: "/firebase-messaging-sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
