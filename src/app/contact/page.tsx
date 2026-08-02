import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "@/components/contact-form";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() { return <div className="page-wrap"><PageHeading index="07" eyebrow="COLLABORATION / BUSINESS / FEEDBACK" title="Let’s make the message useful." body="Share enough context to begin well. Business and collaboration inquiries can continue into a 30-minute scheduling flow." /><ContactForm /></div>; }
