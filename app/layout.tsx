import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Suspense} from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agonistic Image Generation",
  description: "Image generation research project by Andrew Shaw and Andre Ye",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <Suspense>
            <html lang="en">
            <body className={inter.className}>{children}</body>
            </html>
        </Suspense>
    );
}
