import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fabrika3",
  description:
    "v1 governed product-to-code — minimal app shell only; product screens are not implemented yet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
