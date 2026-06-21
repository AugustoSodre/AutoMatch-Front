import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { getSupabaseClient } from '../supabase/supabase.client';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const supabase = getSupabaseClient();

    return from(supabase.auth.getSession()).pipe(
      switchMap(({ data: { session } }) => {
        if (session?.access_token) {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${session.access_token}` }
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
