import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() title = '';
  @Input() cars: ReadonlyArray<Car> = [];
  @Input() selectedCarId: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() selectCar = new EventEmitter<string>();

  public onClose(): void {
    this.close.emit();
  }

  public onSelectCar(carId: string): void {
    this.selectCar.emit(carId);
  }

  public formatPrice(price: number): string {
    return `R$ ${price.toLocaleString('pt-BR')}`;
  }
}
