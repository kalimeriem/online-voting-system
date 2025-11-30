
import Container from "../components/Container";
import Card from "../components/Card";

const primaryStats = [
  { label: "Active Elections", value: "24" },
  { label: "Total Voters", value: "1,247" },
  { label: "Departments", value: "18" },
];

const kpis = [
  { label: "Active Users", value: "10K+" },
  { label: "Organizations", value: "500+" },
  { label: "Elections Held", value: "5K+" },
  { label: "Uptime", value: "99.9%" },
];

export default function Stats() {
  return (
    <section className="bg-slate-50 py-10">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {primaryStats.map((s) => (
            <Card key={s.label}>
              <div className="space-y-1">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-slate-600">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl bg-white py-6 shadow-sm border border-slate-200">
              <div className="text-2xl font-semibold">{k.value}</div>
              <div className="text-slate-600">{k.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
