import { Injectable } from '@angular/core';
import { from, Observable,throwError } from 'rxjs';
import axios from 'axios';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = 'http://51.68.174.140:8000/api/lots';

  getLots(): Observable<any[]> {
    return from(
      axios.get(this.apiUrl).then(response => response.data['hydra:member']) // Extraire le tableau des lots
    );
  }

  getTotalLotsCount(): Observable<number> {
    const request = axios.get(this.apiUrl);

    return from(request).pipe(
      map(response => response.data['hydra:totalItems']),
      catchError(error => {
        console.error('Error fetching total lots count:', error);
        return throwError(() => error);
      })
    );
  }
}
