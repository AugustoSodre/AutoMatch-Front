import { Component, OnInit } from '@angular/core';

import { MockImageService } from '../systems-services';

interface CategoryCard {
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public readonly currentYear: number = new Date().getFullYear();
  public readonly categoryCards: ReadonlyArray<CategoryCard>;

  constructor(private readonly mockImageService: MockImageService) {
    const categoryImages = this.mockImageService.getCategoryImages() as any;

    this.categoryCards = [
      { title: 'Hatch', imageUrl: categoryImages.hatch || categoryImages.populares || 'assets/hatch.jpg' },
      { title: 'Sedan', imageUrl: categoryImages.sedan || categoryImages.familia || 'assets/sedan.jpg' },
      { title: 'SUV', imageUrl: categoryImages.suv || categoryImages.aventura || 'assets/suv.jpg' },
      { title: 'Picape', imageUrl: categoryImages.picape || categoryImages.aventura || 'assets/picape.jpg' },
      { title: 'Elétrico', imageUrl: categoryImages.eletrico || categoryImages.populares || 'assets/eletrico.jpg' },
      { title: 'Premium', imageUrl: categoryImages.premium || categoryImages.luxo || 'assets/premium.jpg' }
    ];
  }

  ngOnInit(): void {
    // placeholder for future initialization
  }

}
