'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

const realtimeTables = [
  'ops_activity_events',
  'ops_leads',
  'ops_accounts',
  'ops_meetings',
  'ops_calls',
  'ops_projects',
  'ops_tasks',
];

export function AdminRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase.channel('moa-admin-dashboard-refresh');
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleRefresh() {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      refreshTimer = setTimeout(() => {
        router.refresh();
      }, 300);
    }

    realtimeTables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        scheduleRefresh
      );
    });

    channel.subscribe();

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
