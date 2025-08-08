import { useState, useEffect, useRef } from 'react';
import { Home, Box, Settings, LogOut, ListChecks } from 'lucide-react';
import '../styles/Sidebar.css';

export function Sidebar({ role = 'admin', onSignOut }) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (overlayRef.current && e.target === overlayRef.current) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const links = [
    { to: '/order', label: 'Cadastrar Pedido', icon: Box, roles: ['atendente', 'admin'] },
    { to: '/conferente', label: 'Conferir Pedidos', icon: ListChecks, roles: ['conferente', 'admin'] },
    { to: '/admin', label: 'Painel Admin', icon: Home, roles: ['admin'] },
    { to: '/settings', label: 'Configurações', icon: Settings, roles: ['atendente', 'conferente', 'admin'] },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      >
        {open ? '×' : '☰'}
      </button>

      {open && <div className="sidebar-overlay" ref={overlayRef}></div>}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img
            src="https://arquivos.bisturi.com.br/imagens/logo/logo-bisturi-svg.svg"
            alt="Logo Bisturi"
            className="sidebar-logo"
          />
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon, roles }) =>
            roles.includes(role) ? (
              <a key={to} href={to} className="sidebar-link">
                <Icon className="nav-icon" />
                {open && <span>{label}</span>}
              </a>
            ) : null
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={onSignOut} className="btn-logout">
            <LogOut className="nav-icon" />
            {open && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
