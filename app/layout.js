import { Ubuntu } from "next/font/google";

import "@/app/globals.css";

const ubuntuFont = Ubuntu({ subsets: ["latin"], weight: "300" });
const ubuntuBoldedFont = Ubuntu({ subsets: ["latin"], weight: "700" });

export const metadata = {
  title: "Subscribe Universe",
  description: "This a simple social média.",
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
