import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUnidadMedida } from '../../models/unidad_medida.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  private apiUrl = `${environment.apiUrl}/api/unidades_medidas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IUnidadMedida[]> {
    return this.http.get<IUnidadMedida[]>(this.apiUrl);
  }
  getById(id: number): Observable<IUnidadMedida> {
    return this.http.get<IUnidadMedida>(`${this.apiUrl}/${id}`);
  }

  create(unidadMedidaData: Omit<IUnidadMedida, 'id_unidad'>): Observable<IUnidadMedida> {  // Cambiamos el tipo de retorno
    return this.http.post<IUnidadMedida>(this.apiUrl, unidadMedidaData);
  }

  update(id: number, unidadMedidaData: Partial<IUnidadMedida>): Observable<IUnidadMedida> {  // Cambiamos el tipo de retorno
    return this.http.put<IUnidadMedida>(`${this.apiUrl}/${id}`, unidadMedidaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
