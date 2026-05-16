import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs';

import { CarService } from '../car.service';
import { AccountService } from '../account.service';
import {
  SavedMatchRecord,
  SavedMatchViewModel,
  SavedMatchesSortOption,
  SavedMatchesViewMode
} from './saved-match.model';
import { VehicleCardComponent } from './vehicle-card.component';

interface SavedMatchesDashboardState {
  matches: ReadonlyArray<SavedMatchViewModel>;
  totalMatches: number;
  filteredMatches: number;
  viewMode: SavedMatchesViewMode;
  searchTerm: string;
}

@Component({
  selector: 'app-saved-matches-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, NgIf, NgFor, VehicleCardComponent],
  templateUrl: './saved-matches-dashboard.component.html',
  styleUrls: ['./saved-matches-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedMatchesDashboardComponent {
  public readonly dashboardForm = this.formBuilder.nonNullable.group({
    search: '',
    sort: 'savedAtDesc' as SavedMatchesSortOption,
    view: 'grid' as SavedMatchesViewMode
  });

  private readonly compareSelectionSubject = new BehaviorSubject<ReadonlyArray<string>>([]);

  public readonly savedMatches$ = combineLatest([
    this.accountService.getSavedMatches(),
    this.carService.getCars()
  ]).pipe(
    map(([savedMatches, cars]) =>
      savedMatches
        .map((record: SavedMatchRecord) => {
          const car = cars.find((item) => item.id === record.carId);
          if (!car) {
            return null;
          }

          return {
            ...record,
            car
          };
        })
        .filter((match): match is SavedMatchViewModel => match !== null)
    )
  );

  public readonly dashboardState$: Observable<SavedMatchesDashboardState> = combineLatest([
    this.savedMatches$,
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(180), distinctUntilChanged()),
    this.sortControl.valueChanges.pipe(startWith(this.sortControl.value)),
    this.viewControl.valueChanges.pipe(startWith(this.viewControl.value))
  ]).pipe(
    map(([matches, searchTerm, sortBy, viewMode]) => {
      const filteredMatches = this.filterMatches(matches, searchTerm);

      return {
        matches: this.sortMatches(filteredMatches, sortBy),
        totalMatches: matches.length,
        filteredMatches: filteredMatches.length,
        viewMode,
        searchTerm
      };
    })
  );

  public readonly selectedCompareMatches$ = combineLatest([
    this.savedMatches$,
    this.compareSelectionSubject.asObservable()
  ]).pipe(
    map(([matches, selectedIds]) =>
      selectedIds
        .map((matchId) => matches.find((match) => match.car.id === matchId) ?? null)
        .filter((match): match is SavedMatchViewModel => match !== null)
    )
  );

  constructor(
    private readonly accountService: AccountService,
    private readonly carService: CarService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  public get searchControl(): FormControl<string> {
    return this.dashboardForm.controls.search;
  }

  public get sortControl(): FormControl<SavedMatchesSortOption> {
    return this.dashboardForm.controls.sort;
  }

  public get viewControl(): FormControl<SavedMatchesViewMode> {
    return this.dashboardForm.controls.view;
  }

  public get selectedCompareIds(): ReadonlyArray<string> {
    return this.compareSelectionSubject.value;
  }

  public setViewMode(viewMode: SavedMatchesViewMode): void {
    this.viewControl.setValue(viewMode);
  }

  public toggleCompare(carId: string): void {
    const currentSelection = [...this.compareSelectionSubject.value];
    const existingIndex = currentSelection.indexOf(carId);

    if (existingIndex !== -1) {
      currentSelection.splice(existingIndex, 1);
      this.compareSelectionSubject.next(currentSelection);
      return;
    }

    if (currentSelection.length >= 2) {
      currentSelection.shift();
    }

    currentSelection.push(carId);
    this.compareSelectionSubject.next(currentSelection);
  }

  public isSelectedForCompare(carId: string): boolean {
    return this.selectedCompareIds.includes(carId);
  }

  public clearCompareSelection(): void {
    this.compareSelectionSubject.next([]);
  }

  public openComparison(): void {
    const [leftCarId, rightCarId] = this.selectedCompareIds;

    if (!leftCarId || !rightCarId) {
      return;
    }

    void this.router.navigate(['/comparar'], {
      queryParams: {
        leftCarId,
        rightCarId
      }
    });
  }

  public startNewMatch(): void {
    void this.router.navigate(['/novo-match']);
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

  public trackByCarId(_: number, match: SavedMatchViewModel): string {
    return match.car.id;
  }

  private filterMatches(matches: ReadonlyArray<SavedMatchViewModel>, searchTerm: string): ReadonlyArray<SavedMatchViewModel> {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return [...matches];
    }

    return matches.filter((match) => {
      const name = match.car.name.toLowerCase();
      const year = String(match.car.year);
      return name.includes(normalizedTerm) || year.includes(normalizedTerm);
    });
  }

  private sortMatches(matches: ReadonlyArray<SavedMatchViewModel>, sortBy: SavedMatchesSortOption): ReadonlyArray<SavedMatchViewModel> {
    const nextMatches = [...matches];

    nextMatches.sort((left, right) => {
      switch (sortBy) {
        case 'matchPctDesc':
          return right.matchPct - left.matchPct;
        case 'priceDesc':
          return right.car.price - left.car.price;
        case 'savedAtDesc':
        default:
          return new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime();
      }
    });

    return nextMatches;
  }
}
