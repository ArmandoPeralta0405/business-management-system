import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICiudad, ICiudadView } from '../../models/ciudad.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private apiUrl = `${environment.apiUrl}/api/ciudades`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<ICiudadView[]> {
    return this.http.get<ICiudadView[]>(this.apiUrl);
  }
  getById(id: number): Observable<ICiudadView> {
    return this.http.get<ICiudadView>(`${this.apiUrl}/${id}`);
  }

  create(ciudadData: Omit<ICiudad, 'id_ciudad'>): Observable<ICiudad> {  
    return this.http.post<ICiudad>(this.apiUrl, ciudadData);
  }

  update(id: number, ciudadData: Partial<ICiudad>): Observable<ICiudad> {  
    return this.http.put<ICiudad>(`${this.apiUrl}/${id}`, ciudadData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
