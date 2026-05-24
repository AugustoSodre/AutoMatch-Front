import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SavedMatchViewModel } from '../matches/saved-match.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/matches`;

  constructor(private readonly http: HttpClient) {}

  public getSavedMatches(): Observable<SavedMatchViewModel[]> {
    return this.http.get<SavedMatchViewModel[]>(this.apiUrl);
  }

  public createMatch(carId: string, matchPercentage: number): Observable<SavedMatchViewModel> {
    return this.http.post<SavedMatchViewModel>(this.apiUrl, { carId, matchPercentage });
  }

  public removeMatch(matchId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matchId}`);
  }
}
