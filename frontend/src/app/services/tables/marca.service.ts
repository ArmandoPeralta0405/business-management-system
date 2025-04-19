import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMarca } from '../../models/marca.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = `${environment.apiUrl}/api/marcas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IMarca[]> {
    return this.http.get<IMarca[]>(this.apiUrl);
  }
  getById(id: number): Observable<IMarca> {
    return this.http.get<IMarca>(`${this.apiUrl}/${id}`);
  }

  create(impuestoData: Omit<IMarca, 'id_marca'>): Observable<IMarca> {  // Cambiamos el tipo de retorno
    return this.http.post<IMarca>(this.apiUrl, impuestoData);
  }

  update(id: number, impuestoData: Partial<IMarca>): Observable<IMarca> {  // Cambiamos el tipo de retorno
    return this.http.put<IMarca>(`${this.apiUrl}/${id}`, impuestoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
