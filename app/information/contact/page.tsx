// app/information/contact/page.tsx
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | CleanIngredients",
  description: "Get in touch with CleanIngredients.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-neutral-600">
        Questions, feedback, or partnership ideas? Send us a note.
      </p>

      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
