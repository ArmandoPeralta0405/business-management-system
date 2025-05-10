import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// Importamos el servicio y modelo para monedas
import { MonedaService } from '../../../../../../services/tables/moneda.service';
import { IMoneda } from '../../../../../../models/moneda.model';

@Component({
  selector: 'app-moneda-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './moneda-form.component.html',
  styleUrl: './moneda-form.component.css'
})
export class MonedaFormComponent implements OnInit {
  
  monedaForm: FormGroup;
  isEditMode = false;
  monedaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Moneda';

  constructor(
    private fb: FormBuilder,
    private monedaService: MonedaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.monedaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(10)]],
      codigo_iso: ['', [Validators.required, Validators.maxLength(3)]],
      simbolo: ['', [Validators.required, Validators.maxLength(5)]],
      decimales: [2, [Validators.required, Validators.min(0), Validators.max(10)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.monedaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Moneda';
        this.loadMonedaData(this.monedaId);
      }
    });
  }

  loadMonedaData(id: number): void {
    this.isLoading = true;
    this.monedaService.getById(id).subscribe({
      next: (moneda) => {
        this.monedaForm.patchValue({
          descripcion: moneda.descripcion,
          abreviacion: moneda.abreviacion,
          codigo_iso: moneda.codigo_iso,
          simbolo: moneda.simbolo,
          decimales: moneda.decimales,
          estado: moneda.estado // Convertir a booleano si viene como 1/0
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar la moneda:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la moneda');
        this.router.navigate(['/sistema_general/mantenimientos/monedas']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.monedaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const monedaData = this.prepareFormData();
  
    const operation$ = this.isEditMode && this.monedaId
      ? this.monedaService.update(this.monedaId, monedaData)
      : this.monedaService.create(monedaData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Moneda actualizada correctamente' 
          : 'Moneda creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la moneda'
          : 'Error al crear la moneda';
        this.showError(message);
      }
    });
  }

  prepareFormData(): any {
    const formData = {...this.monedaForm.value};
    // Convertir el estado booleano a 1/0 si es necesario para el backend
    if (typeof formData.estado === 'boolean') {
      formData.estado = formData.estado ? 1 : 0;
    }
    return formData;
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.monedaForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/monedas']);
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
