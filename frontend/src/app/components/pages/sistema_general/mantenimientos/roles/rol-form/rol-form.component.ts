import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RolService } from '../../../../../../services/tables/rol.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IRol } from '../../../../../../models/rol.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './rol-form.component.html',
  styleUrl: './rol-form.component.css'
})
export class RolFormComponent implements OnInit {
  rolForm: FormGroup;
  isEditMode = false;
  rolId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Rol';

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rolForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.rolId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Rol';
        this.loadRolData(this.rolId);
      }
    });
  }

  loadRolData(id: number): void {
    this.isLoading = true;
    this.rolService.getById(id).subscribe({
      next: (rol) => {
        this.rolForm.patchValue({
          descripcion: rol.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el rol');
        this.router.navigate(['/sistema_general/mantenimientos/roles']);
      }
    });
  }

  
  onSubmit(): void {
    if (this.rolForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const rolData = this.rolForm.value;
  
    const operation$ = this.isEditMode && this.rolId
      ? this.rolService.update(this.rolId, rolData)
      : this.rolService.create(rolData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Rol actualizado correctamente' 
          : 'Rol creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el rol'
          : 'Error al crear el rol';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.rolForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/roles']);
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
