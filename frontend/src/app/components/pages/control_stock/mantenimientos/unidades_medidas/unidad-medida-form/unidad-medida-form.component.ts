import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { UnidadMedidaService } from '../../../../../../services/tables/unidad_medida.service';
import { IUnidadMedida } from '../../../../../../models/unidad_medida.model';

@Component({
  selector: 'app-unidad-medida-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './unidad-medida-form.component.html',
  styleUrl: './unidad-medida-form.component.css'
})
export class UnidadMedidaFormComponent implements OnInit {
  unidadMedidaForm: FormGroup;
  isEditMode = false;
  unidadMedidaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Unidad de Medida';

  constructor(
    private fb: FormBuilder,
    private unidadMedidaService: UnidadMedidaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.unidadMedidaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.unidadMedidaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Unidad de Medida';
        this.loadUnidadMedidaData(this.unidadMedidaId);
      }
    });
  }

  loadUnidadMedidaData(id: number): void {
    this.isLoading = true;
    this.unidadMedidaService.getById(id).subscribe({
      next: (unidadMedida) => {
        this.unidadMedidaForm.patchValue({
          descripcion: unidadMedida.descripcion,
          abreviacion: unidadMedida.abreviacion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading unidadMedida:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la unidad de medida');
        this.router.navigate(['/control_stock/mantenimientos/unidades_medidas']);
      }
    });
  }

  onSubmit(): void {
    if (this.unidadMedidaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const unidadMedidaData = this.unidadMedidaForm.value;

    const operation$ = this.isEditMode && this.unidadMedidaId
      ? this.unidadMedidaService.update(this.unidadMedidaId, unidadMedidaData)
      : this.unidadMedidaService.create(unidadMedidaData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Unidad de medida actualizada correctamente' 
          : 'Unidad de medida creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la unidad de medida'
          : 'Error al crear la unidad de medida';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.unidadMedidaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#7D161A',
      timer: 2000
    }).then(() => {
      this.router.navigate(['/control_stock/mantenimientos/unidades_medidas']);
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#7D161A'
    });
  }
}
