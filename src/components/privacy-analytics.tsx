"use client";
import Script from "next/script";
export function PrivacyAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID; const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  if (!websiteId || !scriptUrl) return null;
  return <Script src={scriptUrl} data-website-id={websiteId} strategy="afterInteractive" />;
}
