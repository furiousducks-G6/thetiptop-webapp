import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://51.68.174.140:8000/api/tickets';

  constructor(private http: HttpClient, private authService: AuthService) {}  // Injection d'AuthService

  getTickets(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`  // Utilisation du token
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
