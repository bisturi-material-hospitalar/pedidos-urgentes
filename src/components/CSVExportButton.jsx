import { CSVLink } from 'react-csv';

export default function CSVExportButton({ pedidos }) {
  const headers = [
    { label: 'Pedido', key: 'order_id' },
    { label: 'Cliente', key: 'cliente' },
    { label: 'Atendente', key: 'nomeAtendente' },
    { label: 'Status', key: 'status' },
    { label: 'Suporte Relato', key: 'suporte_relato' },
    { label: 'Registrado Em', key: 'registrado_em' },
    { label: 'Impresso Em', key: 'impresso_em' },
  ];

  return (
    <CSVLink
      data={pedidos}
      headers={headers}
      filename="pedidos.csv"
      className="btn-csv"
    >
      Exportar CSV
    </CSVLink>
  );
}
