import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { Car } from '../car.interface';

@Component({
  selector: 'app-vehicle-compare-card',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './vehicle-compare-card.component.html',
  styleUrls: ['./vehicle-compare-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCompareCardComponent {
  @Input() car: Car | undefined;
  @Input() slotLabel: string = '';

  @Output() changeVehicle = new EventEmitter<void>();

  public onChangeVehicle(): void {
    this.changeVehicle.emit();
  }

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}
