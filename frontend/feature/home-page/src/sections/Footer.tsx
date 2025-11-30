
import Container from "../components/Container";

export default function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Pricing", "Security"] },
    { title: "Company", links: ["About", "Blog", "Careers"] },
    { title: "Resources", links: ["Documentation", "Help Center", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy"] },
  ];
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="font-semibold">{c.title}</div>
              <ul className="mt-3 space-y-2 text-slate-600">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-slate-900">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 py-6 text-sm text-slate-500">© 2025 VoteSystem. All rights reserved.</div>
      </Container>
    </footer>
  );
}
