import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { WalletProviders } from "@/lib/wallet/WalletProviders";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

// Same type pairing as touchgrass.today:
// Fredoka for display/headings, Nunito for body.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Touch Grass | Harvest",
  description: "Dashboard, Proof of Grass, Harvest, and more — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <WalletProviders>
          <AppShell>{children}</AppShell>
        </WalletProviders>
      </body>
    </html>
  );
}
