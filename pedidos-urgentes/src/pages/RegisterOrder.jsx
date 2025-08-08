// src/pages/RegisterOrder.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import OrderForm from "../components/OrderForm";
import "../styles/RegisterOrder.css";

export default function RegisterOrder() {
  const { role } = useAuth();
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [blocked, setBlockedFlag] = useState(false);

  // Carrega configuração de bloqueio
  useEffect(() => {
    supabase
      .from("app_config")
      .select("pedidos_bloqueados")
      .eq("id", "singleton")
      .single()
      .then(({ data }) => {
        if (data) setBlockedFlag(data.pedidos_bloqueados);
      });
  }, []);

  // Função que cria o pedido
  const createPedido = async ({ orderId, cliente, observacoes }) => {
    const {
      data: { session },
      error: errSession,
    } = await supabase.auth.getSession();
    if (errSession || !session) {
      throw new Error("Usuário não autenticado");
    }
    if (blocked) {
      throw new Error("Cadastro de pedidos está bloqueado pelo administrador.");
    }
    const user = session.user;

    const { error } = await supabase
      .from("pedidos_urgentes")
      .insert([
        {
          order_id: orderId,
          cliente,
          observacoes,
          registrado_por: user.id,
          nome_atendente: user.user_metadata?.name || user.email.split("@")[0],
          status: "pendente",
          suporte: false,
          registrado_em: new Date().toISOString(),
        },
      ]);
    if (error) throw error;
  };

  const handleOrderSubmit = async (dados) => {
    setFeedback({ type: "", message: "" });
    try {
      await createPedido(dados);
      setFeedback({ type: "success", message: "✅ Pedido cadastrado!" });
    } catch (err) {
      setFeedback({ type: "error", message: "❌ " + err.message });
    }
  };

  if (!["atendente", "admin"].includes(role)) {
    return <div className="access-denied">Acesso negado.</div>;
  }

  return (
    <div className="register-order-container">
      <h2>Cadastrar Pedido</h2>
      {blocked && (
        <div className="feedback error">
          🚫 O cadastro de pedidos está temporariamente bloqueado!
        </div>
      )}
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
      )}
      <OrderForm onSubmit={handleOrderSubmit} disabled={blocked} />
    </div>
  );
}
