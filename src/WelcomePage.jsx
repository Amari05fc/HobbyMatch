export default function WelcomePage({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0A1F 0%, #1A0F2E 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(167, 139, 250, 0.12)",
          border: "1px solid rgba(167, 139, 250, 0.25)",
          borderRadius: 9999, padding: "8px 20px",
          color: "#C4B5FD", fontSize: 13, letterSpacing: "0.5px",
          marginBottom: 36,
        }}>
          ✦ Sistema de lógica difusa ✦
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(36px, 8vw, 64px)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 16,
          background: "linear-gradient(135deg, #E0E7FF 0%, #A78BFA 60%, #7C3AED 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Hobby Match
        </h1>

        {/* Subtitle / description */}
        <p style={{
          fontSize: 17, color: "#94A3B8", lineHeight: 1.75,
          maxWidth: 520, margin: "0 auto 48px",
        }}>
          Descubre las actividades más afines a tu personalidad. Ajusta 20 variables
          sobre cómo eres y cómo te sientes hoy, y nuestro motor difuso calculará
          tu compatibilidad con 37 hobbies distintos.
        </p>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
            color: "#fff", border: "none", borderRadius: 9999,
            padding: "16px 48px", fontSize: 16, fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.3px",
            boxShadow: "0 0 40px rgba(124, 58, 237, 0.4)",
            transition: "transform .15s, box-shadow .15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 0 60px rgba(124, 58, 237, 0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(124, 58, 237, 0.4)";
          }}
        >
          Comenzar análisis →
        </button>

        {/* Divider */}
        <div style={{
          width: "100%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent)",
          margin: "56px 0 40px",
        }}/>

        {/* Developers */}
        <p style={{ fontSize: 12, color: "#475569", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>
          Desarrolladores
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {["Miguel Ángel", "Fernanda Cruz", "Ángel Baruc"].map((dev) => (
            <span key={dev} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(167, 139, 250, 0.15)",
              borderRadius: 9999, padding: "8px 18px",
              fontSize: 14, color: "#C4B5FD",
            }}>
              {dev}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}