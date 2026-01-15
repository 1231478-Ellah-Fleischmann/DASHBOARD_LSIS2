// importa utilitários 
import React from "react";
import { RiskDot, riskLabel, formatTime, getDisplayName } from "./utils";

export default function AlertList({
  filtered,
  selectedId,
  onSelect,
  filters,
  setFilters,
}) {
  return (
    <aside style={{ borderRight: "1px solid #e5e7eb", padding: 12, overflow: "auto" }}>
      <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Pesquisar por ID ou vítima…"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          >
            <option value="all">Estado</option>
            <option value="new">Novo</option>
            <option value="in_progress">Em acompanhamento</option>
            <option value="resolved">Resolvido</option>
          </select>

          <select
            value={filters.risk}
            onChange={(e) => setFilters((f) => ({ ...f, risk: e.target.value }))}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          >
            <option value="all">Risco</option>
            <option value="high">Alto</option>
            <option value="medium">Médio</option>
            <option value="low">Baixo</option>
          </select>

          <select
            value={filters.source}
            onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          >
            <option value="all">Origem</option>
            <option value="app">App</option>
            <option value="device">Dispositivo</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
        Resultados: {filtered.length}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map((a) => {
          const isSelected = a.id === selectedId;

          const statusText =
            a.status === "new"
              ? "Novo"
              : a.status === "in_progress"
              ? "Em acompanhamento"
              : "Resolvido";

          const sourceText = a.source === "app" ? "App" : "Dispositivo";

          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              style={{
                textAlign: "left",
                padding: 10,
                borderRadius: 14,
                border: isSelected ? "2px solid #111827" : "1px solid #e5e7eb",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700 }}>{a.id}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {formatTime(a.createdAt)}
                </div>
              </div>

              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <RiskDot risk={a.risk} />
                <span style={{ fontSize: 13 }}>{riskLabel(a.risk)}</span>

                <span style={{ fontSize: 12, color: "#6b7280" }}>• {statusText}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>• {sourceText}</span>
              </div>

              <div style={{ marginTop: 6, fontSize: 12, color: "#374151" }}>
                {getDisplayName(a)}
              </div>

              <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                Último update: {formatTime(a.lastUpdateAt)}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}