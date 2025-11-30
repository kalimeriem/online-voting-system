
import Container from "../components/Container";
import Button from "../components/Button";

export default function CTA() {
  return (
    <section className="py-14">
      <Container>
        <div className="rounded-2xl bg-slate-900 px-6 py-10 text-center text-white">
          <h3 className="text-2xl font-semibold">Ready to Modernize Your Elections?</h3>
          <p className="mt-2 text-slate-300">Join thousands of organizations already using VoteSystem.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Get Started Free</button>
            <button className="inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20">Schedule Demo</button>
          </div>
        </div>
      </Container>
    </section>
  );
}
