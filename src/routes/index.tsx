import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StyleHub — Premium Fashion & Apparel Online Store" },
      {
        name: "description",
        content:
          "StyleHub is a premium fashion destination for men, women and kids. Shop new-season dresses, shirts, denim, footwear and accessories with up to 40% off.",
      },
      { property: "og:title", content: "StyleHub — Premium Fashion & Apparel" },
      {
        property: "og:description",
        content:
          "Accessible luxury for the modern wardrobe. Shop men's, women's and kids fashion, footwear and accessories at StyleHub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/stylehub/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">StyleHub</h1>
        <p className="mt-2 text-sm text-muted-foreground">Opening the store…</p>
        <a
          className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          href="/stylehub/index.html"
        >
          Enter StyleHub
        </a>
      </div>
    </div>
  );
}
