import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CiudadService } from '../../../../../../services/tables/ciudad.service';
import { DepartamentoService } from '../../../../../../services/tables/departamento.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ICiudad } from '../../../../../../models/ciudad.model';
import { IDepartamento } from '../../../../../../models/departamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudad-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './ciudad-form.component.html',
  styleUrl: './ciudad-form.component.css'
})
export class CiudadFormComponent implements OnInit {
  
  ciudadForm: FormGroup;
  isEditMode = false;
  ciudadId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Ciudad';
  departamentos: IDepartamento[] = [];

  constructor(
    private fb: FormBuilder,
    private ciudadService: CiudadService,
    private departamentoService: DepartamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ciudadForm = this.fb.group({
      id_departamento: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      capital: [false], // Cambiado a boolean
      codigo_postal: ['', [Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartamentos();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.ciudadId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Ciudad';
        this.loadCiudadData(this.ciudadId);
      }
    });
  }

  loadDepartamentos(): void {
    this.departamentoService.getAll().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
      }
    });
  }

  loadCiudadData(id: number): void {
    this.isLoading = true;
    this.ciudadService.getById(id).subscribe({
      next: (ciudad) => {
        this.ciudadForm.patchValue({
          id_departamento: ciudad.id_departamento,
          descripcion: ciudad.descripcion,
          capital: ciudad.capital, // Convertir 1/0 a true/false
          codigo_postal: ciudad.codigo_postal || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ciudad:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la ciudad');
        this.router.navigate(['/sistema_general/mantenimientos/ciudades']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.ciudadForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const ciudadData = {
      ...this.ciudadForm.value,
      capital: this.ciudadForm.value.capital ? 1 : 0 // Convertir true/false a 1/0
    };
  
    const operation$ = this.isEditMode && this.ciudadId
      ? this.ciudadService.update(this.ciudadId, ciudadData)
      : this.ciudadService.create(ciudadData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Ciudad actualizada correctamente' 
          : 'Ciudad creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la ciudad'
          : 'Error al crear la ciudad';
        this.showError(message);
      }
    });
  }

  // Resto de los métodos permanecen igual...
  private markFormFieldsAsTouched(): void {
    Object.values(this.ciudadForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/ciudades']);
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