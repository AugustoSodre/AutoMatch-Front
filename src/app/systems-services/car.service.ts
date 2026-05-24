import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Car } from '../car.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly apiUrl = `${environment.apiUrl}/cars`;

  constructor(private readonly http: HttpClient) {}

  public getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  public getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }
}
