import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import BlockedOrdersToggle from "../components/BlockedOrdersToggle";
import { StatsBlock } from "../components/StatsBlock";
import { UserBlock } from "../components/UserBlock";
import { OrdersBlock } from "../components/OrdersBlock";
import "../styles/Admin.css";
import "../styles/StatsBlock.css";

export default function AdminPanel() {
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [openPedidoId, setOpenPedidoId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [onlySupport, setOnlySupport] = useState(false);

 const [dateRange, setDateRange] = useState("7");
  const [stats, setStats] = useState({
    total: 0,
    topSellers: [],
    topCheckers: [],
  });

  const userMap = Object.fromEntries(
    users.map((u) => [u.id, u.name || u.email.split("@")[0]])
  );

  const safeLocale = (ts) => (ts ? new Date(ts).toLocaleString() : "-");

  // Recupera sessão e role
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) return setUserError(error.message);
      const user = data.session?.user;
      if (user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data: prof }) => {
            if (prof) setRole(prof.role);
          });
      }
    });
  }, []);

  // Carrega usuários e pedidos
  useEffect(() => {
    if (role !== "admin") return;

    supabase
      .from("users")
      .select("id,name,email,role")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setUserError(error.message);
        else setUsers(data || []);
      });

    supabase
      .from("pedidos_urgentes")
      .select("*")
      .order("registrado_em", { ascending: false })
      .then(({ data, error }) => {
        if (error) setUserError(error.message);
        else setPedidos(data || []);
      });
  }, [role]);

  // Calcula estatísticas filtrando pelo período `dateRange`
  useEffect(() => {
    const now = new Date();
    const dayCount = parseInt(dateRange, 10);
    const cutoff = new Date(now.getTime() - dayCount * 24 * 60 * 60 * 1000);

    const filtered = pedidos.filter((p) => {
      const dt = new Date(p.registrado_em);
      return dt >= cutoff;
    });

    const total = filtered.length;
    const sellerCounts = {};
    const checkerCounts = {};

    filtered.forEach((p) => {
      sellerCounts[p.nome_atendente] =
        (sellerCounts[p.nome_atendente] || 0) + 1;
      if (p.conferente) {
        checkerCounts[p.conferente] =
          (checkerCounts[p.conferente] || 0) + 1;
      }
    });

    const topSellers = Object.entries(sellerCounts)
      .map(([nome_atendente, count]) => ({ nome_atendente, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const userMap = Object.fromEntries(
      users.map((u) => [u.id, u.name || u.email.split("@")[0]])
    );
    const topCheckers = Object.entries(checkerCounts)
      .map(([conferente, count]) => ({
        name: userMap[conferente] || conferente,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setStats({ total, topSellers, topCheckers });
  }, [pedidos, users, dateRange]);

  if (role !== "admin") {
    return <div className="access-denied">Acesso negado.</div>;
  }

  // Filtra pedidos para o OrdersBlock
  const filteredPedidos = pedidos.filter((p) => {
    const byStatus = filterStatus === "all" || p.status === filterStatus;
    const byDate = filterDate
      ? p.registrado_em.startsWith(filterDate)
      : true;
    const bySupport = onlySupport ? p.suporte : true;
    return byStatus && byDate && bySupport;
  });

  // Ações de Reverter
  const reverterPedido = async (id) => {
    await supabase
      .from("pedidos_urgentes")
      .update({
        status: "pendente",
        suporte: false,
        suporte_relato: "",
        conferente: null,
        impresso_em: null,
      })
      .eq("id", id);

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "pendente", suporte: false, suporte_relato: "" }
          : p
      )
    );
  };

  // — CRUD de usuários
  const handleRoleChange = async (uid, newRole) => {
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", uid);
    if (error) setUserError(error.message);
    else
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
  };
  const handleDeleteUser = async (uid, name) => {
    if (!window.confirm(`Excluir usuário ${name}?`)) return;
    const { error } = await supabase.from("users").delete().eq("id", uid);
    if (error) setUserError(error.message);
    else setUsers((prev) => prev.filter((u) => u.id !== uid));
  };

  return (
    <div className="admin-container min-h-screen overflow-y-auto p-6">
      {/* Toggle de bloqueio */}
      <BlockedOrdersToggle />

      {/* Estatísticas com filtro de período */}
      <StatsBlock
        stats={stats}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Gestão de usuários */}
      <UserBlock
        users={users}
        showAddUser={showAddUser}
        setShowAddUser={setShowAddUser}
        handleRoleChange={handleRoleChange}
        handleDeleteUser={handleDeleteUser}
        userError={userError}
      />

      {/* Painel de pedidos */}
      <OrdersBlock
        pedidos={pedidos}
        filteredPedidos={filteredPedidos}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        onlySupport={onlySupport}
        setOnlySupport={setOnlySupport}
        openPedidoId={openPedidoId}
        setOpenPedidoId={setOpenPedidoId}
        safeLocale={safeLocale}
        reverterPedido={reverterPedido}
        disableSupportButton={true}
         userMap={userMap}
      />
    </div>
  );
}
