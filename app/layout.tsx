import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { WalletProviders } from "@/lib/wallet/WalletProviders";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

// Same type pairing as Proof of Grass and WAGO Drops:
// Cormorant Garamond for display/headings, DM Sans for body.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Touch Grass | Harvest",
  description: "Dashboard, Proof of Grass, Harvest, and more — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <WalletProviders>
          <AppShell>{children}</AppShell>
        </WalletProviders>
      </body>
    </html>
  );
}
