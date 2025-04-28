import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDetalleAjusteStock, IDetalleAjusteStockView } from '../../models/detalle_ajuste_stock.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleAjusteStockService {

  private apiUrl = `${environment.apiUrl}/api/detalles_ajustes_stocks`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IDetalleAjusteStockView[]> {
    return this.http.get<IDetalleAjusteStockView[]>(this.apiUrl);
  }

  getById(id_ajuste: number, id_articulo: number, numero_item: number): Observable<IDetalleAjusteStock> {
    return this.http.get<IDetalleAjusteStock>(`${this.apiUrl}/${id_ajuste}/${id_articulo}/${numero_item}`);
  }

  create(detalle: IDetalleAjusteStock): Observable<{ id_ajuste: number, id_articulo: number, numero_item: number }> {
    return this.http.post<{ id_ajuste: number, id_articulo: number, numero_item: number }>(this.apiUrl, detalle);
  }

  update(id_ajuste: number, id_articulo: number, numero_item: number, detalle: Partial<IDetalleAjusteStock>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_ajuste}/${id_articulo}/${numero_item}`, detalle);
  }

  delete(id_ajuste: number, id_articulo: number, numero_item: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_ajuste}/${id_articulo}/${numero_item}`);
  }
}
