import { Injectable } from '@angular/core';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs'; // Assurez-vous que 'BehaviorSubject' est bien importé
import { map, catchError, tap } from 'rxjs/operators';
import axios from 'axios';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BASE_URL } from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = BASE_URL;
  
  // BehaviorSubject to notify components about profile updates
  private userProfileUpdatedSource = new BehaviorSubject<void>(undefined);
  userProfileUpdated$ = this.userProfileUpdatedSource.asObservable();

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Update user profile data
   * @param userData - The data to update the user profile with
   */
  updateUser(userData: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token is missing ou invalid'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return from(
      axios.put(`${this.apiUrl}/user/update`, userData, { headers })
    ).pipe(
      map(response => response.data),
      tap(() => {
        // Notify subscribers that the profile has been updated
        this.userProfileUpdatedSource.next();
      }),
      catchError(error => {
        console.error('Error updating user profile:', error);
        return throwError(() => new Error(error.message || 'Error updating profile'));
      })
    );
  }

  /**
   * Get a list of users from the API
   */
  getUsers(page: number, itemsPerPage: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing or invalid');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token is missing or invalid'));
    }

    return from(
      axios.get(`${this.apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          itemsPerPage: itemsPerPage
        }
      })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        if (error.response && error.response.status === 401) {
          this.router.navigate(['/login']);
        }
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Error fetching users'));
      })
    );
  }

  getTotalUsersCount(): Observable<number> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }

    const request = axios.get(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return from(request).pipe(
      map(response => response.data['hydra:totalItems']),
      catchError(error => {
        console.error('Error fetching total users count:', error);
        return throwError(() => error);
      })
    );
  }

  
}
