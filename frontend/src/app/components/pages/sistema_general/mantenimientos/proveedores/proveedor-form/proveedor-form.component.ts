import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProveedorService } from '../../../../../../services/tables/proveedor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProveedor } from '../../../../../../models/proveedor.model';
import { CiudadService } from '../../../../../../services/tables/ciudad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.css'
})
export class ProveedorFormComponent implements OnInit {

  proveedorForm: FormGroup;
  isEditMode = false;
  idProveedor: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Proveedor';
  ciudades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private ciudadService: CiudadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.proveedorForm = this.fb.group({
      id_proveedor: [null],
      razon_social: ['', [Validators.required, Validators.maxLength(100)]],
      nombre_fantasia: ['', [Validators.maxLength(100)]],
      ruc: ['', [Validators.maxLength(20)]],
      cedula: ['', [Validators.maxLength(20)]],
      id_ciudad: [null, [Validators.required]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      estado: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCiudades();
    
    this.route.paramMap.subscribe(params => {
      const idProveedor = params.get('id');

      if (idProveedor) {
        this.idProveedor = +idProveedor;
        this.isEditMode = true;
        this.formTitle = 'Editar Proveedor';
        this.loadProveedorData(this.idProveedor);
      }
    });
  }

  loadCiudades(): void {
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades = data;
      },
      error: (error) => {
        console.error('Error loading ciudades:', error);
        this.showError('No se pudieron cargar las ciudades');
      }
    });
  }

  loadProveedorData(idProveedor: number): void {
    this.isLoading = true;
    this.proveedorService.getById(idProveedor).subscribe({
      next: (proveedor) => {
        this.proveedorForm.patchValue({
          id_proveedor: proveedor.id_proveedor,
          razon_social: proveedor.razon_social,
          nombre_fantasia: proveedor.nombre_fantasia,
          ruc: proveedor.ruc,
          cedula: proveedor.cedula,
          id_ciudad: proveedor.id_ciudad,
          direccion: proveedor.direccion,
          telefono: proveedor.telefono,
          email: proveedor.email,
          estado: proveedor.estado
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading proveedor:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el proveedor');
        this.router.navigate(['/sistema_general/mantenimientos/proveedores']);
      }
    });
  }

  onSubmit(): void {
    if (this.proveedorForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const proveedorData = this.proveedorForm.value;

    const operation$ = this.isEditMode && this.idProveedor
      ? this.proveedorService.update(this.idProveedor, proveedorData)
      : this.proveedorService.create(proveedorData);

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        const message = this.isEditMode 
          ? 'Proveedor actualizado correctamente' 
          : 'Proveedor creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el proveedor'
          : 'Error al crear el proveedor';
        this.showError(message + ': ' + (error.error?.message || error.message));
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.proveedorForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/proveedores']);
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
