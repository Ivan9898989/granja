import { Injectable } from '@angular/core';
import { HistorialCerdas } from '../models/historial-cerdas';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CerdasService {
  private apiUrl = 'http://localhost:3000/cerdas/historial'

  constructor(private http: HttpClient) {  }
  
  getUsers(): Observable<HistorialCerdas[]> {
    return this.http.get<HistorialCerdas[]>(this.apiUrl);
  }

  moverLechonAlHistorial(id: number): Observable<any> {
    return this.http.post(`http://localhost:3000/cerdas/mover-historial/${id}`, {});
  }
}