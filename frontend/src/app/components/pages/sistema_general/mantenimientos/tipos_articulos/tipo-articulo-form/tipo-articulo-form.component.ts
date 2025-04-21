import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { TipoArticuloService } from '../../../../../../services/tables/tipo_articulo.service';
import { ITipoArticulo } from '../../../../../../models/tipo_articulo.model';

@Component({
  selector: 'app-tipo-articulo-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './tipo-articulo-form.component.html',
  styleUrl: './tipo-articulo-form.component.css'
})
export class TipoArticuloFormComponent implements OnInit {
  tipoArticuloForm: FormGroup;
  isEditMode = false;
  tipoArticuloId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Tipo de Artículo';

  constructor(
    private fb: FormBuilder,
    private tipoArticuloService: TipoArticuloService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tipoArticuloForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tipoArticuloId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Tipo de Artículo';
        this.loadTipoArticuloData(this.tipoArticuloId);
      }
    });
  }

  loadTipoArticuloData(id: number): void {
    this.isLoading = true;
    this.tipoArticuloService.getById(id).subscribe({
      next: (tipoArticulo) => {
        this.tipoArticuloForm.patchValue({
          descripcion: tipoArticulo.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tipoArticulo:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el tipo de artículo');
        this.router.navigate(['/sistema_general/mantenimientos/tipos_articulos']);
      }
    });
  }

  onSubmit(): void {
    if (this.tipoArticuloForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const tipoArticuloData = this.tipoArticuloForm.value;

    const operation$ = this.isEditMode && this.tipoArticuloId
      ? this.tipoArticuloService.update(this.tipoArticuloId, tipoArticuloData)
      : this.tipoArticuloService.create(tipoArticuloData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Tipo de artículo actualizado correctamente' 
          : 'Tipo de artículo creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el tipo de artículo'
          : 'Error al crear el tipo de artículo';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.tipoArticuloForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/tipos_articulos']);
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
