
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";

const items = [
  { title: "Secure & Transparent", desc: "End‑to‑end encrypted voting with audit trails." },
  { title: "Hierarchical Departments", desc: "Nested org units and role‑based access." },
  { title: "Email Invitations", desc: "Invite members via email with controlled access." },
  { title: "Private Elections", desc: "Department‑specific or public elections." },
  { title: "Scheduled Voting", desc: "Start/end dates with automatic status updates." },
  { title: "Real‑time Results", desc: "Live results and analytics after close." },
];

export default function Features() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Everything You Need for Secure Voting"
          subtitle="Powerful features designed for transparency, security, and easy management."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 h-8 w-8 rounded bg-blue-100" />
              <div className="font-semibold">{f.title}</div>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
