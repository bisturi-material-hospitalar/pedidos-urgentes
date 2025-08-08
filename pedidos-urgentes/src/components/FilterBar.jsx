export default function FilterBar({ status, date, onlySupport, onStatus, onDate, onOnlySupport }) {
  return (
    <div className="filters">
      <select value={status} onChange={e => onStatus(e.target.value)}>
        <option value="all">Todos</option>
        <option value="pendente">Pendentes</option>
        <option value="impresso">Impressos</option>
      </select>
      <input type="date" value={date} onChange={e => onDate(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={onlySupport}
          onChange={e => onOnlySupport(e.target.checked)}
        />{' '}
        Apenas Suporte
      </label>
    </div>
  );
}
