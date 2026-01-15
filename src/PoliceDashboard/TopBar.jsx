//Importa:
//Badge → componente visual reutilizável (pílulas).
//formatTime → função que formata datas.

import React from "react";
import { Badge, formatTime } from "./utils";

export default function TopBar({
  activeCount,
  totalCount,
  avgResponseSeconds,
  lastEventAt,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 700 }}>Dashboard Operacional</div>

      <Badge>Alertas ativos: {activeCount}</Badge>
      <Badge>Total: {totalCount}</Badge>

      <Badge>
        {avgResponseSeconds !== null
          ? `Tempo médio até acompanhamento: ~${avgResponseSeconds}s`
          : "Tempo médio: n/d"}
      </Badge>

      <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
        Última atualização: {lastEventAt ? formatTime(lastEventAt) : "n/d"}
      </div>
    </div>
  );
}