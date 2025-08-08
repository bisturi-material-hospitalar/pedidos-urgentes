import { useState } from 'react';
import { signUpUser, updateUserRoleByEmail } from '../services/userService';

export default function RegisterUser({ onSuccess, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('atendente');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    try {
      await signUpUser({ email, password, name, role });
      onSuccess?.();
      setName(''); setEmail(''); setPassword(''); setRole('atendente');
    } catch (err) {
      if (err.status === 400 && err.message.includes('already')) {
        setError('E-mail já existe. Deseja atualizar o role?');
        setShowUpdate(true);
      } else {
        const msg = 'Erro ao criar usuário: ' + err.message;
        setError(msg);
        onError?.(msg);
      }
    }
  };

  const handleUpdateRole = async e => {
    e.preventDefault();
    setError('');
    try {
      await updateUserRoleByEmail(email, role);
      setError('Permissão atualizada com sucesso!');
      setShowUpdate(false);
      onSuccess?.();
    } catch (err) {
      const msg = 'Falha ao atualizar permissão: ' + err.message;
      setError(msg);
      onError?.(msg);
    }
  };

  return (
    <>
      <form onSubmit={handleRegister} className="register-form">
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="register-input"
        >
          <option value="atendente">Atendente</option>
          <option value="conferente">Conferente</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="register-button">
          Criar Usuário
        </button>
      </form>

      {showUpdate && (
        <form onSubmit={handleUpdateRole} className="mt-4 register-form">
          <p className="text-yellow-700">
            Atualizar permissão do e-mail <strong>{email}</strong>
          </p>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="register-input"
          >
            <option value="atendente">Atendente</option>
            <option value="conferente">Conferente</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="register-button">
            Atualizar Permissão
          </button>
        </form>
      )}
    </>
  );
}
