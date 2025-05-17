import type { Metadata } from "next";
import { effra } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriBot",
  description: "Seu assistente nutricionista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={effra.className}>{children}</body>
    </html>
  );
}
