import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ITipoBarra } from '../../models/tipo_barra.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoBarraService {

  private apiUrl = `${environment.apiUrl}/api/tipos_barras`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ITipoBarra[]> {
    return this.http.get<ITipoBarra[]>(this.apiUrl);
  }
  getById(id: number): Observable<ITipoBarra> {
    return this.http.get<ITipoBarra>(`${this.apiUrl}/${id}`);
  }

  create(tipoBarraData: Omit<ITipoBarra, 'id_tipo'>): Observable<ITipoBarra> {  // Updated the type and variable name
    return this.http.post<ITipoBarra>(this.apiUrl, tipoBarraData);
  }

  update(id: number, tipoBarraData: Partial<ITipoBarra>): Observable<ITipoBarra> {  // Updated the type
    return this.http.put<ITipoBarra>(`${this.apiUrl}/${id}`, tipoBarraData);  // Updated the type
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
