import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import sharedData from "../shared/hobbies.json";
import "./App.css";

const { VARIABLE_KEYS, VARIABLE_LABELS, HOBBIES, BAR_COLORS } = sharedData;
// const BACKEND_API = import.meta.env.VITE_BACKEND_API || "/api";

function computeScore(sliders, weights) {
  let total = 0;
  for (let i = 0; i < VARIABLE_KEYS.length; i++) {
    total += 1 - Math.abs(sliders[VARIABLE_KEYS[i]] - weights[i]);
  }
  return total / VARIABLE_KEYS.length;
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(167, 139, 250, 0.3)", borderRadius: 12,
        padding: "12px 16px", color: "#fff", fontSize: 13,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          {d.name}
        </div>
        <div style={{ color: "#C4B5FD" }}>
          {(d.score * 100).toFixed(1)}% de compatibilidad
        </div>
      </div>
    );
  }
  return null;
}

function ResultPage({ top3, fallbackTop3, onBack, loading, error }) {
  const accentColor = ["#FF6B6B", "#4ECDC4", "#A78BFA"];
  const results = top3 ?? fallbackTop3;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0A1F 0%, #1A0F2E 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#fff",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8, color: "#A5B4FC",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167, 139, 250, 0.2)",
          borderRadius: 9999, padding: "10px 20px", cursor: "pointer", marginBottom: 40,
          backdropFilter: "blur(10px)"
        }}>
          ← Volver al análisis
        </button>

        <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>
          Tus hobbies recomendados
        </h2>
        <p style={{ textAlign: "center", color: "#C4B5FD", marginBottom: 48 }}>
          Estas son las actividades más alineadas contigo.
        </p>

        {loading && (
          <div style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: 18, padding: "18px 24px", marginBottom: 24, color: "#A5B4FC"
          }}>
            Calculando recomendaciones...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(248, 113, 113, 0.12)", border: "1px solid rgba(248, 113, 113, 0.3)",
            borderRadius: 18, padding: "18px 24px", marginBottom: 24, color: "#FECACA"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {results.map((h, i) => (
            <div key={h.name} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167, 139, 250, 0.15)",
              borderRadius: 20, padding: "28px", display: "flex", gap: 24,
              backdropFilter: "blur(16px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                {h.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ background: accentColor[i] + "30", color: accentColor[i],
                    padding: "4px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 600 }}>
                    #{i + 1}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 600 }}>{h.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700, color: accentColor[i] }}>
                    {(h.score * 100).toFixed(0)}%
                  </span>
                </div>
                <p style={{ color: "#CBD5E1", lineHeight: 1.7 }}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HobbyRecommender() {
  const init = Object.fromEntries(VARIABLE_KEYS.map(k => [k, 0.5]));
  const [sliders, setSliders] = useState(init);
  const [page, setPage] = useState("main");
  const [serverTop3, setServerTop3] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  const ranked = useMemo(() =>
    HOBBIES.map(h => ({ ...h, score: computeScore(sliders, h.weights) }))
      .sort((a, b) => b.score - a.score),
    [sliders]
  );

  const handleDiscover = () => {
    setPage("results");
    setServerTop3(ranked.slice(0, 3));
  };

  // Orden FIJO (no se reordena)
  const chartData = useMemo(() =>
    HOBBIES.map((h, i) => ({
      name: h.short,
      score: computeScore(sliders, h.weights),
      color: BAR_COLORS[i],
    })),
    [sliders]
  );

  if (page === "results") {
    return (
      <ResultPage
        top3={serverTop3}
        fallbackTop3={ranked.slice(0, 3)}
        onBack={() => setPage("main")}
        loading={loading}
        error={backendError}
      />
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0A1F 0%, #1A0F2E 50%, #2A1B4D 100%)",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "center/cover", opacity: 0.12, pointerEvents: "none" }} />

      <div style={{ padding: "40px 20px 80px", maxWidth: "1480px", margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h1 style={{
            fontSize: 68, fontWeight: 700,
            background: "linear-gradient(90deg, #C4B5FD, #E0BBFF, #A5B4FC)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: 0, letterSpacing: "-2.5px"
          }}>
            HobbyMatch
          </h1>
          <p style={{ color: "#C4B5FD", fontSize: 18, marginTop: 6 }}>
            Recomendador de hobbies
          </p>
        </div>

        {/* Sliders */}
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167, 139, 250, 0.2)",
          borderRadius: 24, padding: "36px 32px", backdropFilter: "blur(16px)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)", marginBottom: 40
        }}>
          <p style={{ textAlign: "center", color: "#C4B5FD", fontSize: 15, marginBottom: 32, letterSpacing: "1px", textTransform: "uppercase" }}>
            Ajusta los valores
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px 48px" }}>
            {VARIABLE_KEYS.map((key, i) => {
              const val = sliders[key];
              const pct = Math.round(val * 100);
              return (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 14.5, color: "#E0E7FF" }}>{VARIABLE_LABELS[i]}</label>
                    <span style={{ color: "#A5B4FC", fontSize: 13.5 }}>{pct}%</span>
                  </div>
                  <input
                    type="range" min={0} max={1} step={0.01} value={val}
                    onChange={e => setSliders(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#A78BFA", height: "6px" }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfica Actualizada */}
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167, 139, 250, 0.2)",
          borderRadius: 24, padding: "36px 32px", backdropFilter: "blur(16px)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)"
        }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Compatibilidad en tiempo real</h3>
          </div>

          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={chartData} barCategoryGap={16} barSize={35}>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={`c-${i}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button onClick={handleDiscover} style={{
            background: "linear-gradient(90deg, #7C3AED, #C026D3)", color: "white",
            border: "none", padding: "16px 56px", fontSize: 18, fontWeight: 600,
            borderRadius: 9999, cursor: "pointer", boxShadow: "0 15px 35px rgba(61, 14, 142, 0.35)",
            transition: "all 0.25s ease"
          }}          >            DESCUBRE TU NUEVO HOBBY →          </button>
        </div>
      </div>
    </div>
);
}