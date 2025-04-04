import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // Usa template literals para evitar errores de concatenación

  constructor(private http: HttpClient) {}

  login(email: string, clave: string): Observable<any> {
    const url = `${this.apiUrl}/loginEmail`;
    //console.log('URL de login:', url);
    
    // Mostrar alerta con la URL completa
    //alert(`Intentando conectar a:\n${url}\n\nVerifica que esta URL sea accesible desde tu móvil`);
    
    return this.http.post(url, { email, clave }).pipe(
      catchError(error => {
        console.error('Error en AuthService:', error);
        //alert(`Error de conexión:\n${this.getNetworkErrorDetails(error)}`);
        return throwError(() => error);
      })
    );
  }

  private getNetworkErrorDetails(error: any): string {
    if (error.status === 0) {
      return `No se pudo conectar al servidor. Posibles causas:
        - El servidor no está corriendo
        - La IP/URL es incorrecta
        - Problemas de red/CORS
        - Firewall bloqueando la conexión
        
        ${this.apiUrl}/loginEmail`;
    }
    return `Error ${error.status}: ${error.message}`;
  }
}