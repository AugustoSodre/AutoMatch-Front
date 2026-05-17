import { Component } from '@angular/core';

import { MockImageService } from '../systems-services';

interface DetailItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss']
})
export class CarDetailsComponent {
  public readonly title = 'Kwid Iconic 1.0';
  public readonly subtitle = 'A partir de';
  public readonly price = 'R$ 85.190';
  public readonly metadata = 'Nacional, 2026';

  public readonly mainImage = 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=60';

  public readonly thumbnails: ReadonlyArray<{ src: string; alt: string }>;

  public readonly technicalDetails: ReadonlyArray<DetailItem> = [
    { label: 'Motor', value: '1.0 SCe flex' },
    { label: 'Potência', value: '71 cv' },
    { label: 'Consumo', value: '14,9 km/l na estrada' },
    { label: 'Peso / torque', value: '1.011 kg / 10,0 kgfm' }
  ];

  public readonly costDetails: ReadonlyArray<DetailItem> = [
    { label: 'IPVA', value: 'R$ 2.300' },
    { label: 'Seguro', value: 'R$ 3.200' },
    { label: 'Revisões', value: 'R$ 1.800' },
    { label: 'Procedência', value: 'Concessionária autorizada' },
    { label: 'Garantia', value: '3 anos de fábrica' }
  ];

  public readonly equipmentItems: ReadonlyArray<string> = [
    'Freios ABS',
    'Airbags frontais',
    'Câmera traseira',
    'Central multimídia',
    'Ar-condicionado',
    'Direção elétrica',
    'Controle de estabilidade',
    'Sensor de estacionamento'
  ];

  constructor(private readonly mockImageService: MockImageService) {
    this.thumbnails = this.mockImageService.getCarThumbnails().map((src: string, index: number) => ({
      src,
      alt: `Imagem do carro ${index + 1}`
    }));
  }
}
