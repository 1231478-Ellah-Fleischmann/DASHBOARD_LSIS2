// Exporta uma constante de lista de alertas iniciais (mock data)
// Export -> permite que outros ficheiros importem isto
export const initialAlerts = [
  {
    id: "AL-10401",
    source: "app",
    status: "new",
    risk: "high",

    // Nome real vindo da app (utilizadora autenticada)
    fullName: "Maria Silva",
    anonymousId: null,

    lat: 41.1780,
    lng: -8.6080,

    // Timestamps reais (ISO 8601)
    createdAt: "2026-01-13T14:32:18Z",
    lastUpdateAt: "2026-01-13T14:32:18Z",

    history: [
      {
        at: "2026-01-13T14:32:18Z",
        event: "Alerta ativado através da aplicação",
      },
    ],
  },

  {
    id: "AL-10402",
    source: "device",
    status: "in_progress",
    risk: "medium",

    // Dispositivo físico → anonimato
    fullName: null,
    anonymousId: "Vítima #B12",

    lat: 41.1496,
    lng: -8.6109,

    createdAt: "2026-01-13T13:58:42Z",
    lastUpdateAt: "2026-01-13T14:05:10Z",

    history: [
      {
        at: "2026-01-13T13:58:42Z",
        event: "Alerta ativado através do dispositivo físico",
      },
      {
        at: "2026-01-13T14:05:10Z",
        event: "Alerta em acompanhamento",
      },
    ],
  },

  {
    id: "AL-10403",
    source: "app",
    status: "resolved",
    risk: "low",

    fullName: "Ana Costa",
    anonymousId: null,

    lat: 41.1579,
    lng: -8.6291,

    createdAt: "2026-01-12T22:41:03Z",
    lastUpdateAt: "2026-01-12T23:10:55Z",

    history: [
      {
        at: "2026-01-12T22:41:03Z",
        event: "Alerta ativado através da aplicação",
      },
      {
        at: "2026-01-12T22:48:20Z",
        event: "Alerta em acompanhamento",
      },
      {
        at: "2026-01-12T23:10:55Z",
        event: "Alerta resolvido",
      },
    ],
  },
];