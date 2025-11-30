
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";

const steps = [
  { n: "01", title: "Create Account", desc: "Sign up with email and create your secure account." },
  { n: "02", title: "Join or Create Departments", desc: "Get invited or set up your structure." },
  { n: "03", title: "Vote & Manage", desc: "Participate or manage your own elections." },
  { n: "04", title: "View Results", desc: "Access comprehensive results and analytics." },
];

export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <Container>
        <SectionHeading title="How It Works" subtitle="Get started in minutes with a simple process." />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-blue-600 font-bold">{s.n}</div>
              <div className="font-semibold">{s.title}</div>
              <p className="text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
