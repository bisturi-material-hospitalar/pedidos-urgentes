import { Badge } from './Badge';
import '../styles/OrdersBlock.css';
import { useState } from 'react';

export function OrdersBlock({
  pedidos = [],
  filterStatus,
  setFilterStatus,
  onlySupport,
  setOnlySupport,
  openPedidoId,
  setOpenPedidoId,
  safeLocale,
  reverterPedido,
  userMap = {},
  disableSupportButton = false,
}) {
  // date quick filters
  const [quickRange, setQuickRange] = useState('today');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // compute filteredPedidos inside
  const filteredByDate = pedidos.filter(p => {
    const dt = new Date(p.registrado_em);
    const now = new Date();
    if (quickRange === 'today') {
      return dt.toDateString() === now.toDateString();
    } else if (quickRange === 'yesterday') {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      return dt.toDateString() === y.toDateString();
    } else if (['7','21','30'].includes(quickRange)) {
      const cutoff = new Date(now.getTime() - parseInt(quickRange) * 86400000);
      return dt >= cutoff;
    } else if (quickRange === 'custom' && fromDate && toDate) {
      const f = new Date(fromDate);
      const t = new Date(toDate);
      return dt >= f && dt <= t;
    }
    return true;
  });

  const finalList = filteredByDate.filter(p => {
    const byStatus = filterStatus === 'all' || p.status === filterStatus;
    const bySupport = onlySupport ? p.suporte : true;
    return byStatus && bySupport;
  });

  return (
    <section className="block pedidos-block">
      <div className="block-header">
        <h2>Painel de Pedidos</h2>
      </div>
      <div className="filters date-filters">
        <select value={quickRange} onChange={e => setQuickRange(e.target.value)}>
          <option value="today">Hoje</option>
          <option value="yesterday">Ontem</option>
          <option value="7">Últimos 7 dias</option>
          <option value="21">Últimos 21 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="custom">Personalizado</option>
        </select>
        {quickRange === 'custom' && (
          <>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </>
        )}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="impresso">Impresso</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={onlySupport}
            onChange={e => setOnlySupport(e.target.checked)}
          />{' '}
          Apenas Suporte
        </label>
      </div>

      {finalList.map(p => (
        <div
          key={p.id}
          className={`pedido-card ${p.status} ${p.suporte ? 'suporte' : ''}`}
          onClick={() => setOpenPedidoId(openPedidoId === p.id ? null : p.id)}
        >
          <div className="pedido-summary">
            <span><strong>Pedido:</strong> {p.order_id}</span>
            <div className="badges">
              <Badge variant={p.status === 'pendente' ? 'outline' : 'secondary'}>
                {p.status === 'pendente' ? 'Pendente' : 'Impresso'}
              </Badge>
              {p.suporte && (
                <Badge variant="destructive" className="support-badge">
                  Suporte
                </Badge>
              )}
            </div>
          </div>

          {openPedidoId === p.id && (
            <div className="pedido-details">
              <p><strong>Cliente:</strong> {p.cliente}</p>
              {p.suporte_relato && (
                <p className="relato-admin"><strong>Suporte:</strong> {p.suporte_relato}</p>
              )}
              <p><strong>Registrado em:</strong> {safeLocale(p.registrado_em)}</p>
              <p>
                <strong>Conferente:</strong>{' '}
                {userMap[p.conferente] || '-'}
              </p>
              <p><strong>Baixa em:</strong> {safeLocale(p.impresso_em)}</p>

              <div className="actions">
                <button onClick={e => { e.stopPropagation(); reverterPedido(p.id); }}>Reverter</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {finalList.length === 0 && <p className="empty-text">Nenhum pedido encontrado.</p>}
    </section>
  );
}
