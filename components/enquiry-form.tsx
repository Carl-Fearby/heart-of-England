"use client";

import { useState, useCallback, type FormEvent } from "react";
import { rooms } from "../app/rooms";
import { useRouter } from "next/navigation";

export default function EnquiryForm() {
  const router = useRouter();
  const roomPreference = useCallback((input: HTMLInputElement | null) => {
    if (!input) return;
    const requested = new URLSearchParams(window.location.search).get("rooms")?.split(",").slice(0, 3) || [];
    input.value = rooms.filter(room => requested.includes(room.slug)).map(room => room.name).join(", ");
  }, []);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(Array.from(data, ([key, value]) => [key, String(value)])).toString(),
      });
      if (!response.ok) throw new Error("Enquiry not accepted");
      router.push("/enquiry-received/");
    } catch {
      setStatus("error");
    }
  }
  return <form name="event-enquiry" method="POST" action="/enquiry-received/" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} aria-busy={status === "sending"}>
    <h2>Plan your event</h2>
    <input type="hidden" name="form-name" value="event-enquiry" />
    <p hidden><label>Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    <label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" maxLength={150} required />
    <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
    <label htmlFor="phone">Phone number <small>(optional)</small></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
    <label htmlFor="room-preference">Preferred spaces <small>(optional)</small></label><input id="room-preference" name="room-preference" ref={roomPreference} maxLength={300} />
    <label htmlFor="event-type">Event type</label><select id="event-type" name="event-type" required defaultValue=""><option value="" disabled>Select an event type</option>{["Conference or meeting", "Team building", "Wedding or celebration", "Exhibition or outdoor event", "Other / still deciding"].map(type => <option key={type}>{type}</option>)}</select>
    <label htmlFor="event-date">Preferred date <small>(optional)</small></label><input id="event-date" name="event-date" type="date" />
    <label htmlFor="guests">Approximate number of guests <small>(optional)</small></label><input id="guests" name="guests" type="number" min="1" step="1" />
    <label htmlFor="message">Tell us about your plans</label><textarea id="message" name="message" rows={5} maxLength={5000} required />
    <p className="form-note">Please include any access requirements or flexibility on dates. Your details will be used to respond to this enquiry.</p>
    <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry →"}</button>
    {status === "error" && <p role="alert">Your enquiry could not be sent. Your details are still here, so you can try again. Alternatively, call <a href="tel:01676540333">01676 540333</a> or email <a href="mailto:sales@heartofengland.co.uk">sales@heartofengland.co.uk</a>.</p>}
  </form>;
}
