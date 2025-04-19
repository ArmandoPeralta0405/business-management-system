import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../../../../../services/tables/categoria.service';
import { ICategoria } from '../../../../../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  isEditMode = false;
  categoriaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Categoría';

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoriaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Categoría';
        this.loadCategoriaData(this.categoriaId);
      }
    });
  }

  loadCategoriaData(id: number): void {
    this.isLoading = true;
    this.categoriaService.getById(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          descripcion: categoria.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categoria:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la categoría');
        this.router.navigate(['/sistema_general/mantenimientos/categorias']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const categoriaData = this.categoriaForm.value;

    const operation$ = this.isEditMode && this.categoriaId
      ? this.categoriaService.update(this.categoriaId, categoriaData)
      : this.categoriaService.create(categoriaData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Categoría actualizada correctamente' 
          : 'Categoría creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la categoría'
          : 'Error al crear la categoría';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.categoriaForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/categorias']);
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
