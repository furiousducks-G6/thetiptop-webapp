import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // Import de isPlatformBrowser
import { TokenService } from './token.service';  // Import du TokenService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://51.68.174.140:8000/api';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,  // Injection du TokenService
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object // Injection du PLATFORM_ID
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { Email: email, password: password })
      .pipe(
        tap((response: any) => {
          const token = response.token;
          if (token) {
            this.tokenService.setToken(token);
            this.router.navigate(['/user-history']);
          }
        }),
        catchError(error => of(null))
      );
  }

  register(firstName: string, name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { 
      firstName, 
      name, 
      email, 
      password 
    });
  }
  
  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/home']);
  }

  getUserProfile(): Observable<any | null> {
    const token = this.tokenService.getToken();
    if (!token) return of(null);

    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
