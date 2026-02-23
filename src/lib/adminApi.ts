import { supabase } from './supabase'

/* ===============================
   USERS
================================= */

export const getAllUsers = async () => {
  return await supabase
    .from('users')
    .select('*')
}

export const suspendUser = async (id: string) => {
  return await supabase
    .from('users')
    .update({ is_suspended: true })
    .eq('id', id)
}

export const unsuspendUser = async (id: string) => {
  return await supabase
    .from('users')
    .update({ is_suspended: false })
    .eq('id', id)
}

export const changeUserRole = async (id: string, role: string) => {
  return await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
}