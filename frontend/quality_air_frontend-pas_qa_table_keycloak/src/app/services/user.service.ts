import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cerda } from '../models/cerda';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/cerdas'

  constructor(private http: HttpClient) {  }
  
  getUsers(): Observable<Cerda[]> {
    return this.http.get<Cerda[]>(this.apiUrl);
  }

  addUser(cerda: Cerda): Observable<Cerda> {
    return this.http.post<Cerda>(this.apiUrl, cerda);
  }

  updateUser(cerda: Cerda): Observable<Cerda> {
    return this.http.put<Cerda>(`${this.apiUrl}/${cerda.id}`, cerda);
  }

  deleteCerda(cerda: Cerda): Observable<Cerda> {
    return this.http.delete<Cerda>(`${this.apiUrl}/${cerda.id}`);
  }

  
}
