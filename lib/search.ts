// lib/search.ts
import { MeiliSearch, SearchParams, SearchResponse } from 'meilisearch';
import pb from './pocketbase';

// --- Types ---

export interface CourseDocument {
  id: string;
  type: 'course';
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  tags: string[];
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface EventDocument {
  id: string;
  type: 'event';
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  category: string;
  organizer: string;
  tags: string[];
  image?: string;
  created_at: string;
  updated_at: string;
}

export type SearchDocument = CourseDocument | EventDocument;

export interface SearchOptions {
  type?: 'course' | 'event';
  filters?: Record<string, string | number | boolean | string[]>;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface SearchResult {
  hits: SearchDocument[];
  totalHits: number;
  query: string;
  processingTimeMs: number;
}

// --- Constants ---

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://127.0.0.1:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';
const RETRY_DELAYS = [1000, 2000, 5000];

// --- Service Class ---

export class MeilisearchService {
  private client: MeiliSearch;
  private courseIndexUid = 'courses';
  private eventIndexUid = 'events';
  private initialized = false;

  constructor() {
    this.client = new MeiliSearch({
      host: MEILISEARCH_URL,
      apiKey: MEILISEARCH_API_KEY,
    });
  }

  /**
   * Verifies connection and ensures indexes exist with correct settings.
   */
  async connect(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.executeWithRetry(async () => {
        await this.client.health();
      });

      console.log('[Search] Meilisearch connected');

      await this.setupIndex(this.courseIndexUid, ['title', 'description', 'instructor']);
      await this.setupIndex(this.eventIndexUid, ['title', 'description', 'location', 'organizer']);

      this.initialized = true;
    } catch (e) {
      console.error('[Search] Connection failed:', e);
      throw e;
    }
  }

  private async setupIndex(uid: string, searchableAttributes: string[]): Promise<void> {
    const index = this.client.index(uid);

    try {
      await index.getStats();
    } catch {
      await this.client.createIndex(uid, { primaryKey: 'id' });
    }

    await index.updateSettings({
      searchableAttributes,
      filterableAttributes: ['category', 'price', 'level', 'start_date', 'type', 'tags'],
      sortableAttributes: ['price', 'created_at', 'start_date'],
      displayedAttributes: ['*'],
    });
  }

  // --- Indexing ---

  async indexCourses(courses: Partial<CourseDocument>[]): Promise<void> {
    const index = this.client.index(this.courseIndexUid);
    const documents = courses.map(c => ({ ...c, type: 'course' as const }));

    await this.executeWithRetry(async () => {
      await index.updateDocuments(documents);
    });

    console.log(`[Search] Indexed ${documents.length} courses`);
  }

  async indexEvents(events: Partial<EventDocument>[]): Promise<void> {
    const index = this.client.index(this.eventIndexUid);
    const documents = events.map(e => ({ ...e, type: 'event' as const }));

    await this.executeWithRetry(async () => {
      await index.updateDocuments(documents);
    });

    console.log(`[Search] Indexed ${documents.length} events`);
  }

  async deleteDocument(type: 'course' | 'event', id: string): Promise<void> {
    const indexName = type === 'course' ? this.courseIndexUid : this.eventIndexUid;
    const index = this.client.index(indexName);
    await index.deleteDocument(id);
  }

  // --- Search ---

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    const { type, filters, limit = 20, offset = 0 } = options;

    const searchParams: SearchParams = {
      limit,
      offset,
      attributesToHighlight: ['title', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    };

    const filterString = this.buildFilterString(filters);
    if (filterString) {
      searchParams.filter = filterString;
    }

    try {
      if (type === 'course') {
        const result = await this.client.index(this.courseIndexUid).search(query, searchParams);
        return this.formatResult(result, query);
      } else if (type === 'event') {
        const result = await this.client.index(this.eventIndexUid).search(query, searchParams);
        return this.formatResult(result, query);
      } else {
        // Multi-search both indexes
        const multiSearchQueries = [
          { indexUid: this.courseIndexUid, q: query, ...searchParams },
          { indexUid: this.eventIndexUid, q: query, ...searchParams },
        ];

        const rawResults = await this.client.multiSearch({ queries: multiSearchQueries });

        const allHits: SearchDocument[] = [];
        let totalHits = 0;
        let totalTime = 0;

        for (const result of rawResults.results) {
          allHits.push(...(result.hits as SearchDocument[]));
          totalHits += result.estimatedTotalHits || 0;
          totalTime += result.processingTimeMs || 0;
        }

        return {
          hits: allHits,
          totalHits,
          query,
          processingTimeMs: totalTime,
        };
      }
    } catch (error) {
      console.error('[Search] Query failed:', error);
      return { hits: [], totalHits: 0, query, processingTimeMs: 0 };
    }
  }

  private formatResult(result: SearchResponse<Record<string, unknown>>, query: string): SearchResult {
    return {
      hits: result.hits as unknown as SearchDocument[],
      totalHits: result.estimatedTotalHits || 0,
      query,
      processingTimeMs: result.processingTimeMs || 0,
    };
  }

  // --- Auto-Complete ---

  async getSuggestions(query: string, limit = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
      const params: SearchParams = {
        limit,
        attributesToRetrieve: ['title'],
      };

      const queries = [
        { indexUid: this.courseIndexUid, q: query, ...params },
        { indexUid: this.eventIndexUid, q: query, ...params },
      ];

      const response = await this.client.multiSearch({ queries });

      const titles = new Set<string>();
      for (const result of response.results) {
        for (const hit of result.hits) {
          if ((hit as { title?: string }).title) {
            titles.add((hit as { title: string }).title);
          }
        }
      }

      return Array.from(titles).slice(0, limit);
    } catch (e) {
      console.error('[Search] Suggestions failed:', e);
      return [];
    }
  }

  // --- Sync from PocketBase ---

  async syncFromPocketBase(): Promise<{ courses: number; events: number }> {
    console.log('[Search] Starting PocketBase sync...');

    try {
      // Sync Courses
      const coursesList = await pb.collection('courses').getFullList({
        sort: '-created',
      });

      const normalizedCourses = coursesList.map(c => ({
        id: c.id,
        title: c.title || c.name,
        description: c.description || '',
        instructor: c.instructor || '',
        category: c.category || 'General',
        level: c.level || 'Beginner',
        price: c.price || 0,
        tags: c.tags || [],
        image: c.thumbnail || c.image,
        created_at: c.created,
        updated_at: c.updated,
      }));

      if (normalizedCourses.length > 0) {
        await this.indexCourses(normalizedCourses);
      }

      // Sync Events
      const eventsList = await pb.collection('events').getFullList({
        sort: '-created',
      });

      const normalizedEvents = eventsList.map(e => ({
        id: e.id,
        title: e.title || e.name,
        description: e.description || '',
        location: e.location || e.venue || '',
        start_date: e.start_date || e.date,
        end_date: e.end_date || e.date,
        category: e.category || e.type || 'General',
        organizer: e.organizer || e.host || '',
        tags: e.tags || [],
        image: e.thumbnail || e.image,
        created_at: e.created,
        updated_at: e.updated,
      }));

      if (normalizedEvents.length > 0) {
        await this.indexEvents(normalizedEvents);
      }

      return { courses: normalizedCourses.length, events: normalizedEvents.length };
    } catch (error) {
      console.error('[Search] Sync failed:', error);
      throw error;
    }
  }

  // --- Helpers ---

  private buildFilterString(filters?: Record<string, unknown>): string | undefined {
    if (!filters) return undefined;

    const parts: string[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue;

      if (Array.isArray(value)) {
        const orParts = value.map(v => `${key} = "${this.escapeFilterValue(v)}"`);
        parts.push(`(${orParts.join(' OR ')})`);
      } else if (typeof value === 'string' || typeof value === 'number') {
        parts.push(`${key} = "${this.escapeFilterValue(value)}"`);
      } else if (typeof value === 'object' && value !== null) {
        const range = value as { min?: number; max?: number };
        if (range.min !== undefined) parts.push(`${key} >= ${range.min}`);
        if (range.max !== undefined) parts.push(`${key} <= ${range.max}`);
      }
    }

    return parts.length > 0 ? parts.join(' AND ') : undefined;
  }

  private escapeFilterValue(value: unknown): string {
    return String(value).replace(/"/g, '\\"');
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (const delay of RETRY_DELAYS) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        console.warn(`[Search] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

// Singleton instance
export const searchService = new MeilisearchService();
