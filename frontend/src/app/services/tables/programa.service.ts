import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPrograma, IProgramaView } from '../../models/programa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  private apiUrl = `${environment.apiUrl}/api/programas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IProgramaView[]> {
    return this.http.get<IProgramaView[]>(this.apiUrl);
  }

  getById(id: number): Observable<IPrograma> {
    return this.http.get<IPrograma>(`${this.apiUrl}/${id}`);
  }

  create(programaData: Omit<IPrograma, 'id_programa'>): Observable<IPrograma> {  
    return this.http.post<IPrograma>(this.apiUrl, programaData);
  }

  update(id: number, programaData: Partial<IPrograma>): Observable<IPrograma> {  
    return this.http.put<IPrograma>(`${this.apiUrl}/${id}`, programaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
