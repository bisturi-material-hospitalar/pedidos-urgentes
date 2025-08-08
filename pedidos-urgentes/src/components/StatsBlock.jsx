import React, { useState, useEffect } from "react";
import "../styles/StatsBlock.css";

export function StatsBlock({ stats, dateRange, onDateRangeChange }) {
  const [customDates, setCustomDates] = useState({ from: "", to: "" });
  const [quick, setQuick] = useState(
    typeof dateRange === "string" ? dateRange : "custom"
  );

  // Quando dateRange é objeto customizado, preenche inputs
  useEffect(() => {
    if (
      typeof dateRange === "object" &&
      dateRange.type === "custom"
    ) {
      setQuick("custom");
      setCustomDates({ from: dateRange.from, to: dateRange.to });
    }
  }, [dateRange]);

  const options = [
    { label: "Hoje", value: "today" },
    { label: "Ontem", value: "yesterday" },
    { label: "Últimos 7 dias", value: "7" },
    { label: "21 dias", value: "21" },
    { label: "30 dias", value: "30" },
    { label: "3 meses", value: "90" },
    { label: "Personalizado", value: "custom" },
  ];

  const handleApply = () => {
    if (quick === "custom") {
      if (customDates.from && customDates.to) {
        onDateRangeChange({
          type: "custom",
          from: customDates.from,
          to: customDates.to,
        });
      }
    } else {
      onDateRangeChange(quick);
    }
  };

  const handleClear = () => {
    setQuick("today");
    setCustomDates({ from: "", to: "" });
    onDateRangeChange("today");
  };

  return (
    <section className="stats-block">
      <h2 className="stats-title">Estatísticas de Pedidos</h2>

      <div className="stats-filter">
        <label htmlFor="quick-range">Período:</label>
        <select
          id="quick-range"
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {quick === "custom" && (
          <div className="custom-date-inputs">
            <input
              type="date"
              value={customDates.from}
              onChange={(e) =>
                setCustomDates((d) => ({ ...d, from: e.target.value }))
              }
            />
            <span className="to-label">até</span>
            <input
              type="date"
              value={customDates.to}
              onChange={(e) =>
                setCustomDates((d) => ({ ...d, to: e.target.value }))
              }
            />
          </div>
        )}

        <button className="btn-filter" onClick={handleApply}>
          Filtrar
        </button>
        <button className="btn-clear" onClick={handleClear}>
          Limpar Filtro
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total de Pedidos</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Top Atendentes</h3>
          <ol>
            {stats.topSellers.map((s, i) => (
              <li key={i}>
                {s.nome_atendente}: {s.count}
              </li>
            ))}
          </ol>
        </div>
        <div className="stat-card">
          <h3>Top Conferentes</h3>
          <ol>
            {stats.topCheckers.map((c, i) => (
              <li key={i}>
                {c.name}: {c.count}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
