import { Component } from '@angular/core';
import { AuthService } from '../../../services/api/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = 'admin@gmail.com';
  clave: string = 'admin';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    
    Swal.fire({
      title: 'Verificando conexión',
      text: 'Por favor espera mientras intentamos conectarnos al servidor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.login(this.email, this.clave).subscribe({
      next: (response) => {
        Swal.close();
        localStorage.setItem('token', response.token);
        this.showSuccess();
      },
      error: (error) => {
        this.loading = false;
        Swal.close();
        
        // Extraer el mensaje específico del error de la API
        const errorMessage = error.error?.error || 
                            error.error?.message || 
                            'Error desconocido al intentar iniciar sesión';
        
        this.showConnectionError(errorMessage);
      }
    });
}

  private showSuccess(): void {
    Swal.fire({
      title: '¡Éxito!',
      text: 'Inicio de sesión correcto',
      icon: 'success',
      confirmButtonColor: '#7D161A',
      timer: 2000,
      timerProgressBar: true
    }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  showConnectionError(message: string): void {
    Swal.fire({
        title: 'Error de autenticación',
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#7D161A'
    });
}

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Credenciales incorrectas. Verifica tu email y contraseña.';
    }
    return `Error ${error.status}: ${error.message}`;
  }
}