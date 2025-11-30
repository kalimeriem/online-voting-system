
import Container from "../components/Container";
import Button from "../components/Button";

export default function Hero() {
  return (
    <section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl py-16 text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Modern Voting Made Simple & Secure
          </h1>
          <p className="text-slate-600">
            A comprehensive platform for transparent, secure elections with hierarchical departments and role-based access.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button>Get Started Free</Button>
            <Button variant="secondary">Sign In</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
