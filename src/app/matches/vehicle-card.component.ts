import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { SavedMatchViewModel } from './saved-match.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCardComponent {
  @Input() match!: SavedMatchViewModel;
  @Input() selectedForCompare = false;

  @Output() toggleCompare = new EventEmitter<void>();

  public get displayMatchPercentage(): number {
    return Math.max(0, this.match.matchPercentage);
  }

  public emitToggleCompare(): void {
    this.toggleCompare.emit();
  }

  public formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  public formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(value));
  }
}
