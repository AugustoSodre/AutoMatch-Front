import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { CarService } from './car.service';
import { Car } from '../car.interface';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly selectedCarIdsSubject = new BehaviorSubject<[string, string]>(['kwid-iconic-2026', 'opala-ss-1980']);

  public readonly selectedCarIds$ = this.selectedCarIdsSubject.asObservable();

  constructor(private readonly carService: CarService) {}

  public setSelectedCar(slotIndex: 0 | 1, carId: string): void {
    const current = this.selectedCarIdsSubject.value;
    const next: [string, string] = [current[0], current[1]];
    next[slotIndex] = carId;
    this.selectedCarIdsSubject.next(next);
  }

  public setSelectedCars(leftCarId: string, rightCarId: string): void {
    this.selectedCarIdsSubject.next([leftCarId, rightCarId]);
  }

  public getSelectedCars$(): Observable<[Car | undefined, Car | undefined]> {
    return combineLatest([
      this.selectedCarIds$,
      this.carService.getCars()
    ]).pipe(
      map(([selectedIds, cars]) => {
        const leftCar = cars.find((car: Car) => car.id === selectedIds[0]);
        const rightCar = cars.find((car: Car) => car.id === selectedIds[1]);
        return [leftCar, rightCar] as [Car | undefined, Car | undefined];
      })
    );
  }

  public getCatalog$(): Observable<Car[]> {
    return this.carService.getCars();
  }
}
