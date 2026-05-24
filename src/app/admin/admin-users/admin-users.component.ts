import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../systems-services/auth.service';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  public users: User[] = [];
  public loading = true;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<User[]>(`${environment.apiUrl}/admin/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  public isSelf(userId: string): boolean {
    return this.authService.getUser()?.id === userId;
  }

  public toggleRole(user: User): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'Tornar administrador' : 'Remover administrador';
    const msg = `${action} ${user.fullName}?`;

    if (!confirm(msg)) return;

    this.http.put<User>(`${environment.apiUrl}/admin/users/${user.id}/role`, { role: newRole }).subscribe({
      next: (updated) => {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao alterar role');
      }
    });
  }

  public trackByUserId(_: number, user: User): string {
    return user.id;
  }

  public formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(value));
  }
}
