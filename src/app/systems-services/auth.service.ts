import { Injectable, NgZone } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSupabaseClient } from '../supabase/supabase.client';
import { mapProfileToUserData } from '../supabase/mappers';
import { ProfileRow } from '../supabase/types';

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
  private readonly tokenKey = 'automatch_token';
  private readonly userKey = 'automatch_user';
  private currentUserSubject = new BehaviorSubject<UserData | null>(this.loadUser());
  private currentTokenSubject = new BehaviorSubject<string | null>(this.loadToken());

  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly currentToken$ = this.currentTokenSubject.asObservable();

  constructor(private readonly ngZone: NgZone) {
    const supabase = getSupabaseClient();
    supabase.auth.onAuthStateChange((_event, session) => {
      this.ngZone.run(() => {
        if (session) {
          localStorage.setItem(this.tokenKey, session.access_token);
          this.currentTokenSubject.next(session.access_token);
          this.fetchAndCacheProfile(session.user.id, session.user.email || '');
        } else {
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(this.userKey);
          this.currentTokenSubject.next(null);
          this.currentUserSubject.next(null);
        }
      });
    });

    if (this.currentTokenSubject.value) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          this.fetchAndCacheProfile(session.user.id, session.user.email || '');
        }
      });
    }
  }

  public login(data: LoginData): Observable<AuthResponse> {
    const supabase = getSupabaseClient();
    return from(
      supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    ).pipe(
      map(({ data: authData, error }) => {
        if (error || !authData.session) {
          throw { status: 401, error: { error: 'Email ou senha inválidos' } };
        }
        const session = authData.session;
        const userData = this.buildUserData(session.user);
        this.setSession({ token: session.access_token, user: userData });
        return { token: session.access_token, user: userData };
      })
    );
  }

  public register(data: RegisterData): Observable<AuthResponse> {
    const supabase = getSupabaseClient();
    return from(
      supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            surname: data.surname,
          },
        },
      })
    ).pipe(
      map(({ data: authData, error }) => {
        if (error) {
          if (error.message.includes('already')) {
            throw { status: 409, error: { error: 'Email já cadastrado' } };
          }
          throw { status: 400, error: { error: error.message } };
        }
        if (!authData.session || !authData.user) {
          throw { status: 500, error: { error: 'Erro ao criar conta' } };
        }
        const userData = this.buildUserData(authData.user);
        this.setSession({ token: authData.session.access_token, user: userData });
        return { token: authData.session.access_token, user: userData };
      })
    );
  }

  public updateProfile(data: UpdateProfileData): Observable<{ user: UserData }> {
    const supabase = getSupabaseClient();
    return from(
      (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw { status: 401, error: { error: 'Não autenticado' } };

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ first_name: data.firstName, surname: data.surname })
          .eq('id', session.user.id);

        if (profileError) throw { status: 500, error: { error: 'Erro ao atualizar perfil' } };

        if (data.email && data.email !== session.user.email) {
          await supabase.auth.updateUser({ email: data.email });
        }

        if (data.password) {
          await supabase.auth.updateUser({ password: data.password });
        }

        const userData = await this.fetchProfile(session.user.id, data.email || session.user.email || '');
        this.setUser(userData);
        return { user: userData };
      })()
    );
  }

  public updateAvatar(data: UpdateAvatarData): Observable<{ user: UserData }> {
    const supabase = getSupabaseClient();
    return from(
      (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw { status: 401, error: { error: 'Não autenticado' } };

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: data.avatarUrl })
          .eq('id', session.user.id);

        if (profileError) throw { status: 500, error: { error: 'Erro ao atualizar avatar' } };

        const userData = await this.fetchProfile(session.user.id, session.user.email || '');
        this.setUser(userData);
        return { user: userData };
      })()
    );
  }

  public getToken(): string | null {
    return this.currentTokenSubject.value;
  }

  public getUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  public getDisplayName(user: UserData | null = this.getUser()): string {
    if (!user) return 'Usuário';
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

  public async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    this.currentTokenSubject.next(res.token);
    this.setUser(res.user);
  }

  private setUser(user: UserData): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadUser(): UserData | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  }

  private buildUserData(user: { id: string; email?: string; user_metadata?: { firstName?: string; surname?: string } }): UserData {
    return {
      id: user.id,
      firstName: user.user_metadata?.firstName || '',
      surname: user.user_metadata?.surname || '',
      email: user.email || '',
      role: 'USER',
      avatarUrl: '',
    };
  }

  private async fetchProfile(userId: string, email: string): Promise<UserData> {
    const supabase = getSupabaseClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      return mapProfileToUserData(profile as unknown as ProfileRow);
    }
    return this.buildUserData({ id: userId, email });
  }

  private async fetchAndCacheProfile(userId: string, email: string): Promise<void> {
    try {
      const userData = await this.fetchProfile(userId, email);
      this.setUser(userData);
    } catch (err) {
      console.error('[AuthService] Error fetching profile:', err);
    }
  }
}
