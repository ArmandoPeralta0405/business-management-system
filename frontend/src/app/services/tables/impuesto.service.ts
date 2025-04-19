import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IImpuesto } from '../../models/impuesto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {

  private apiUrl = `${environment.apiUrl}/api/impuestos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IImpuesto[]> {
    return this.http.get<IImpuesto[]>(this.apiUrl);
  }
  getById(id: number): Observable<IImpuesto> {
    return this.http.get<IImpuesto>(`${this.apiUrl}/${id}`);
  }

  create(impuestoData: Omit<IImpuesto, 'id_impuesto'>): Observable<IImpuesto> {  // Cambiamos el tipo de retorno
    return this.http.post<IImpuesto>(this.apiUrl, impuestoData);
  }

  update(id: number, impuestoData: Partial<IImpuesto>): Observable<IImpuesto> {  // Cambiamos el tipo de retorno
    return this.http.put<IImpuesto>(`${this.apiUrl}/${id}`, impuestoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
