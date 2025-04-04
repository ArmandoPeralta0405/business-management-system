import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Función para verificar si el token está expirado (para JWT)
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
    const expiration = payload.exp; // Obtiene el timestamp de expiración
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    
    return currentTime > expiration; // True = token expirado
  } catch (error) {
    return true; // Si hay error al decodificar, considera el token como inválido
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // 1. Verifica si no hay token
  if (!token) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  // 2. Verifica si el token está expirado
  if (isTokenExpired(token)) {
    localStorage.removeItem('token'); // Elimina el token expirado
    router.navigate(['/login'], {
      queryParams: { 
        returnUrl: state.url,
        error: 'session_expired' // Opcional: para mostrar mensaje en el login
      }
    });
    return false;
  }

  return true; // Token válido
};

// Guardia para rutas hijas (misma lógica)
export const authGuardChild: CanActivateFn = (route, state) => {
  return authGuard(route, state);
};