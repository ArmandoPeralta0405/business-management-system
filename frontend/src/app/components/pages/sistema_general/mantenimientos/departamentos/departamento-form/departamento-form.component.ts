import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoService } from '../../../../../../services/tables/departamento.service';
import { PaisService } from '../../../../../../services/tables/pais.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IDepartamento } from '../../../../../../models/departamento.model';
import { IPais } from '../../../../../../models/pais.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departamento-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './departamento-form.component.html',
  styleUrls: ['./departamento-form.component.css']
})
export class DepartamentoFormComponent implements OnInit {
  
  departamentoForm: FormGroup;
  isEditMode = false;
  departamentoId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Departamento';
  paises: IPais[] = [];

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private paisService: PaisService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departamentoForm = this.fb.group({
      id_pais: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadPaises();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.departamentoId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Departamento';
        this.loadDepartamentoData(this.departamentoId);
      }
    });
  }

  loadPaises(): void {
    this.paisService.getAll().subscribe({
      next: (data) => {
        this.paises = data;
      },
      error: (error) => {
        console.error('Error loading paises:', error);
      }
    });
  }

  loadDepartamentoData(id: number): void {
    this.isLoading = true;
    this.departamentoService.getById(id).subscribe({
      next: (departamento) => {
        this.departamentoForm.patchValue({
          id_pais: departamento.id_pais,
          descripcion: departamento.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading departamento:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el departamento');
        this.router.navigate(['/sistema_general/mantenimientos/departamentos']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.departamentoForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const departamentoData = this.departamentoForm.value;
  
    const operation$ = this.isEditMode && this.departamentoId
      ? this.departamentoService.update(this.departamentoId, departamentoData)
      : this.departamentoService.create(departamentoData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Departamento actualizado correctamente' 
          : 'Departamento creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el departamento'
          : 'Error al crear el departamento';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.departamentoForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/departamentos']);
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