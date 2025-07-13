// src/supabaseRealtime.js
import { supabase } from './supabaseClient';

export function subscribeToTable(table, onChange) {
  const channel = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      onChange
    )
    .subscribe();

  return () => supabase.removeChannel(channel); // Unsubscribe function
}
