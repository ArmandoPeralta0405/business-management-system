import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { CategoriaProgramaService } from '../../../../../../services/tables/categoria_programa.service';
import { ICategoriaPrograma } from '../../../../../../models/categoria_programa.model';

@Component({
  selector: 'app-categoria-programa-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './categoria-programa-form.component.html',
  styleUrl: './categoria-programa-form.component.css'
})
export class CategoriaProgramaFormComponent implements OnInit {
  categoriaProgramaForm: FormGroup;
  isEditMode = false;
  categoriaProgramaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Categoría de Programa';

  constructor(
    private fb: FormBuilder,
    private categoriaProgramaService: CategoriaProgramaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriaProgramaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoriaProgramaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Categoría de Programa';
        this.loadCategoriaProgramaData(this.categoriaProgramaId);
      }
    });
  }

  loadCategoriaProgramaData(id: number): void {
    this.isLoading = true;
    this.categoriaProgramaService.getById(id).subscribe({
      next: (categoriaPrograma) => {
        this.categoriaProgramaForm.patchValue({
          descripcion: categoriaPrograma.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la categoría de programa');
        this.router.navigate(['/sistema_general/mantenimientos/categorias-programas']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoriaProgramaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const categoriaProgramaData = this.categoriaProgramaForm.value;

    const operation$ = this.isEditMode && this.categoriaProgramaId
      ? this.categoriaProgramaService.update(this.categoriaProgramaId, categoriaProgramaData)
      : this.categoriaProgramaService.create(categoriaProgramaData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Categoría de programa actualizada correctamente' 
          : 'Categoría de programa creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la categoría de programa'
          : 'Error al crear la categoría de programa';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.categoriaProgramaForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/categorias-programas']);
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
