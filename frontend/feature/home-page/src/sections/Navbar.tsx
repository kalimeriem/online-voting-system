
import Container from "../components/Container";
import Button from "../components/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600" />
            <span className="text-lg font-semibold">VoteSystem</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">Sign In</Button>
            <Button>Get Started Free</Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
