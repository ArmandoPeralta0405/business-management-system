import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMoneda, IMonedaView } from '../../models/moneda.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private apiUrl = `${environment.apiUrl}/api/monedas`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IMonedaView[]> {
    return this.http.get<IMonedaView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IMonedaView> {
    return this.http.get<IMonedaView>(`${this.apiUrl}/${id}`);
  }

  create(monedaData: Omit<IMoneda, 'id_moneda'>): Observable<IMoneda> {  
    return this.http.post<IMoneda>(this.apiUrl, monedaData);
  }

  update(id: number, monedaData: Partial<IMoneda>): Observable<IMoneda> {  
    return this.http.put<IMoneda>(`${this.apiUrl}/${id}`, monedaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
