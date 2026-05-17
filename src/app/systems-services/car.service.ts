import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Car } from '../car.interface';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly cars: Car[] = [
    {
      id: 'kwid-iconic-2026',
      name: 'Kwid Iconic 1.0',
      year: 2026,
      price: 85190,
      category: 'Popular',
      specs: {
        engine: '1.0 SCe flex',
        power: '71 cv',
        consumption: '14,9 km/l',
        weight: '1.011 kg'
      },
      costs: {
        ipva: 2300,
        insurance: 3200,
        maintenance: 1800
      },
      features: ['Freios ABS', 'Airbags frontais', 'Câmera traseira', 'Ar-condicionado'],
      images: {
        main: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=60',
        thumbnails: [
          'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=60'
        ]
      }
    },
    {
      id: 'opala-ss-1980',
      name: 'Opala SS',
      year: 1980,
      price: 128900,
      category: 'Clássico',
      specs: {
        engine: '4.1 seis cilindros',
        power: '171 cv',
        consumption: '7,5 km/l',
        weight: '1.420 kg'
      },
      costs: {
        ipva: 4100,
        insurance: 5400,
        maintenance: 2600
      },
      features: ['Banco em couro', 'Rodas esportivas', 'Direção assistida', 'Sistema de som'],
      images: {
        main: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=60',
        thumbnails: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1511396712965-0b0e9f3f0b2a?auto=format&fit=crop&w=600&q=60'
        ]
      }
    },
    {
      id: 'dart-swinger-1974',
      name: 'Dart Swinger',
      year: 1974,
      price: 175000,
      category: 'Luxo clássico',
      specs: {
        engine: '5.2 V8',
        power: '230 cv',
        consumption: '6,0 km/l',
        weight: '1.560 kg'
      },
      costs: {
        ipva: 5600,
        insurance: 7200,
        maintenance: 3400
      },
      features: ['Ar-condicionado', 'Freios a disco', 'Acabamento premium', 'Painel original'],
      images: {
        main: 'https://images.unsplash.com/photo-1542365887-4a0d1c7e20f9?auto=format&fit=crop&w=1600&q=60',
        thumbnails: [
          'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=600&q=60'
        ]
      }
    }
  ];

  public getCars(): Observable<Car[]> {
    return of(this.cars);
  }

  public getCarById(id: string): Observable<Car | undefined> {
    return of(this.cars.find((car: Car) => car.id === id));
  }
}
