import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { SiteShell } from "@/components/site-shell";

const sans = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin", "latin-ext"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://iesy.me"),
  title: { default: "İdris Efe YEŞİLDAĞ — Builder", template: "%s — iesy.me" },
  description: "The evolving digital space of İdris Efe YEŞİLDAĞ: projects, experiments, and current work.",
  openGraph: { title: "İdris Efe YEŞİLDAĞ", description: "Someone you’ll never forget.", url: "https://iesy.me", siteName: "iesy.me", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><SiteProvider><SiteShell>{children}</SiteShell></SiteProvider></body></html>;
}
