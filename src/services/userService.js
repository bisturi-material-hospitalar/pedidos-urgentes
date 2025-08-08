import { supabase } from '../supabaseClient';

export async function signUpUser({ email, password, name, role }) {
  // 1) cria credenciais no Auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (signUpError) throw signUpError;

  // 2) insere perfil na tabela users
  const { error: dbError } = await supabase
    .from('users')
    .insert([{ id: data.user.id, name, email, role }]);
  if (dbError) throw dbError;

  return data.user;
}

export async function updateUserRoleByEmail(email, newRole) {
  // busca o usuário pelo e-mail
  const { data: user, error: fetchErr } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  if (fetchErr) throw fetchErr;

  const { error: updateErr } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', user.id);
  if (updateErr) throw updateErr;

  return true;
}
