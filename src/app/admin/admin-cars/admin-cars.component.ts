import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Car {
  id: string;
  name: string;
  year: number;
  price: number;
  category: string;
  specs: { engine: string; power: string; consumption: string; weight: string };
  costs: { ipva: number; insurance: number; maintenance: number };
  features: string[];
  images: { main: string; thumbnails: string[] };
}

@Component({
  selector: 'app-admin-cars',
  templateUrl: './admin-cars.component.html',
  styleUrls: ['./admin-cars.component.scss']
})
export class AdminCarsComponent implements OnInit {
  public cars: Car[] = [];
  public loading = true;
  public showForm = false;
  public editCarId: string | null = null;
  public form: FormGroup;
  public submitting = false;
  public error = '';

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      year: [2026, [Validators.required, Validators.min(1900)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      engine: ['', Validators.required],
      power: ['', Validators.required],
      consumption: ['', Validators.required],
      weight: ['', Validators.required],
      ipva: [0, [Validators.required, Validators.min(0)]],
      insurance: [0, [Validators.required, Validators.min(0)]],
      maintenance: [0, [Validators.required, Validators.min(0)]],
      features: ['', Validators.required],
      mainImage: ['', Validators.required],
      thumbnails: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCars();
  }

  private loadCars(): void {
    this.http.get<Car[]>(`${environment.apiUrl}/admin/cars`).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  public openNewForm(): void {
    this.editCarId = null;
    this.form.reset({
      year: 2026, price: 0, ipva: 0, insurance: 0, maintenance: 0
    });
    this.form.get('id')?.enable();
    this.error = '';
    this.showForm = true;
  }

  public openEditForm(car: Car): void {
    this.editCarId = car.id;
    this.form.setValue({
      id: car.id,
      name: car.name,
      year: car.year,
      price: car.price,
      category: car.category,
      engine: car.specs.engine,
      power: car.specs.power,
      consumption: car.specs.consumption,
      weight: car.specs.weight,
      ipva: car.costs.ipva,
      insurance: car.costs.insurance,
      maintenance: car.costs.maintenance,
      features: car.features.join('\n'),
      mainImage: car.images.main,
      thumbnails: car.images.thumbnails.join('\n'),
    });
    this.form.get('id')?.disable();
    this.error = '';
    this.showForm = true;
  }

  public cancelForm(): void {
    this.showForm = false;
    this.editCarId = null;
    this.error = '';
  }

  public submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    const raw = this.form.getRawValue();
    const body = {
      id: raw.id,
      name: raw.name,
      year: raw.year,
      price: raw.price,
      category: raw.category,
      specs: {
        engine: raw.engine,
        power: raw.power,
        consumption: raw.consumption,
        weight: raw.weight,
      },
      costs: {
        ipva: raw.ipva,
        insurance: raw.insurance,
        maintenance: raw.maintenance,
      },
      features: raw.features.split('\n').map((s: string) => s.trim()).filter(Boolean),
      images: {
        main: raw.mainImage,
        thumbnails: raw.thumbnails.split('\n').map((s: string) => s.trim()).filter(Boolean),
      },
    };

    const request = this.editCarId
      ? this.http.put<Car>(`${environment.apiUrl}/admin/cars/${this.editCarId}`, body)
      : this.http.post<Car>(`${environment.apiUrl}/admin/cars`, body);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.loadCars();
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.error || 'Erro ao salvar carro';
      }
    });
  }

  public deleteCar(carId: string): void {
    if (!confirm('Tem certeza que deseja excluir este carro?')) return;

    this.http.delete(`${environment.apiUrl}/admin/cars/${carId}`).subscribe({
      next: () => { this.loadCars(); },
      error: (err) => {
        alert(err.error?.error || 'Erro ao excluir carro');
      }
    });
  }

  public trackByCarId(_: number, car: Car): string {
    return car.id;
  }

  public formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }
}
