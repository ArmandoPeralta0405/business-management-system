import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
// Importa el modelo correcto de Movimiento
import { IMovimiento } from '../../models/movimiento.model'; // Asegúrate que la ruta sea correcta
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// Cambia el nombre de la clase
export class MovimientoService {

  // Actualiza la URL de la API para apuntar a 'movimientos'
  private apiUrl = `${environment.apiUrl}/api/movimientos`;


  constructor(private http: HttpClient) { }

  // Actualiza los tipos de retorno y parámetros para usar IMovimiento
  getAll(): Observable<IMovimiento[]> { // Asumiendo que devuelve un array de IMovimiento
    return this.http.get<IMovimiento[]>(this.apiUrl);
  }

  getById(id: number): Observable<IMovimiento> { // Asumiendo que devuelve un IMovimiento
    return this.http.get<IMovimiento>(`${this.apiUrl}/${id}`);
  }

  create(movimientoData: Omit<IMovimiento, 'id_movimiento'>): Observable<IMovimiento> { // Usa Omit con 'id_movimiento'
    return this.http.post<IMovimiento>(this.apiUrl, movimientoData);
  }

  update(id: number, movimientoData: Partial<IMovimiento>): Observable<IMovimiento> { // Usa Partial<IMovimiento>
    return this.http.put<IMovimiento>(`${this.apiUrl}/${id}`, movimientoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
