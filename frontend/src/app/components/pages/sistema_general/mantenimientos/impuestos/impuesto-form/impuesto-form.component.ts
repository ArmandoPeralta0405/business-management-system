import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ImpuestoService } from '../../../../../../services/tables/impuesto.service';
import { IImpuesto } from '../../../../../../models/impuesto.model';

@Component({
  selector: 'app-impuesto-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './impuesto-form.component.html',
  styleUrl: './impuesto-form.component.css'
})
export class ImpuestoFormComponent implements OnInit {
  impuestoForm: FormGroup;
  isEditMode = false;
  impuestoId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Impuesto';

  constructor(
    private fb: FormBuilder,
    private impuestoService: ImpuestoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.impuestoForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      valor_calculo: [0, [Validators.required, Validators.min(0)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.impuestoId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Impuesto';
        this.loadImpuestoData(this.impuestoId);
      }
    });
  }

  loadImpuestoData(id: number): void {
    this.isLoading = true;
    this.impuestoService.getById(id).subscribe({
      next: (impuesto) => {
        this.impuestoForm.patchValue({
          descripcion: impuesto.descripcion,
          valor_calculo: impuesto.valor_calculo,
          abreviacion: impuesto.abreviacion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading impuesto:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el impuesto');
        this.router.navigate(['/sistema_general/mantenimientos/impuestos']);
      }
    });
  }

  onSubmit(): void {
    if (this.impuestoForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const impuestoData = this.impuestoForm.value;

    const operation$ = this.isEditMode && this.impuestoId
      ? this.impuestoService.update(this.impuestoId, impuestoData)
      : this.impuestoService.create(impuestoData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Impuesto actualizado correctamente' 
          : 'Impuesto creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el impuesto'
          : 'Error al crear el impuesto';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.impuestoForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/impuestos']);
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
