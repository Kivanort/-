import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiToast } from "@/components/AiToast";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "НавИИгатор — Яндекс Музей",
  description: "Персональный ИИ-гид по музею технологий",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=language&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AiToast />
        </AppProvider>
      </body>
    </html>
  );
}
