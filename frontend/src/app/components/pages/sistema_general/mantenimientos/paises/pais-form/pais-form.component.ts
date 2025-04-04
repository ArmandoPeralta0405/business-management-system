import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaisService } from '../../../../../../services/tables/pais.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IPais } from '../../../../../../models/pais.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pais-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './pais-form.component.html',
  styleUrl: './pais-form.component.css'
})
export class PaisFormComponent implements OnInit {
  
  paisForm: FormGroup;
  isEditMode = false;
  paisId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Pais';

  constructor(
    private fb: FormBuilder,
    private paisService: PaisService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paisForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      nacionalidad: ['', [Validators.required, Validators.maxLength(50)]],
      codigo_iso3: ['', [Validators.required, Validators.maxLength(3)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.paisId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Pais';
        this.loadPaisData(this.paisId);
      }
    });
  }

  loadPaisData(id: number): void {
    this.isLoading = true;
    this.paisService.getById(id).subscribe({
      next: (pais) => {
        this.paisForm.patchValue({
          descripcion: pais.descripcion,
          nacionalidad: pais.nacionalidad,
          codigo_iso3: pais.codigo_iso3,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pais:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el pais');
        this.router.navigate(['/sistema_general/mantenimientos/paises']);
      }
    });
  }

  
  onSubmit(): void {
    if (this.paisForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const paisData = this.paisForm.value;
  
    const operation$ = this.isEditMode && this.paisId
      ? this.paisService.update(this.paisId, paisData)
      : this.paisService.create(paisData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Pais actualizado correctamente' 
          : 'Pais creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el pais'
          : 'Error al crear el pais';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.paisForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/paises']);
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
