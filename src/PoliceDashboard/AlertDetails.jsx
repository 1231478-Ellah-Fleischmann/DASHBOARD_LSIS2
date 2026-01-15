import React from "react";
import { RiskDot, formatTime, riskLabel, getDisplayName } from "./utils";

export default function AlertDetails({ selected, setAlerts }) {
  if (!selected) {
    return (
      <section style={{ borderLeft: "1px solid #e5e7eb", padding: 12 }}>
        Sem alerta selecionado.
      </section>
    );
  }

  const statusLabel =
    selected.status === "new"
      ? "Novo"
      : selected.status === "in_progress"
      ? "Em acompanhamento"
      : "Resolvido";

  const sourceLabel =
    selected.source === "app" ? "App camuflada" : "Dispositivo físico";

  // Nota: estes botões atualizam apenas o estado local (UI).
  // Em produção, isto deve chamar a API e receber a resposta do backend.
  function markInProgress() {
    const nowIso = new Date().toISOString();

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              status: "in_progress",
              lastUpdateAt: nowIso,
              history: [{ at: nowIso, event: "Em acompanhamento (manual)" }, ...(a.history ?? [])],
            }
          : a
      )
    );
  }

  function closeAlert() {
    const nowIso = new Date().toISOString();

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              status: "resolved",
              lastUpdateAt: nowIso,
              history: [{ at: nowIso, event: "Alerta resolvido (manual)" }, ...(a.history ?? [])],
            }
          : a
      )
    );
  }

  return (
    <section style={{ borderLeft: "1px solid #e5e7eb", padding: 12, overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{selected.id}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(selected.createdAt)}</div>
      </div>

      <div style={{ marginTop: 10, padding: 12, border: "1px solid #e5e7eb", borderRadius: 16, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RiskDot risk={selected.risk} />
          <div style={{ fontWeight: 700 }}>Risco {riskLabel(selected.risk)}</div>
        </div>

        <div style={{ marginTop: 8, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
          <div><strong>Vítima:</strong> {getDisplayName(selected)}</div>
          <div><strong>Origem:</strong> {sourceLabel}</div>
          <div><strong>Estado:</strong> {statusLabel}</div>
          <div>
            <strong>Localização:</strong>{" "}
            {selected.lat?.toFixed?.(5)}, {selected.lng?.toFixed?.(5)}
          </div>
          <div><strong>Última atualização:</strong> {formatTime(selected.lastUpdateAt)}</div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={markInProgress}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Marcar como “Em acompanhamento”
          </button>

          <button
            onClick={closeAlert}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Fechar alerta
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, fontWeight: 800 }}>Linha temporal</div>

      <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
        {(selected.history ?? []).map((h, i) => (
          <div key={i} style={{ padding: 10, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff" }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(h.at)}</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>{h.event}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        Nota: em produção, as ações devem ser feitas via API e refletidas por eventos (WebSocket/SSE/REST).
      </div>
    </section>
  );
}