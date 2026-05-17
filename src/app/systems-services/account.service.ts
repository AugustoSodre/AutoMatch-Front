import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SavedMatchRecord } from '../matches/saved-match.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly savedMatchesSubject = new BehaviorSubject<ReadonlyArray<SavedMatchRecord>>([
    {
      carId: 'kwid-iconic-2026',
      matchPct: 96,
      savedAt: '2026-05-14T10:15:00.000Z'
    },
    {
      carId: 'opala-ss-1980',
      matchPct: 88,
      savedAt: '2026-05-12T16:40:00.000Z'
    },
    {
      carId: 'dart-swinger-1974',
      matchPct: 81,
      savedAt: '2026-05-09T11:25:00.000Z'
    }
  ]);

  public getSavedMatches(): Observable<ReadonlyArray<SavedMatchRecord>> {
    return this.savedMatchesSubject.asObservable();
  }

  public clearSavedMatches(): void {
    this.savedMatchesSubject.next([]);
  }

  public setSavedMatches(savedMatches: ReadonlyArray<SavedMatchRecord>): void {
    this.savedMatchesSubject.next([...savedMatches]);
  }
}
