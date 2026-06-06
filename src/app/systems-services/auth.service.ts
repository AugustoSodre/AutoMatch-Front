import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserData {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  surname: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName: string;
  surname: string;
  email: string;
  password?: string;
}

export interface UpdateAvatarData {
  avatarUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'automatch_token';
  private readonly userKey = 'automatch_user';

  constructor(private readonly http: HttpClient) {}

  public login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  public register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  public updateProfile(data: UpdateProfileData): Observable<{ user: UserData }> {
    return this.http.put<{ user: UserData }>(`${this.apiUrl}/me`, data).pipe(
      tap((res) => this.setUser(res.user))
    );
  }

  public updateAvatar(data: UpdateAvatarData): Observable<{ user: UserData }> {
    return this.http.put<{ user: UserData }>(`${this.apiUrl}/me/avatar`, data).pipe(
      tap((res) => this.setUser(res.user))
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getUser(): UserData | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return this.normalizeUser(JSON.parse(raw) as Partial<UserData> & { fullName?: string });
    } catch {
      return null;
    }
  }

  public getDisplayName(user: UserData | null = this.getUser()): string {
    if (!user) {
      return 'Usuário';
    }

    const displayName = [user.firstName, user.surname]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    return displayName || 'Usuário';
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  public isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    this.setUser(res.user);
  }

  private setUser(user: UserData | (Partial<UserData> & { fullName?: string })): void {
    localStorage.setItem(this.userKey, JSON.stringify(this.normalizeUser(user)));
  }

  private normalizeUser(user: Partial<UserData> & { fullName?: string }): UserData {
    const fullName = user.fullName?.trim() ?? '';
    const parts = fullName.split(/\s+/).filter(Boolean);

    return {
      id: String(user.id ?? ''),
      firstName: String(user.firstName ?? parts[0] ?? '').trim(),
      surname: String(user.surname ?? parts.slice(1).join(' ') ?? '').trim(),
      email: String(user.email ?? ''),
      role: String(user.role ?? 'USER'),
      avatarUrl: String(user.avatarUrl ?? '')
    };
  }
}
