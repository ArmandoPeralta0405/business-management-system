import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISucursal, ISucursalView } from '../../models/sucursal.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  private apiUrl = `${environment.apiUrl}/api/sucursales`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<ISucursalView[]> {
    return this.http.get<ISucursalView[]>(this.apiUrl);
  }
  getById(id_empresa: number, id_sucursal: number): Observable<ISucursal> {
    return this.http.get<ISucursal>(`${this.apiUrl}/${id_empresa}/${id_sucursal}`);
  }

  create(sucursalData: Omit<ISucursal, 'id_sucursal'>): Observable<ISucursal> {  
    return this.http.post<ISucursal>(this.apiUrl, sucursalData);
  }

  update(id_empresa: number, id_sucursal: number, sucursalData: Partial<ISucursal>): Observable<ISucursal> {  
    return this.http.put<ISucursal>(`${this.apiUrl}/${id_empresa}/${id_sucursal}`, sucursalData);
  }

  delete(id_empresa: number, id_sucursal: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_empresa}/${id_sucursal}`);
  }
}
