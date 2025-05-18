import type { Metadata } from "next";
import { effra } from "./fonts";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";

export const metadata: Metadata = {
  title: "NutriBot - Seu assistente nutricionista",
  description: "Um assistente nutricionista personalizado para ajudar você a alcançar seus objetivos de saúde.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark:bg-gray-900">
      <body className={`${effra.variable} font-sans antialiased`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
