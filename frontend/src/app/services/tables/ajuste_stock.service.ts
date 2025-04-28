import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAjusteStock, IAjusteStockView } from '../../models/ajuste_stock.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjusteStockService {

  private apiUrl = `${environment.apiUrl}/api/ajustes_stocks`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IAjusteStockView[]> {
    return this.http.get<IAjusteStockView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IAjusteStock> {
    return this.http.get<IAjusteStock>(`${this.apiUrl}/${id}`);
  }

  create(ajusteStockData: Omit<IAjusteStock, 'id_ajuste'>): Observable<IAjusteStock> {  
    return this.http.post<IAjusteStock>(this.apiUrl, ajusteStockData);
  }

  update(id: number, ajusteStockData: Partial<IAjusteStock>): Observable<IAjusteStock> {  
    return this.http.put<IAjusteStock>(`${this.apiUrl}/${id}`, ajusteStockData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
