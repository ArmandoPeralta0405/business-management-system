import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LineaService } from '../../../../../../services/tables/linea.service';
import { CategoriaService } from '../../../../../../services/tables/categoria.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ILinea } from '../../../../../../models/linea.model';
import { ICategoria } from '../../../../../../models/categoria.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-linea-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './linea-form.component.html',
  styleUrl: './linea-form.component.css'
})
export class LineaFormComponent implements OnInit {

  lineaForm: FormGroup;
  isEditMode = false;
  lineaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Línea';
  categorias: ICategoria[] = [];

  constructor(
    private fb: FormBuilder,
    private lineaService: LineaService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lineaForm = this.fb.group({
      id_categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCategorias();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.lineaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Línea';
        this.loadLineaData(this.lineaId);
      }
    });
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error loading categorias:', error);
      }
    });
  }

  loadLineaData(id: number): void {
    this.isLoading = true;
    this.lineaService.getById(id).subscribe({
      next: (linea) => {
        this.lineaForm.patchValue({
          id_categoria: linea.id_categoria,
          descripcion: linea.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading linea:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la línea');
        this.router.navigate(['/control_stock/mantenimientos/lineas']);
      }
    });
  }

  onSubmit(): void {
    if (this.lineaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const lineaData = this.lineaForm.value;

    const operation$ = this.isEditMode && this.lineaId
      ? this.lineaService.update(this.lineaId, lineaData)
      : this.lineaService.create(lineaData);

    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Línea actualizada correctamente' 
          : 'Línea creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la línea'
          : 'Error al crear la línea';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.lineaForm.controls).forEach(control => {
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
      this.router.navigate(['/control_stock/mantenimientos/lineas']);
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
