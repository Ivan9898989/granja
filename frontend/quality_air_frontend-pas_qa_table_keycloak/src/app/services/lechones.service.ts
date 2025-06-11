import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lechon } from '../models/lechon';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/lechones'

  constructor(private http: HttpClient) {  }

  moverLechonAlHistorial(id: number): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/lechones/mover-historial/${id}`, {});
  }
  
  getUsers(): Observable<Lechon[]> {
    return this.http.get<Lechon[]>(this.apiUrl);
  }

  addUser(lechon: Lechon): Observable<Lechon> {
    return this.http.post<Lechon>(this.apiUrl, lechon);
  }

  updateUser(lechon: Lechon): Observable<Lechon> {
    return this.http.put<Lechon>(`${this.apiUrl}/${lechon.id}`, lechon);
  }

  deleteCerda(lechon: Lechon): Observable<Lechon> {
    return this.http.delete<Lechon>(`${this.apiUrl}/${lechon.id}`);
  }
}
