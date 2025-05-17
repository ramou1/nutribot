import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { fontHeading, fontSans } from "./fonts";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriChef",
  description: "Seu assistente de nutrição",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/effra"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-sans", fontSans.variable, fontHeading.variable, inter.className, "font-effra")}>
        <main className="container max-w-screen-md">{children}</main>
      </body>
    </html>
  );
}
