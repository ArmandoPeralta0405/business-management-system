import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { MarcaService } from '../../../../../../services/tables/marca.service';
import { IMarca } from '../../../../../../models/marca.model';

@Component({
  selector: 'app-marca-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent implements OnInit {
  marcaForm: FormGroup;
  isEditMode = false;
  marcaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Marca';

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.marcaForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.marcaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Marca';
        this.loadMarcaData(this.marcaId);
      }
    });
  }

  loadMarcaData(id: number): void {
    this.isLoading = true;
    this.marcaService.getById(id).subscribe({
      next: (marca) => {
        this.marcaForm.patchValue({
          descripcion: marca.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading marca:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la marca');
        this.router.navigate(['/sistema_general/mantenimientos/marcas']);
      }
    });
  }

  onSubmit(): void {
    if (this.marcaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const marcaData = this.marcaForm.value;

    const operation$ = this.isEditMode && this.marcaId
      ? this.marcaService.update(this.marcaId, marcaData)
      : this.marcaService.create(marcaData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Marca actualizada correctamente' 
          : 'Marca creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la marca'
          : 'Error al crear la marca';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.marcaForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/marcas']);
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
