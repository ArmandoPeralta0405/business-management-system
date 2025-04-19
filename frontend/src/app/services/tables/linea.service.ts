import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ILinea, ILineaView } from '../../models/linea.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineaService {

  private apiUrl = `${environment.apiUrl}/api/lineas`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<ILineaView[]> {
    return this.http.get<ILineaView[]>(this.apiUrl);
  }
  getById(id: number): Observable<ILineaView> {
    return this.http.get<ILineaView>(`${this.apiUrl}/${id}`);
  }

  create(lineaData: Omit<ILinea, 'id_linea'>): Observable<ILinea> {  
    return this.http.post<ILinea>(this.apiUrl, lineaData);
  }

  update(id: number, lineaData: Partial<ILinea>): Observable<ILinea> {  
    return this.http.put<ILinea>(`${this.apiUrl}/${id}`, lineaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
