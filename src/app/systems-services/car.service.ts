import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Car } from '../car.interface';
import { getSupabaseClient } from '../supabase/supabase.client';
import { mapCarRowToCar } from '../supabase/mappers';
import { CarRow } from '../supabase/types';

@Injectable({ providedIn: 'root' })
export class CarService {
  public getCars(): Observable<Car[]> {
    const supabase = getSupabaseClient();
    return from(
      supabase.from('cars').select('*').order('name')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('[CarService] getCars error:', error);
          return [];
        }
        return ((data as unknown as CarRow[]) || []).map(mapCarRowToCar);
      })
    );
  }

  public getCarById(id: string): Observable<Car> {
    const supabase = getSupabaseClient();
    return from(
      supabase.from('cars').select('*').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw { status: 404, error: { error: 'Carro não encontrado' } };
        }
        return mapCarRowToCar(data as unknown as CarRow);
      })
    );
  }
}
