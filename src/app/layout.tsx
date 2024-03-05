import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo list API",
  description: "Author: Jacob Gad",
};

export default function Home() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1>Todo list API</h1>
      </body>
    </html>
  );
}
