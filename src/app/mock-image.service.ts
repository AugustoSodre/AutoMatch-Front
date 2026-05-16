import { Injectable } from '@angular/core';

export interface CategoryImageMap {
  populares: string;
  aventura: string;
  familia: string;
  luxo: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockImageService {
    private readonly categoryImages: CategoryImageMap = {
    populares: 'https://images.unsplash.com/photo-1614152204322-e6ab7f040c1d?auto=format&fit=crop&w=800&q=80', // Mercedes SUV
    aventura: 'https://images.unsplash.com/photo-1490902931801-d6f80ca94fe4?auto=format&fit=crop&w=800&q=80',  // Defender crossing water
    familia: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',  // Safe, spacious SUV
    luxo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'   // Luxury Mercedes
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
