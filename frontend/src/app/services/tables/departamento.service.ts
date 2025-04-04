import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDepartamento, IDepartamentoView } from '../../models/departamento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private apiUrl = `${environment.apiUrl}/api/departamentos`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IDepartamentoView[]> {
    return this.http.get<IDepartamentoView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IDepartamentoView> {
    return this.http.get<IDepartamentoView>(`${this.apiUrl}/${id}`);
  }

  create(departamentoData: Omit<IDepartamento, 'id_departamento'>): Observable<IDepartamento> {  
    return this.http.post<IDepartamento>(this.apiUrl, departamentoData);
  }

  update(id: number, departamentoData: Partial<IDepartamento>): Observable<IDepartamento> {  
    return this.http.put<IDepartamento>(`${this.apiUrl}/${id}`, departamentoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
