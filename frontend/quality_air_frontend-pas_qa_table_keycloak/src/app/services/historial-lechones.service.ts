import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistorialLechon } from '../models/historial-lechones';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/lechones/historial'

  constructor(private http: HttpClient) {  }
  
  getUsers(): Observable<HistorialLechon[]> {
    return this.http.get<HistorialLechon[]>(this.apiUrl);
  }

  moverLechonAlHistorial(id: number): Observable<any> {
    return this.http.post(`http://localhost:3000/lechones/mover-historial/${id}`, {});
  }
}