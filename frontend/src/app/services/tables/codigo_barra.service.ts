import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICodigoBarra, ICodigoBarraView } from '../../models/codigo_barra.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigoBarraService {

  private apiUrl = `${environment.apiUrl}/api/codigos_barras`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<ICodigoBarraView[]> {
    return this.http.get<ICodigoBarraView[]>(this.apiUrl);
  }

  getById(id_codigo: number, id_articulo: number): Observable<ICodigoBarra> {
    return this.http.get<ICodigoBarra>(`${this.apiUrl}/${id_codigo}/${id_articulo}`);
  }

  create(codigoBarraData: Omit<ICodigoBarra, 'id_codigo'>): Observable<ICodigoBarra> {  
    return this.http.post<ICodigoBarra>(this.apiUrl, codigoBarraData);
  }

  update(id_codigo: number, id_articulo: number, codigoBarraData: Partial<ICodigoBarra>): Observable<ICodigoBarra> {  
    return this.http.put<ICodigoBarra>(`${this.apiUrl}/${id_codigo}/${id_articulo}`, codigoBarraData);
  }

  delete(id_codigo: number, id_articulo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_codigo}/${id_articulo}`);
  }
}
