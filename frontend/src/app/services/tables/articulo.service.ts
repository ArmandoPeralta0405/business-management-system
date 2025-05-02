import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IArticulo, IArticuloView } from '../../models/articulo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiUrl = `${environment.apiUrl}/api/articulos`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<IArticuloView[]> {
    return this.http.get<IArticuloView[]>(this.apiUrl);
  }
  getById(id: number): Observable<IArticuloView> {
    return this.http.get<IArticuloView>(`${this.apiUrl}/${id}`);
  }

  create(articuloData: Omit<IArticulo, 'id'>): Observable<IArticulo> {  
    return this.http.post<IArticulo>(this.apiUrl, articuloData);
  }

  update(id: number, articuloData: Partial<IArticulo>): Observable<IArticulo> {  
    return this.http.put<IArticulo>(`${this.apiUrl}/${id}`, articuloData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getArticulosActivos(): Observable<IArticuloView[]> {
    return this.http.get<IArticuloView[]>(`${this.apiUrl}/activos`);
  }
}
