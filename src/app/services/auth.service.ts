import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { Observable, of, from } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { BASE_URL } from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = BASE_URL;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  login(email: string, password: string): Observable<any> {
    return from(
      axios.post(`${this.apiUrl}/login`, { Email: email, password: password })
    ).pipe(
      map(response => response.data),
      tap((response: any) => {
        const token = response.token;
        if (token) {
          this.tokenService.setToken(token);
          this.router.navigate(['/user-history']);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la connexion:', error);
        return of(null);
      })
    );
  }

  register(firstName: string, name: string, email: string, password: string, Rle: string = 'U'): Observable<any> {
    return from(
      axios.post(`${this.apiUrl}/register`, { 
        firstName, 
        name, 
        email, 
        password,
        Rle
      })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de l\'inscription:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/home']);
  }

  getUserProfile(): Observable<any | null> {
    const token = this.tokenService.getToken();
    if (!token) return of(null);

    return from(
      axios.get(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }
}
