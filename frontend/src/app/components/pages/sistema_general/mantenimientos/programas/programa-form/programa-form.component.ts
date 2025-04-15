import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProgramaService } from '../../../../../../services/tables/programa.service';
import { ModuloService } from '../../../../../../services/tables/modulo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IPrograma } from '../../../../../../models/programa.model';
import { IModuloView } from '../../../../../../models/modulo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programa-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './programa-form.component.html',
  styleUrl: './programa-form.component.css'
})
export class ProgramaFormComponent implements OnInit {

  programaForm: FormGroup;
  isEditMode = false;
  idPrograma: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Programa';
  modulos: IModuloView[] = [];

  constructor(
    private fb: FormBuilder,
    private programaService: ProgramaService,
    private moduloService: ModuloService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.programaForm = this.fb.group({
      id_programa: [null],
      id_modulo: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      ruta: ['', [Validators.required, Validators.maxLength(200)]],
      estado: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    
    this.loadModulos();

    this.route.paramMap.subscribe(params => {
      const idPrograma = params.get('id');

      if (idPrograma) {
        this.idPrograma = +idPrograma;
        this.isEditMode = true;
        this.formTitle = 'Editar Programa';
        this.loadProgramaData(this.idPrograma);
      }
    });
  }

  loadModulos(): void {
    this.moduloService.getAll().subscribe({
      next: (data) => {
        this.modulos = data;
      },
      error: (error) => {
        console.error('Error loading modulos:', error);
        this.showError('Error al cargar los módulos');
      }
    });
  }

  loadProgramaData(idPrograma: number): void {
    
    this.isLoading = true;
    this.programaService.getById(idPrograma).subscribe({
      next: (programa) => {
        this.programaForm.patchValue({
          id_programa: programa.id_programa,
          id_modulo: programa.id_modulo,
          nombre: programa.nombre,
          ruta: programa.ruta,
          estado: programa.estado
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading programa:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el programa');
        this.router.navigate(['/sistema_general/mantenimientos/programas']);
      }
    });
  }

  onSubmit(): void {
    if (this.programaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const programaData = this.programaForm.value;

    const operation$ = this.isEditMode && this.idPrograma
      ? this.programaService.update(this.idPrograma, programaData)
      : this.programaService.create(programaData);

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        const message = this.isEditMode 
          ? 'Programa actualizado correctamente' 
          : 'Programa creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el programa'
          : 'Error al crear el programa';
        this.showError(message + ': ' + (error.error?.message || error.message));
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.programaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      timer: 2000
    }).then(() => {
      this.router.navigate(['/sistema_general/mantenimientos/programas']);
    });
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  }
}
