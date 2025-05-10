import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAjusteStock, IAjusteStockView } from '../../models/ajuste_stock.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjusteStockService {

  private apiUrl = `${environment.apiUrl}/api/ajustes_stocks`;


  constructor(private http: HttpClient) { }

  // Método privado para obtener los headers con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<IAjusteStockView[]> {
    return this.http.get<IAjusteStockView[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  getById(id: number): Observable<IAjusteStock> {
    return this.http.get<IAjusteStock>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(ajusteStockData: Omit<IAjusteStock, 'id_ajuste'>): Observable<IAjusteStock> {  
    return this.http.post<IAjusteStock>(this.apiUrl, ajusteStockData, { headers: this.getHeaders() });
  }

  update(id: number, ajusteStockData: Partial<IAjusteStock>): Observable<IAjusteStock> {  
    return this.http.put<IAjusteStock>(`${this.apiUrl}/${id}`, ajusteStockData, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Nuevo método para obtener el siguiente número de comprobante
  getNextNumeroComprobante(): Observable<{ numeroComprobante: number }> {
    return this.http.get<{ numeroComprobante: number }>(`${this.apiUrl}/nuevo_comprobante`, { headers: this.getHeaders() });
  }

  // Método para generar informe PDF con filtros
generarInformePDFFiltrado(filtros: any): Observable<Blob> {
  let params = new HttpParams();
  
  // Agregar parámetros de filtro
  if (filtros.fechaInicial) {
    params = params.set('fechaInicial', filtros.fechaInicial);
  }
  
  if (filtros.fechaFinal) {
    params = params.set('fechaFinal', filtros.fechaFinal);
  }
  
  if (filtros.id_movimiento) {
    params = params.set('id_movimiento', filtros.id_movimiento);
  }
  
  return this.http.get(`${this.apiUrl}/informe-pdf-filtrado`, {
    params: params,
    responseType: 'blob'
  });
}

// Método para guardar informe PDF con filtros
guardarInformePDFFiltrado(filtros: any): Observable<any> {
  let params = new HttpParams();
  
  // Agregar parámetros de filtro
  if (filtros.fechaInicial) {
    params = params.set('fechaInicial', filtros.fechaInicial);
  }
  
  if (filtros.fechaFinal) {
    params = params.set('fechaFinal', filtros.fechaFinal);
  }
  
  if (filtros.id_movimiento) {
    params = params.set('id_movimiento', filtros.id_movimiento);
  }
  
  return this.http.get<any>(`${this.apiUrl}/guardar-informe-pdf-filtrado`, {
    params: params
  });
}
}
