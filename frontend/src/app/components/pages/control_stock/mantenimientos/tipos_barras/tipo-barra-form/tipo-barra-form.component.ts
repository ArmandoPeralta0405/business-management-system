import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { TipoBarraService } from '../../../../../../services/tables/tipo_barra.service';
import { ITipoBarra } from '../../../../../../models/tipo_barra.model';

@Component({
  selector: 'app-tipo-barra-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './tipo-barra-form.component.html',
  styleUrl: './tipo-barra-form.component.css'
})
export class TipoBarraFormComponent implements OnInit {
  tipoBarraForm: FormGroup;
  isEditMode = false;
  tipoBarraId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Tipo de Barra';

  constructor(
    private fb: FormBuilder,
    private tipoBarraService: TipoBarraService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tipoBarraForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tipoBarraId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Tipo de Barra';
        this.loadTipoBarraData(this.tipoBarraId);
      }
    });
  }

  loadTipoBarraData(id: number): void {
    this.isLoading = true;
    this.tipoBarraService.getById(id).subscribe({
      next: (tipoBarra) => {
        this.tipoBarraForm.patchValue({
          descripcion: tipoBarra.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tipoBarra:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el tipo de barra');
        this.router.navigate(['/control_stock/mantenimientos/tipos_barras']);
      }
    });
  }

  onSubmit(): void {
    if (this.tipoBarraForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const tipoBarraData = this.tipoBarraForm.value;

    const operation$ = this.isEditMode && this.tipoBarraId
      ? this.tipoBarraService.update(this.tipoBarraId, tipoBarraData)
      : this.tipoBarraService.create(tipoBarraData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Tipo de barra actualizado correctamente' 
          : 'Tipo de barra creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el tipo de barra'
          : 'Error al crear el tipo de barra';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.tipoBarraForm.controls).forEach(control => {
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
      this.router.navigate(['/control_stock/mantenimientos/tipos_barras']);
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
