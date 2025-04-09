import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IEmpresa, IEmpresaView } from '../../models/empresa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = `${environment.apiUrl}/api/empresas`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IEmpresaView[]> {
    return this.http.get<IEmpresaView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IEmpresaView> {
    return this.http.get<IEmpresaView>(`${this.apiUrl}/${id}`);
  }

  create(empresaData: Omit<IEmpresa, 'id_empresa'>): Observable<IEmpresa> {  
    return this.http.post<IEmpresa>(this.apiUrl, empresaData);
  }

  update(id: number, empresaData: Partial<IEmpresa>): Observable<IEmpresa> {  
    return this.http.put<IEmpresa>(`${this.apiUrl}/${id}`, empresaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
