import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ITipoArticulo } from '../../models/tipo_articulo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoArticuloService {

  private apiUrl = `${environment.apiUrl}/api/tipos_articulos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ITipoArticulo[]> {
    return this.http.get<ITipoArticulo[]>(this.apiUrl);
  }
  getById(id: number): Observable<ITipoArticulo> {
    return this.http.get<ITipoArticulo>(`${this.apiUrl}/${id}`);
  }

  create(tipoArticuloData: Omit<ITipoArticulo, 'id_tipo'>): Observable<ITipoArticulo> {  // Cambiamos el tipo de retorno
    return this.http.post<ITipoArticulo>(this.apiUrl, tipoArticuloData);
  }

  update(id: number, tipoArticuloData: Partial<ITipoArticulo>): Observable<ITipoArticulo> {  // Cambiamos el tipo de retorno
    return this.http.put<ITipoArticulo>(`${this.apiUrl}/${id}`, tipoArticuloData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
