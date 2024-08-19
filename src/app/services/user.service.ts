import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';  // Import throwError here
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://51.68.174.140:8000/api';
  
  // BehaviorSubject to notify components about profile updates
  private userProfileUpdatedSource = new BehaviorSubject<void>(undefined);  // No null, use undefined
  userProfileUpdated$ = this.userProfileUpdatedSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  updateUser(userData: any): Observable<any> {
    const url = `${this.apiUrl}/user/update`;  // No need to add the ID here
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,  // Use the auth token
      'Content-Type': 'application/json'
    });

    return this.http.put(url, userData, { headers }).pipe(
      tap(() => {
        // Notify subscribers that the profile has been updated
        this.userProfileUpdatedSource.next();
      }),
      catchError(error => {
        console.error('Error updating user profile:', error);
        return throwError(() => new Error(error));  // Correct usage of throwError
      })
    );
  }

  // Ajout de la méthode getUsers pour récupérer la liste des utilisateurs
  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/users`;  // Utilise le bon endpoint pour récupérer les utilisateurs
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,  // Utilise le token d'authentification
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error(error));  // Gère les erreurs
      })
    );
  }
}
