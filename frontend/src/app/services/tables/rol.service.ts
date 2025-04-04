import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IRol } from '../../models/rol.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = `${environment.apiUrl}/api/roles`;

  

  constructor(private http: HttpClient) { }

  getAll(): Observable<IRol[]> {
    return this.http.get<IRol[]>(this.apiUrl);
  }
  getById(id: number): Observable<IRol> {
    return this.http.get<IRol>(`${this.apiUrl}/${id}`);
  }

  create(rolData: Omit<IRol, 'id_rol'>): Observable<IRol> {  // Cambiamos el tipo de retorno
    return this.http.post<IRol>(this.apiUrl, rolData);
  }

  update(id: number, rolData: Partial<IRol>): Observable<IRol> {  // Cambiamos el tipo de retorno
    return this.http.put<IRol>(`${this.apiUrl}/${id}`, rolData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
