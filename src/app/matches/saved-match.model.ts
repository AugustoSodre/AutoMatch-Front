import { Car } from '../car.interface';

export type SavedMatchesSortOption = 'savedAtDesc' | 'matchPctDesc' | 'priceDesc';

export type SavedMatchesViewMode = 'grid' | 'list';

export interface SavedMatchRecord {
  carId: string;
  matchPct: number;
  savedAt: string;
}

export interface SavedMatchViewModel extends SavedMatchRecord {
  car: Car;
}
