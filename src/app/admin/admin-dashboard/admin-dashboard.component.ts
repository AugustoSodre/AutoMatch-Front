import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  totalCars: number;
  totalUsers: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  public stats: DashboardStats = { totalCars: 0, totalUsers: 0 };
  public loading = true;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.http.get<any[]>(`${environment.apiUrl}/admin/cars`).subscribe({
      next: (cars) => {
        this.stats.totalCars = cars.length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.http.get<any[]>(`${environment.apiUrl}/admin/users`).subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
      }
    });
  }
}
