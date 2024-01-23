import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntuFont = Ubuntu({ subsets: ["latin"] });

export const metadata = {
  title: "Subscribe Universe",
  description: "This a simple social média.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ubuntuFont.className} bg-r`}>{children}</body>
    </html>
  );
}
