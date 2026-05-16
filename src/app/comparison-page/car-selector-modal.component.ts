import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { Car } from '../car.interface';

@Component({
  selector: 'app-car-selector-modal',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './car-selector-modal.component.html',
  styleUrls: ['./car-selector-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarSelectorModalComponent {
  @Input() title: string = '';
  @Input() cars: ReadonlyArray<Car> = [];
  @Input() selectedCarId: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() selectCar = new EventEmitter<string>();

  @HostListener('document:keydown.escape')
  public onEscapeKey(): void {
    this.onClose();
  }

  public onClose(): void {
    this.close.emit();
  }

  public onSelectCar(carId: string): void {
    this.selectCar.emit(carId);
    this.onClose();
  }

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  public trackByCarId(_index: number, car: Car): string {
    return car.id;
  }
}
