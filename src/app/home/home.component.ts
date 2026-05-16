import { Component, OnInit } from '@angular/core';

import { MockImageService } from '../mock-image.service';

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
      { title: 'Carros Populares', imageUrl: categoryImages.populares },
      { title: 'Carros de Aventura', imageUrl: categoryImages.aventura },
      { title: 'Carros para Família', imageUrl: categoryImages.familia },
      { title: 'Carros de Luxo', imageUrl: categoryImages.luxo }
    ];
  }

  ngOnInit(): void {
    // placeholder for future initialization
  }

}
