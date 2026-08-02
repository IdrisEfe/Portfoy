import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "@/components/contact-form";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() { return <div className="page-wrap"><PageHeading index="07" eyebrow={{ en: "COLLABORATION / BUSINESS / FEEDBACK", tr: "İŞ BİRLİĞİ / İŞ / GERİ BİLDİRİM" }} title={{ en: "Let’s make the message useful.", tr: "Mesajı faydalı hâle getirelim." }} body={{ en: "Share enough context to begin well. Business and collaboration inquiries can continue into a 30-minute scheduling flow.", tr: "İyi başlamak için yeterince bağlam paylaş. İş ve iş birliği talepleri 30 dakikalık görüşme planlamasına ilerleyebilir." }} /><ContactForm /></div>; }
