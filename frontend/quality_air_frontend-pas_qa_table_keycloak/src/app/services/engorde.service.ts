import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Engorde } from '../models/engorde';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/engorde'

  constructor(private http: HttpClient) {  }
  
  getUsers(): Observable<Engorde[]> {
    return this.http.get<Engorde[]>(this.apiUrl);
  }

  addUser(engorde: Engorde): Observable<Engorde> {
    return this.http.post<Engorde>(this.apiUrl, engorde);
  }

  updateUser(engorde: Engorde): Observable<Engorde> {
    return this.http.put<Engorde>(`${this.apiUrl}/${engorde.id}`, engorde);
  }

  deleteCerda(engorde: Engorde): Observable<Engorde> {
    return this.http.delete<Engorde>(`${this.apiUrl}/${engorde.id}`);
  }

  
}
