import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProveedor, IProveedorView } from '../../models/proveedor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = `${environment.apiUrl}/api/proveedores`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IProveedorView[]> {
    return this.http.get<IProveedorView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IProveedorView> {
    return this.http.get<IProveedorView>(`${this.apiUrl}/${id}`);
  }

  create(proveedorData: Omit<IProveedor, 'id_proveedor'>): Observable<IProveedor> {  
    return this.http.post<IProveedor>(this.apiUrl, proveedorData);
  }

  update(id: number, proveedorData: Partial<IProveedor>): Observable<IProveedor> {  
    return this.http.put<IProveedor>(`${this.apiUrl}/${id}`, proveedorData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
