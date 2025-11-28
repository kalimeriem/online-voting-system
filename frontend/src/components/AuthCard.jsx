export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-card new-auth-card">
      <h2 className="card-title">{title}</h2>
      <p className="card-subtitle">{subtitle}</p>
      <div className="space">{children}</div>
    </div>
  );
}
