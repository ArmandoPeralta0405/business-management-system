import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDeposito } from '../../models/deposito.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  private apiUrl = `${environment.apiUrl}/api/depositos`;

  

  constructor(private http: HttpClient) { }

  getAll(): Observable<IDeposito[]> {
    return this.http.get<IDeposito[]>(this.apiUrl);
  }
  getById(id: number): Observable<IDeposito> {
    return this.http.get<IDeposito>(`${this.apiUrl}/${id}`);
  }

  getBySucursal(id_empresa: number, id_sucursal: number): Observable<IDeposito[]> { // Cambiado a Observable<IDeposito[]>
    return this.http.get<IDeposito[]>(`${this.apiUrl}/sucursal/${id_empresa}/${id_sucursal}`);
  }

  create(depositoData: Omit<IDeposito, 'id_deposito'>): Observable<IDeposito> {  
    return this.http.post<IDeposito>(this.apiUrl, depositoData);
  }

  update(id: number, depositoData: Partial<IDeposito>): Observable<IDeposito> {  
    return this.http.put<IDeposito>(`${this.apiUrl}/${id}`, depositoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
