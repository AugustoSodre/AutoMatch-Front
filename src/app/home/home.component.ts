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
    const categoryImages = this.mockImageService.getCategoryImages();

    this.categoryCards = [
      { title: 'Hatch', imageUrl: categoryImages.hatch },
      { title: 'Sedan', imageUrl: categoryImages.sedan },
      { title: 'SUV', imageUrl: categoryImages.suv },
      { title: 'Picape', imageUrl: categoryImages.picape },
      { title: 'Elétrico', imageUrl: categoryImages.eletrico },
      { title: 'Premium', imageUrl: categoryImages.premium }
    ];
  }

  ngOnInit(): void {
    // placeholder for future initialization
  }

}
