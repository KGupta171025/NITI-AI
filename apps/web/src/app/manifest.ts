import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NITI AI",
    short_name: "NITI AI",
    description: "AI-powered government scheme discovery for Indian entrepreneurs",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a1a",
    theme_color: "#f07000",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
