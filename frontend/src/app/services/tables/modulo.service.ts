import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IModulo, IModuloView } from '../../models/modulo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private apiUrl = `${environment.apiUrl}/api/modulos`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IModuloView[]> {
    return this.http.get<IModuloView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IModuloView> {
    return this.http.get<IModuloView>(`${this.apiUrl}/${id}`);
  }

  create(moduloData: Omit<IModulo, 'id_modulo'>): Observable<IModulo> {  
    return this.http.post<IModulo>(this.apiUrl, moduloData);
  }

  update(id: number, moduloData: Partial<IModulo>): Observable<IModulo> {  
    return this.http.put<IModulo>(`${this.apiUrl}/${id}`, moduloData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
