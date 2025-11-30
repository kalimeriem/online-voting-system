
import Container from "../components/Container";
import SectionHeading from "../components/SectionHeading";

export default function Trust() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading title="Trusted by Organizations Worldwide" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-slate-700">
            <p>One‑vote‑per‑user enforcement. Role‑based access control. Real‑time analytics.</p>
            <p className="text-sm text-slate-500">Enterprise‑grade security, 24/7 support, and 99.9% uptime.</p>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 p-6 text-white shadow-lg">
            <div className="font-semibold">Enterprise‑grade Security</div>
            <p className="text-blue-100">Bank‑level encryption and protocols protect every vote.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
