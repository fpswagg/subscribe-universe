import { Ubuntu } from "next/font/google";
import { NextFont } from "next/dist/compiled/@next/font";

import "@/app/globals.css";

const ubuntuFont: NextFont = Ubuntu({ subsets: ["latin"], weight: "300" });
const ubuntuBoldedFont: NextFont = Ubuntu({ subsets: ["latin"], weight: "700" });

export const metadata = {
  title: "Subscribe Universe",
  description: "This a simple social média.",
} as {
  title: string,
  description: string,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ubuntuFont.className}>
        {children}
      </body>
    </html>
  );
}
