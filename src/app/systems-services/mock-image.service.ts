import { Injectable } from '@angular/core';

export interface CategoryImageMap {
  hatch: string;
  sedan: string;
  suv: string;
  picape: string;
  eletrico: string;
  premium: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockImageService {
  private readonly categoryImages: CategoryImageMap = {
    hatch: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
    sedan: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80',
    suv: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=800&q=80',
    picape: 'https://images.unsplash.com/photo-1544761634-6e4243d1e62b?auto=format&fit=crop&w=800&q=80',
    eletrico: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    premium: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
  };

  public getCategoryImages(): CategoryImageMap {
    return { ...this.categoryImages };
  }

  public getCarThumbnails(): string[] {
    return [
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=60',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=60',
      'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=900&q=60',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=60'
    ];
  }
}
