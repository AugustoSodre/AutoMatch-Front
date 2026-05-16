export interface CarSpecs {
  engine: string;
  power: string;
  consumption: string;
  weight: string;
}

export interface CarCosts {
  ipva: number;
  insurance: number;
  maintenance: number;
}

export interface CarImages {
  main: string;
  thumbnails: string[];
}

export interface Car {
  id: string;
  name: string;
  year: number;
  price: number;
  category: string;
  specs: CarSpecs;
  costs: CarCosts;
  features: string[];
  images: CarImages;
}
