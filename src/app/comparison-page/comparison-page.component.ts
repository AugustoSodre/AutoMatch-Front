import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Car } from '../car.interface';
import { CarService } from '../car.service';
import { ComparisonSpec } from './comparison-spec.interface';
import { ComparisonService } from './comparison.service';
import { CarSelectorModalComponent } from './car-selector-modal.component';
import { VehicleCompareCardComponent } from './vehicle-compare-card.component';

interface ComparisonRowView {
  spec: ComparisonSpec;
  leftValue: string;
  rightValue: string;
  leftBetter: boolean;
  rightBetter: boolean;
}

type CompareSlot = 'left' | 'right' | null;

@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf, NgFor, VehicleCompareCardComponent, CarSelectorModalComponent],
  templateUrl: './comparison-page.component.html',
  styleUrls: ['./comparison-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonPageComponent implements OnInit {
  public readonly cars$ = this.carService.getCars();
  public readonly selectedCars$: Observable<[Car | undefined, Car | undefined]> = this.comparisonService.getSelectedCars$();

  public readonly comparisonSpecs: ReadonlyArray<ComparisonSpec> = [
    {
      key: 'price',
      label: 'Valor',
      icon: 'R$',
      direction: 'lower',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: this.formatCurrency(leftValue),
        right: this.formatCurrency(rightValue)
      })
    },
    {
      key: 'engine',
      label: 'Motor',
      icon: '⚙',
      direction: 'none',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: String(leftValue ?? '-'),
        right: String(rightValue ?? '-')
      })
    },
    {
      key: 'power',
      label: 'Cavalaria',
      icon: '⚡',
      direction: 'higher',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: String(leftValue ?? '-'),
        right: String(rightValue ?? '-')
      })
    },
    {
      key: 'consumption',
      label: 'Economia',
      icon: '⛽',
      direction: 'higher',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: String(leftValue ?? '-'),
        right: String(rightValue ?? '-')
      })
    },
    {
      key: 'weight',
      label: 'Peso',
      icon: '▣',
      direction: 'lower',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: String(leftValue ?? '-'),
        right: String(rightValue ?? '-')
      })
    },
    {
      key: 'ipva',
      label: 'IPVA',
      icon: '$',
      direction: 'lower',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: this.formatCurrency(leftValue),
        right: this.formatCurrency(rightValue)
      })
    },
    {
      key: 'insurance',
      label: 'Seguro',
      icon: '🛡',
      direction: 'lower',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: this.formatCurrency(leftValue),
        right: this.formatCurrency(rightValue)
      })
    },
    {
      key: 'maintenance',
      label: 'Revisões',
      icon: '🧰',
      direction: 'lower',
      formatter: (leftValue: unknown, rightValue: unknown) => ({
        left: this.formatCurrency(leftValue),
        right: this.formatCurrency(rightValue)
      })
    }
  ];

  public activeSlot: CompareSlot = null;

  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly carService: CarService,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const leftCarId = params.get('leftCarId');
      const rightCarId = params.get('rightCarId');

      if (leftCarId && rightCarId) {
        this.comparisonService.setSelectedCars(leftCarId, rightCarId);
      }
    });
  }

  public openSelector(slot: 'left' | 'right'): void {
    this.activeSlot = slot;
  }

  public closeSelector(): void {
    this.activeSlot = null;
  }

  public selectCar(carId: string): void {
    if (this.activeSlot === 'left') {
      this.comparisonService.setSelectedCar(0, carId);
    }

    if (this.activeSlot === 'right') {
      this.comparisonService.setSelectedCar(1, carId);
    }

    this.closeSelector();
  }

  public buildRows(leftCar: Car | undefined, rightCar: Car | undefined): ReadonlyArray<ComparisonRowView> {
    return this.comparisonSpecs.map((spec: ComparisonSpec) => {
      const leftValue = this.resolveValue(leftCar, spec.key);
      const rightValue = this.resolveValue(rightCar, spec.key);
      const comparison = this.getComparisonOutcome(spec.direction, leftValue, rightValue);

      return {
        spec,
        leftValue: spec.formatter(leftValue, rightValue).left,
        rightValue: spec.formatter(leftValue, rightValue).right,
        leftBetter: comparison === 'left',
        rightBetter: comparison === 'right'
      };
    });
  }

  private resolveValue(car: Car | undefined, key: ComparisonSpec['key']): unknown {
    if (!car) {
      return '-';
    }

    switch (key) {
      case 'price':
        return car.price;
      case 'engine':
        return car.specs.engine;
      case 'power':
        return car.specs.power;
      case 'consumption':
        return car.specs.consumption;
      case 'weight':
        return car.specs.weight;
      case 'ipva':
        return car.costs.ipva;
      case 'insurance':
        return car.costs.insurance;
      case 'maintenance':
        return car.costs.maintenance;
      default:
        return '-';
    }
  }

  private getComparisonOutcome(direction: ComparisonSpec['direction'], leftValue: unknown, rightValue: unknown): 'left' | 'right' | 'none' {
    if (direction === 'none') {
      return 'none';
    }

    const leftNumber = this.toNumber(leftValue);
    const rightNumber = this.toNumber(rightValue);

    if (leftNumber === null || rightNumber === null || leftNumber === rightNumber) {
      return 'none';
    }

    if (direction === 'higher') {
      return leftNumber > rightNumber ? 'left' : 'right';
    }

    return leftNumber < rightNumber ? 'left' : 'right';
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value
      .replace(/[^0-9,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private formatCurrency(value: unknown): string {
    const parsed = this.toNumber(value);

    if (parsed === null) {
      return '-';
    }

    return `R$ ${parsed.toLocaleString('pt-BR')}`;
  }
}
