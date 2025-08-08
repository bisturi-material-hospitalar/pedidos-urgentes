import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/BlockedOrdersToggle.css';

export default function BlockedOrdersToggle() {
  const [config, setConfig] = useState({ pedidos_bloqueados: false });

  // Carrega configuração inicial
  useEffect(() => {
    supabase
      .from('app_config')
      .select('pedidos_bloqueados')
      .eq('id', 'singleton')
      .single()
      .then(({ data }) => {
        if (data) setConfig(data);
      });
  }, []);

  // Toggle do switch
  const handleToggle = async () => {
    const novo = !config.pedidos_bloqueados;
    const { error } = await supabase
      .from('app_config')
      .upsert({ id: 'singleton', pedidos_bloqueados: novo });
    if (!error) setConfig({ pedidos_bloqueados: novo });
  };

  return (
    <div className="blocked-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={config.pedidos_bloqueados}
          onChange={handleToggle}
        />
        <span className="slider" />
      </label>
      <span>
        {config.pedidos_bloqueados
          ? <span>Pedidos <span className='order-blocked-alert'>BLOQUEADOS</span> para cadastro</span>
          : <span>Pedidos <span className='order-open-alert'>ATIVOS</span> para cadastro</span>
          }
      </span>
    </div>
  );
}
