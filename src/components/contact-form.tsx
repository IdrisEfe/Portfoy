"use client";
import { useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const filloutId = process.env.NEXT_PUBLIC_FILLOUT_FORM_ID;
  if (filloutId) return <div className="contact-layout"><iframe className="fillout-frame" title="Contact and scheduling form" src={`https://form.fillout.com/t/${encodeURIComponent(filloutId)}?embed=true`} loading="lazy" allow="camera; microphone" /><aside><CalendarDays size={26} /><h2>Thirty useful minutes.</h2><p>Google Meet · Europe/Istanbul<br />24-hour notice · 2-week horizon</p><span>Scheduling is offered conditionally for collaboration and business inquiries.</span></aside></div>;
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const subject = encodeURIComponent(`[iesy.me] ${data.get("reason")} — ${data.get("name")}`); const body = encodeURIComponent(`${data.get("message")}\n\nFrom: ${data.get("name")} <${data.get("email")}>`); window.location.href = `mailto:i.efeyesildag@gmail.com?subject=${subject}&body=${body}`; setSent(true);
  };
  return <div className="contact-layout"><form className="contact-form" onSubmit={submit}><label>Name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" required type="email" autoComplete="email" /></label><label>Reason<select name="reason" defaultValue="collaboration"><option value="collaboration">Collaboration</option><option value="business">Business</option><option value="feedback">Feedback</option><option value="other">Other</option></select></label><label>Message<textarea name="message" required rows={6} /></label><button className="primary-button">Prepare message <ArrowRight size={18} /></button>{sent && <p className="form-note">Your email app should now be open. Connect Fillout to enable conditional scheduling.</p>}</form><aside><CalendarDays size={26} /><h2>Thirty useful minutes.</h2><p>Google Meet · Europe/Istanbul<br />24-hour notice · 2-week horizon</p><span>Scheduling activates after a relevant inquiry.</span></aside></div>;
}
