import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import "../styles/Conferente.css";

export default function Conferente() {
  const { user, role } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatoAbertoId, setRelatoAbertoId] = useState(null);
  const [relatoText, setRelatoText] = useState("");

  // 1) Permissão de notificações
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 2) Fetch inicial e realtime
  useEffect(() => {
    if (!["conferente", "admin"].includes(role)) return;

    (async () => {
      const { data, error } = await supabase
        .from("pedidos_urgentes")
        .select("*")
        .eq("status", "pendente")
        .order("registrado_em", { ascending: false });
      if (!error) setPedidos(data);
      setLoading(false);
    })();

    const channel = supabase
      .channel("realtime-pedidos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pedidos_urgentes" },
        (payload) => {
          setPedidos((prev) => [payload.new, ...prev]);
          if (Notification.permission === "granted") {
            new Notification("Novo pedido!", {
              body: `Pedido ${payload.new.order_id} registrado.`,
              icon: "/logo192.png",
            });
          }
        }
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [role]);

  // 3) Ações
  const darBaixa = async (id) => {
    await supabase
      .from("pedidos_urgentes")
      .update({
        status: "impresso",
        conferente: user.id,
        impresso_em: new Date().toISOString(),
      })
      .eq("id", id);
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  const enviarRelato = async (id) => {
    await supabase
      .from("pedidos_urgentes")
      .update({ suporte: true, suporte_relato: relatoText })
      .eq("id", id);
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, suporte: true, suporte_relato: relatoText } : p
      )
    );
    setRelatoAbertoId(null);
    setRelatoText("");
  };

  if (!["conferente", "admin"].includes(role))
    return <div className="access-denied">Acesso negado.</div>;
  if (loading) return <Spinner />;

  // 4) Filtro
  const filtered = pedidos.filter(
    (p) =>
      p.order_id.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="conferente-container">
      <h1 className="conferente-title">Pedidos Pendentes</h1>
      <input
        type="text"
        placeholder="Buscar por ID ou cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filtered.length === 0 && (
        <p className="empty-text">Nenhum pedido encontrado.</p>
      )}

      {filtered.map((p) => (
        <div key={p.id} className="pedido-card">
          <div className="pedido-summary">
            <div className="pedido-info">
              <span>
                <strong>Pedido:</strong> {p.order_id}
              </span>
              <span>
                <strong>Cliente:</strong> {p.cliente}
              </span>
            </div>

            <div className="summary-actions">
              <button className="btn-ok" onClick={() => darBaixa(p.id)}>
                OK
              </button>
              <button
                className="btn-suporte"
                onClick={() =>
                  setRelatoAbertoId(relatoAbertoId === p.id ? null : p.id)
                }
              >
                Suporte
              </button>
            </div>
          </div>

          {relatoAbertoId === p.id && (
            <div className="relato-box">
              <textarea
                className="relato-textarea"
                value={relatoText}
                onChange={(e) => setRelatoText(e.target.value)}
                placeholder="Descreva o problema..."
              />
              <button
                className="btn-enviar-relato"
                onClick={() => enviarRelato(p.id)}
              >
                Enviar Suporte
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
