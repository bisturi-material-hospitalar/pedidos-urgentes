import { supabase } from "../supabaseClient";

export async function createPedido({ orderId, cliente, observacoes }) {
  // 1) pega a sessão atual
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error("Usuário não autenticado");
  }
  const user = session.user;

  // 2) insere o pedido
  const { data, error } = await supabase
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
  return data;
}

export async function fetchPedidosPendentes() {
  const { data, error } = await supabase
    .from("pedidos_urgentes")
    .select("*")
    .eq("status", "pendente")
    .order("registrado_em", { ascending: false });
  if (error) throw error;
  return data;
}
