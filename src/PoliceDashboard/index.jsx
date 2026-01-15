import React, { useEffect, useMemo, useState } from "react";
import { initialAlerts } from "./mock";
import TopBar from "./TopBar";
import AlertList from "./AlertList";
import MapView from "./MapView";
import AlertDetails from "./AlertDetails";

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedId, setSelectedId] = useState(initialAlerts[0]?.id);

  const [filters, setFilters] = useState({
    status: "all",
    risk: "all",
    source: "all",
    q: "",
  });

  const selected = useMemo(
    () => alerts.find((a) => a.id === selectedId) ?? alerts[0],
    [alerts, selectedId]
  );

  // Simulação de “tempo real”
  useEffect(() => {
    const t = setInterval(() => {
      setAlerts((prev) => {
        // 30% chance de criar novo alerta
        if (Math.random() < 0.3) {
          const id = `AL-${Math.floor(10000 + Math.random() * 90000)}`;
          const risk = ["low", "medium", "high"][Math.floor(Math.random() * 3)];
          const source = Math.random() < 0.5 ? "app" : "device";
          const baseLat = 41.15 + (Math.random() - 0.5) * 0.08;
          const baseLng = -8.61 + (Math.random() - 0.5) * 0.08;
          const now = Date.now();

          const newAlert = {
            id,
            createdAt: now,
            lastUpdateAt: now,
            source,
            status: "new",
            risk,
            victimName: `Vítima #${Math.random().toString(16).slice(2, 5).toUpperCase()}`,
            lat: baseLat,
            lng: baseLng,
            history: [{ at: now, event: `Alerta ativado (${source === "app" ? "PIN" : "dispositivo"})` }],
          };

          return [newAlert, ...prev].slice(0, 30);
        }

        // Caso contrário, atualizar um alerta ativo
        const idx = prev.findIndex((a) => a.status !== "resolved");
        if (idx === -1) return prev;

        const now = Date.now();
        const copy = [...prev];
        const a = { ...copy[idx] };

        a.lat = a.lat + (Math.random() - 0.5) * 0.0015;
        a.lng = a.lng + (Math.random() - 0.5) * 0.0015;
        a.lastUpdateAt = now;

        if (Math.random() < 0.15 && a.status === "new") {
          a.status = "in_progress";
          a.history = [{ at: now, event: "Em acompanhamento" }, ...a.history];
        } else if (Math.random() < 0.08 && a.status === "in_progress") {
          a.status = "resolved";
          a.history = [{ at: now, event: "Fechado" }, ...a.history];
        } else {
          a.history = [{ at: now, event: "Atualização de localização" }, ...a.history].slice(0, 8);
        }

        copy[idx] = a;
        return copy;
      });
    }, 2500);

    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return alerts.filter((a) => {
      if (filters.status !== "all" && a.status !== filters.status) return false;
      if (filters.risk !== "all" && a.risk !== filters.risk) return false;
      if (filters.source !== "all" && a.source !== filters.source) return false;

      if (q) {
        const hay = `${a.id} ${a.victimName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [alerts, filters]);

  const activeCount = useMemo(() => alerts.filter((a) => a.status !== "resolved").length, [alerts]);

  const avgResponseSeconds = useMemo(() => {
    const candidates = alerts
      .map((a) => {
        const ev = a.history.find((h) => h.event === "Em acompanhamento");
        if (!ev) return null;
        return ev.at - a.createdAt;
      })
      .filter(Boolean);

    if (!candidates.length) return null;
    const ms = candidates.reduce((s, v) => s + v, 0) / candidates.length;
    return Math.round(ms / 1000);
  }, [alerts]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto", height: "100vh", background: "#f8fafc" }}>
      <TopBar activeCount={activeCount} totalCount={alerts.length} avgResponseSeconds={avgResponseSeconds} />

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr 420px", height: "calc(100vh - 54px)" }}>
        <AlertList
          filtered={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          filters={filters}
          setFilters={setFilters}
        />

        <MapView selected={selected} />

        <AlertDetails selected={selected} setAlerts={setAlerts} />
      </div>
    </div>
  );
}