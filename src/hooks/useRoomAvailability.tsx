import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRoomAvailability = () => {
  const [availableCounts, setAvailableCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initial fetch
    fetchAvailability();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('room-availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_units'
        },
        () => {
          // Refetch availability when room_units change
          fetchAvailability();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Refetch availability when bookings change
          fetchAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data: units, error } = await (supabase as any)
        .from('room_units')
        .select('room_id, status');

      if (error) throw error;

      const counts: Record<string, number> = {};
      units?.forEach((unit: any) => {
        if (unit.status === 'available') {
          counts[unit.room_id] = (counts[unit.room_id] || 0) + 1;
        }
      });

      setAvailableCounts(counts);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  return availableCounts;
};
