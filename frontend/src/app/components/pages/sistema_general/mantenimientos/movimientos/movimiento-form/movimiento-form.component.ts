import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovimientoService } from '../../../../../../services/tables/movimiento.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IMovimiento } from '../../../../../../models/movimiento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimiento-form',
  standalone: true, // Asegúrate que sea standalone si no está en un módulo
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css'] // Corregido a styleUrls
})
export class MovimientoFormComponent implements OnInit {

  movimientoForm: FormGroup;
  isEditMode = false;
  movimientoId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Movimiento';
  tiposMovimiento = [ // Opciones para el select
    { value: 'E', label: 'Emitido' },
    { value: 'R', label: 'Recibido' },
    { value: 'O', label: 'Otro' }
  ];
  afectaStockOptions = [ // Opciones para el select
    { value: '+', label: 'Suma (+)' },
    { value: '-', label: 'Resta (-)' }
  ];

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.movimientoForm = this.fb.group({
      // id_movimiento no se incluye en el form, se maneja por separado
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(15)]],
      observacion: ['', [Validators.maxLength(250)]],
      afecta_stock: ['+', Validators.required], // Valor por defecto '+'
      tipo_movimiento: ['E', Validators.required], // Valor por defecto 'E'
      estado: [true] // Valor por defecto true (activo)
    });
  }

  ngOnInit(): void {
    this.movimientoId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.movimientoId) {
      this.isEditMode = true;
      this.formTitle = 'Editar Movimiento';
      this.loadMovimiento(this.movimientoId);
    }
  }

  loadMovimiento(id: number): void {
    this.isLoading = true;
    this.movimientoService.getById(id).subscribe({
      next: (movimiento) => {
        this.movimientoForm.patchValue(movimiento);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el movimiento:', error);
        this.isLoading = false;
        // Usar el nuevo método showError
        this.showError('No se pudo cargar el movimiento para editar.');
        this.router.navigate(['/sistema_general/mantenimientos/movimientos']); // Redirigir si hay error
      }
    });
  }

  onSubmit(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched(); // Marcar campos si el form es inválido
      // Opcional: Mostrar alerta de formulario inválido
      // this.showError('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.isLoading = true;
    const movimientoData = this.movimientoForm.value as IMovimiento;

    const operation = this.isEditMode && this.movimientoId
      ? this.movimientoService.update(this.movimientoId, movimientoData)
      : this.movimientoService.create(movimientoData); // Asegúrate que create no necesite id

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        // Usar el nuevo método showSuccess
        const message = `El movimiento ha sido ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.`;
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al guardar el movimiento:', error);
        // Usar el nuevo método showError
        const message = `Ocurrió un error al ${this.isEditMode ? 'actualizar' : 'crear'} el movimiento.`;
        this.showError(message + ': ' + (error.error?.message || error.message || 'Error desconocido'));
      }
    });
  }

  // Método para obtener fácilmente los controles del formulario en la plantilla
  get f() { return this.movimientoForm.controls; }

  // --- Métodos auxiliares para SweetAlert ---

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6', // Puedes ajustar el color si prefieres otro
      timer: 2000, // Cierra automáticamente después de 2 segundos
      timerProgressBar: true
    }).then(() => {
      this.router.navigate(['/sistema_general/mantenimientos/movimientos']); // Navegar a la lista después de cerrar
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33' // Puedes ajustar el color si prefieres otro
    });
    // No redirigir automáticamente en caso de error, permitir al usuario ver el mensaje
  }
}
