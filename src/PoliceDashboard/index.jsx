import React, { useMemo, useState } from "react";
import { initialAlerts } from "./mock";
import TopBar from "./TopBar";
import AlertList from "./AlertList";
import MapView from "./MapView";
import AlertDetails from "./AlertDetails";

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedId, setSelectedId] = useState(initialAlerts[0]?.id);

  // "all" = todos os pontos / "single" = só o selecionado
  const [mapMode, setMapMode] = useState("all");

  const [filters, setFilters] = useState({
    status: "all",
    risk: "all",
    source: "all",
    q: "",
  });

  const selected = useMemo(() => {
    return alerts.find((a) => a.id === selectedId) ?? alerts[0] ?? null;
  }, [alerts, selectedId]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return alerts.filter((a) => {
      if (filters.status !== "all" && a.status !== filters.status) return false;
      if (filters.risk !== "all" && a.risk !== filters.risk) return false;
      if (filters.source !== "all" && a.source !== filters.source) return false;

      if (q) {
        const hay = `${a.id} ${a.fullName ?? ""} ${a.anonymousId ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [alerts, filters]);

  const activeCount = useMemo(() => {
    return alerts.filter((a) => a.status !== "resolved").length;
  }, [alerts]);

  // tempo médio até evento que contenha "em acompanhamento"
  const avgResponseSeconds = useMemo(() => {
    const diffsMs = alerts
      .map((a) => {
        const created = new Date(a.createdAt).getTime();
        if (Number.isNaN(created)) return null;

        const ev = (a.history ?? []).find((h) =>
          String(h.event || "").toLowerCase().includes("em acompanhamento")
        );
        if (!ev) return null;

        const handled = new Date(ev.at).getTime();
        if (Number.isNaN(handled)) return null;

        return handled - created;
      })
      .filter((x) => typeof x === "number" && x >= 0);

    if (!diffsMs.length) return null;
    const avgMs = diffsMs.reduce((s, v) => s + v, 0) / diffsMs.length;
    return Math.round(avgMs / 1000);
  }, [alerts]);

  // última atualização real (maior lastUpdateAt)
  const lastEventAt = useMemo(() => {
    const times = alerts
      .map((a) => new Date(a.lastUpdateAt).getTime())
      .filter((t) => !Number.isNaN(t));

    if (!times.length) return null;
    return new Date(Math.max(...times)).toISOString();
  }, [alerts]);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        height: "100vh",
        width: "100vw",
        background: "#f8fafc",
        overflowX: "auto",
      }}
    >
      <TopBar
        activeCount={activeCount}
        totalCount={alerts.length}
        avgResponseSeconds={avgResponseSeconds}
        lastEventAt={lastEventAt}
      />

      <div
        style={{
          display: "grid",
          // ✅ 3ª coluna maior
          gridTemplateColumns: "500px 4fr 500px",
          height: "calc(100vh - 54px)",
          minWidth: 1100, // ajuda quando o ecrã for pequeno
        }}
      >
        <AlertList
          filtered={filtered}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setMapMode("single");
          }}
          filters={filters}
          setFilters={setFilters}
        />

        <MapView
          alerts={filtered}
          selected={selected}
          mapMode={mapMode}
          onSelect={(id) => {
            setSelectedId(id);
            setMapMode("single");
          }}
          onReset={() => setMapMode("all")}
        />

        <AlertDetails selected={selected} setAlerts={setAlerts} />
      </div>
    </div>
  );
}