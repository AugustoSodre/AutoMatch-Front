import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { SavedMatchViewModel } from '../matches/saved-match.model';
import { getSupabaseClient } from '../supabase/supabase.client';
import { mapSavedMatchToViewModel } from '../supabase/mappers';
import { SavedMatchWithCarRow } from '../supabase/types';

@Injectable({ providedIn: 'root' })
export class AccountService {
  public getSavedMatches(): Observable<SavedMatchViewModel[]> {
    const supabase = getSupabaseClient();
    return from(
      (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
          .from('saved_matches')
          .select('*, car:cars(*)')
          .eq('user_id', session.user.id)
          .order('saved_at', { ascending: false });

        if (error) {
          console.error('[AccountService] getSavedMatches error:', error);
          return [];
        }
        return ((data as unknown as SavedMatchWithCarRow[]) || []).map(mapSavedMatchToViewModel);
      })()
    );
  }

  public createMatch(carId: string, matchPercentage: number): Observable<SavedMatchViewModel> {
    const supabase = getSupabaseClient();
    return from(
      (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw { status: 401, error: { error: 'Não autenticado' } };

        const { data, error } = await supabase
          .from('saved_matches')
          .insert({
            user_id: session.user.id,
            car_id: carId,
            match_percentage: matchPercentage,
          })
          .select('*, car:cars(*)')
          .single();

        if (error) {
          if (error.message.includes('duplicate') || error.message.includes('already exists')) {
            throw { status: 409, error: { error: 'Match já salvo' } };
          }
          throw { status: 500, error: { error: 'Erro ao salvar match' } };
        }
        return mapSavedMatchToViewModel(data as unknown as SavedMatchWithCarRow);
      })()
    );
  }

  public removeMatch(matchId: string): Observable<void> {
    const supabase = getSupabaseClient();
    return from(
      supabase.from('saved_matches').delete().eq('id', matchId)
    ).pipe(
      map(({ error }) => {
        if (error) {
          throw { status: 500, error: { error: 'Erro ao remover match' } };
        }
      })
    );
  }
}
