import { Injectable } from '@angular/core';
import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://51.68.174.140:8000/api/tickets';

  constructor(private authService: AuthService) {}
  getTickets(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
        console.error('Token is missing or invalid');
        return throwError(() => new Error('Token is missing or invalid'));
    }

    const request = axios.get(this.apiUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page: page,
            itemsPerPage: itemsPerPage
        }
    });

    return from(request).pipe(
        map(response => ({
            tickets: response.data['hydra:member'].map((ticket: any) => ({
                code: ticket.code,
                lot: ticket.lot ? {
                    id: ticket.lot.id,
                    name: ticket.lot.name,
                    value: ticket.lot.value,
                    percentage: ticket.lot.Pourcentage
                } : null,
                user: ticket.user ? {
                    firstName: ticket.user.firstName,
                    phone: ticket.user.phone,
                } : null,
                is_claimed: ticket.is_claimed || false
            })),
            totalItems: response.data['hydra:totalItems']
        })),
        catchError(error => {
            console.error('Error fetching tickets:', error);
            return throwError(() => error);
        })
    );
  }
  getTotalTicketsCount(): Observable<number> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }

    const request = axios.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return from(request).pipe(
      map(response => response.data['hydra:totalItems']),
      catchError(error => {
        console.error('Error fetching total tickets count:', error);
        return throwError(() => error);
      })
    );
  }

}
