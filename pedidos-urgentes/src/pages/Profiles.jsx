import { useRef, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Preenche campos iniciais
  useEffect(() => {
    if (user) {
      nameRef.current.value = user.user_metadata?.name || "";
      emailRef.current.value = user.email;
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const updates = {};

    // Se nome mudou
    if (nameRef.current.value !== user.user_metadata?.name) {
      updates.data = { name: nameRef.current.value };
    }

    // Se e‑mail mudou
    if (emailRef.current.value !== user.email) {
      updates.email = emailRef.current.value;
    }

    try {
      // Atualiza perfil e/ou e‑mail
      if (updates.data || updates.email) {
        const { error: upError } = await supabase.auth.updateUser(updates);
        if (upError) throw upError;
      }
      // Se senha preenchida, atualiza senha
      if (passwordRef.current.value) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: passwordRef.current.value,
        });
        if (pwError) throw pwError;
      }

      setMessage("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      setError("❌ " + err.message);
    }
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Editar Perfil</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-600 mb-2">{message}</div>}

      <form onSubmit={handleSubmit} className="profile-form space-y-4">
        <div>
          <label className="form-label">Nome</label>
          <input
            type="text"
            ref={nameRef}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">E‑mail</label>
          <input
            type="email"
            ref={emailRef}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Nova Senha</label>
          <input
            type="password"
            ref={passwordRef}
            placeholder="Deixe em branco para manter atual"
            className="form-input"
          />
        </div>
        <button type="submit" className="btn-primary">
          Atualizar
        </button>
      </form>
    </div>
  );
}
