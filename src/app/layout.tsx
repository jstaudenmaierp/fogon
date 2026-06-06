import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "fogon",
  description: "Plataforma que conecta ONGs con donantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
