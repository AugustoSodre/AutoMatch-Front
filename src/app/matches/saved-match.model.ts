import { Car } from '../car.interface';

export type SavedMatchesSortOption = 'savedAtDesc' | 'matchPctDesc' | 'priceDesc';

export type SavedMatchesViewMode = 'grid' | 'list';

export interface SavedMatchViewModel {
  id: string;
  car: Car;
  savedAt: string;
  matchPercentage: number;
}
