import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { effra } from "./fonts";
import "./globals.css";

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
      <body className={cn("font-effra", effra.variable)}>
        <main className="container max-w-screen-md">{children}</main>
      </body>
    </html>
  );
}
