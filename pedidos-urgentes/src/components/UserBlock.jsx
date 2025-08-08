import RegisterUser from '../components/RegisterUser';
import '../styles/UserBlock.css'

export function UserBlock({ users, showAddUser, setShowAddUser, handleRoleChange, handleDeleteUser, userError }) {
  return (
    <section className="block users-block mb-8">
      <div className="block-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Usuários</h2>
        <button
    onClick={()=>setShowAddUser(f=>!f)}
  aria-label={showAddUser ? "Fechar formulário" : "Abrir formulário"}
  className={
    showAddUser
      ? "btn-close"
      : "btn-add"}
>
  {showAddUser ? <span>&#x2716;</span> : 'Adicionar Usuário'}
</button>
      </div>
      {userError && <p className="error-text text-red-600 mb-4">{userError}</p>}
      {showAddUser ? (
        <div className="add-user-form mb-4">
          <RegisterUser onSuccess={() => setShowAddUser(false)} onError={setShowAddUser} />
        </div>
      ) : (
        <div className="table-wrapper overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">E-mail</th>
                <th className="px-4 py-2 text-left">Permissão</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const name = u.name || u.email.split('@')[0];
                return (
                  <tr key={u.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="atendente">Atendente</option>
                        <option value="conferente">Conferente</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button className="btn-delete text-red-500" onClick={() => handleDeleteUser(u.id, name)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
