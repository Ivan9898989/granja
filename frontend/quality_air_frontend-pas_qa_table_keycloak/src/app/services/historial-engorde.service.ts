import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistorialEngorde } from '../models/historial-engorde';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngordeService {
  private apiUrl = 'http://localhost:3000/engorde/historial'

  constructor(private http: HttpClient) {  }
  
  getUsers(): Observable<HistorialEngorde[]> {
    return this.http.get<HistorialEngorde[]>(this.apiUrl);
  }

  moverLechonAlHistorial(id: number): Observable<any> {
    return this.http.post(`http://localhost:3000/engorde/mover-historial/${id}`, {});
  }
}