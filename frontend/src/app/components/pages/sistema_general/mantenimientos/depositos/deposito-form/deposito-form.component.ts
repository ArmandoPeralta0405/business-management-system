import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepositoService } from '../../../../../../services/tables/deposito.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { IDeposito } from '../../../../../../models/deposito.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-deposito-form',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './deposito-form.component.html',
  styleUrl: './deposito-form.component.css'
})
export class DepositoFormComponent implements OnInit {
  depositoForm: FormGroup;
  isEditMode = false;
  depositoId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nuevo Deposito';

  constructor(
    private fb: FormBuilder,
    private depositoService: DepositoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.depositoForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.depositoId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Deposito';
        this.loadDepositoData(this.depositoId);
      }
    });
  }

  loadDepositoData(id: number): void {
    this.isLoading = true;
    this.depositoService.getById(id).subscribe({
      next: (deposito) => {
        this.depositoForm.patchValue({
          descripcion: deposito.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading deposito:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar el deposito');
        this.router.navigate(['/sistema_general/mantenimientos/depositos']);
      }
    });
  }

  
  onSubmit(): void {
    if (this.depositoForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const depositoData = this.depositoForm.value;
  
    const operation$ = this.isEditMode && this.depositoId
      ? this.depositoService.update(this.depositoId, depositoData)
      : this.depositoService.create(depositoData);
  
    operation$.subscribe({
      next: (response) => {
        const message = this.isEditMode 
          ? 'Deposito actualizado correctamente' 
          : 'Deposito creado correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar el deposito'
          : 'Error al crear el deposito';
        this.showError(message);
      }
    });
  }

  private markFormFieldsAsTouched(): void {
    Object.values(this.depositoForm.controls).forEach(control => {
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
      this.router.navigate(['/sistema_general/mantenimientos/depositos']);
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
