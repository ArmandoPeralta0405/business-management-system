import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPais } from '../../models/pais.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private apiUrl = `${environment.apiUrl}/api/paises`;

  

  constructor(private http: HttpClient) { }

  getAll(): Observable<IPais[]> {
    return this.http.get<IPais[]>(this.apiUrl);
  }
  getById(id: number): Observable<IPais> {
    return this.http.get<IPais>(`${this.apiUrl}/${id}`);
  }

  create(paisData: Omit<IPais, 'id_pais'>): Observable<IPais> {  
    return this.http.post<IPais>(this.apiUrl, paisData);
  }

  update(id: number, paisData: Partial<IPais>): Observable<IPais> {  
    return this.http.put<IPais>(`${this.apiUrl}/${id}`, paisData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
