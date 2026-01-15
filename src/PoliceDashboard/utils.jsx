// Recebe um timestamp (ts) em milissegundos, converte esse número num objeto Date e devolve uma string
export function formatTime(isoString) {
  if (!isoString) return "n/d";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "n/d";
  return d.toLocaleString("pt-PT", { hour12: false });
}

export function getDisplayName(alert) {
  if (!alert) return "Vítima (n/d)";
  if (alert.source === "app" && alert.fullName) return alert.fullName;
  if (alert.anonymousId) return alert.anonymousId;
  return "Vítima (anónima)";
}

// Converte um valor técnico (high, medium, low) p/ texto
export function riskLabel(risk) {
  if (risk === "high") return "Alto";
  if (risk === "medium") return "Médio";
  return "Baixo";
}

// Recebe uma propriedade 'risk', define um objeto styles que associa uma 'riskLabel' a uma cor
export function RiskDot({ risk }) {
  const styles = {
    low: { background: "#22c55e" },
    medium: { background: "#f59e0b" },
    high: { background: "#ef4444" },
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: 999,
        marginRight: 8,
        ...styles[risk],
      }}
    />
  );
}

// 'children' é tudo o que colocas entre as tags ex:
// <Badge>Alertas ativos: 3</Badge> -> "Alertas ativos: 3" é o 'children'
export function Badge({ children }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {children}
    </span>
  );
}