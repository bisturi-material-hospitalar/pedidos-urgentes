import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../styles/Settings.css';

export default function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user.user_metadata?.name || '');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async e => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setLoading(true);
    try {
      const { error: updErr } = await supabase.auth.updateUser({
        data: { name: displayName },
        password: password || undefined,
      });
      if (updErr) throw updErr;

      const { error: dbErr } = await supabase
        .from('users')
        .update({ name: displayName })
        .eq('id', user.id);
      if (dbErr) throw dbErr;

      setFeedback({ type: 'success', message: 'Atualizações salvas com sucesso!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Erro: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Configurações</h1>

      {feedback.message && (
        <div className={`settings-feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form">
        <label>Nome</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
        />

        <label>Nova Senha (opcional)</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading} className="btn-save">
          {loading ? 'Salvando…' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
