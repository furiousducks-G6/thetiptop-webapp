import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = 'http://51.68.174.140:8000/api/lots';

  constructor(private http: HttpClient) {}

  getLots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLotById(lotId: string): Observable<any> {
    // Vérifier si lotId est déjà une URL complète
    const lotUrl = lotId.startsWith('http') ? lotId : `${this.apiUrl}/${lotId}`;
    return this.http.get<any>(lotUrl);
  }
}
