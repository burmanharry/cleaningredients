import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-neutral-700">
        We typically respond within one business day.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
