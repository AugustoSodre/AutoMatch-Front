import { Car } from '../car.interface';
import { UserData } from '../systems-services/auth.service';
import { SavedMatchViewModel } from '../matches/saved-match.model';
import { CarRow, ProfileRow, SavedMatchWithCarRow } from './types';

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

export function mapCarRowToCar(row: CarRow): Car {
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    price: row.price,
    category: row.category,
    specs: {
      engine: row.engine,
      power: row.power,
      consumption: row.consumption,
      weight: row.weight,
    },
    costs: {
      ipva: row.ipva,
      insurance: row.insurance,
      maintenance: row.maintenance,
    },
    features: parseJsonArray(row.features),
    images: {
      main: row.main_image,
      thumbnails: parseJsonArray(row.thumbnail_images),
    },
  };
}

export function mapProfileToUserData(profile: ProfileRow): UserData {
  return {
    id: profile.id,
    firstName: profile.first_name,
    surname: profile.surname,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.avatar_url,
  };
}

export function mapSavedMatchToViewModel(row: SavedMatchWithCarRow): SavedMatchViewModel {
  return {
    id: row.id,
    car: mapCarRowToCar(row.car),
    savedAt: row.saved_at,
    matchPercentage: row.match_percentage,
  };
}
