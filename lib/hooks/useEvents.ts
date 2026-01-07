'use client';

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';

export interface PBEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'workshop' | 'seminar' | 'webinar' | 'bootcamp' | 'networking';
  date: string;
  time: string;
  duration: string;
  location: string;
  price: number;
  capacity: number;
  registered_count: number;
  image?: string;
  created: string;
  updated: string;
}

export function usePublicEvents() {
  const [events, setEvents] = useState<PBEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const records = await pb.collection('events').getFullList<PBEvent>({
          sort: 'date',
          requestKey: null,
        });
        setEvents(records);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}

export function useEventBySlug(slug: string) {
  const [event, setEvent] = useState<PBEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        const record = await pb.collection('events').getFirstListItem<PBEvent>(
          `slug = "${slug}"`,
          { requestKey: null }
        );
        setEvent(record);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Event not found');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [slug]);

  return { event, isLoading, error };
}
