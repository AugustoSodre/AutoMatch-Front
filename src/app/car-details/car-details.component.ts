import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap, catchError, of, Observable } from 'rxjs';

import { CarService } from '../systems-services';
import { Car } from '../car.interface';

interface DetailItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarDetailsComponent implements OnInit {
  public car$: Observable<Car | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly carService: CarService
  ) {
    this.car$ = this.route.queryParamMap.pipe(
      switchMap((params) => {
        const carId = params.get('carId');
        if (!carId) {
          this.router.navigate(['/inicio']);
          return of(null);
        }
        return this.carService.getCarById(carId).pipe(
          catchError(() => {
            this.router.navigate(['/inicio']);
            return of(null);
          })
        );
      })
    );
  }

  public ngOnInit(): void {}

  public buildTechnicalDetails(car: Car): DetailItem[] {
    return [
      { label: 'Motor', value: car.specs.engine },
      { label: 'Potência', value: car.specs.power },
      { label: 'Consumo', value: car.specs.consumption },
      { label: 'Peso', value: car.specs.weight },
    ];
  }

  public buildCostDetails(car: Car): DetailItem[] {
    return [
      { label: 'IPVA', value: `R$ ${car.costs.ipva.toLocaleString('pt-BR')}` },
      { label: 'Seguro', value: `R$ ${car.costs.insurance.toLocaleString('pt-BR')}` },
      { label: 'Manutenção', value: `R$ ${car.costs.maintenance.toLocaleString('pt-BR')}` },
    ];
  }

  public formatPrice(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
