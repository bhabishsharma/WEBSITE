import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heritage Lens — Nepal's Heritage Sites",
  description:
    "A living map of Nepal's heritage sites: official photo galleries, community-submitted images, and the stories behind each place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
