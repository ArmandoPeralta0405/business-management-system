// src/app/interceptors/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  return next(req);
};