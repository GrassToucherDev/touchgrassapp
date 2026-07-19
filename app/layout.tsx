import type { Metadata } from "next";
import { Nunito, DM_Sans } from "next/font/google";
import { WalletProviders } from "@/lib/wallet/WalletProviders";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

// Matches the fonts loaded by the production touchgrass.today site
// (Nunito for display/headings, DM Sans for body).
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Touch Grass App",
  description: "Dashboard, Proof of Grass, Harvest, and more — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable}`}>
      <body>
        <WalletProviders>
          <AppShell>{children}</AppShell>
        </WalletProviders>
      </body>
    </html>
  );
}
