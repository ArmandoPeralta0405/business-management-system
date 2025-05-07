import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Método para generar y descargar el informe PDF
  generarInformePDF(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    
    return this.http.get(`${this.apiUrl}/informe-pdf`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  // Método para generar y guardar el informe en el servidor
  guardarInformePDF(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/guardar-informe-pdf`);
  }
}
