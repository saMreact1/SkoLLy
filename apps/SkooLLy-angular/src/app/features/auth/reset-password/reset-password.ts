import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  token!: string;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(7)]]
    })
  }

  onSubmit() {
    if(this.resetForm.invalid) return;

    this.auth.resetPassword(this.token, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.snack.open('Password Successfully Reset. Redirecting...', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      setTimeout(() => this.router.navigate(['/auth']), 3000);
      },
      error: (err) => {
        this.snack.open('Error resetting password', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        setTimeout(() => this.router.navigate(['/forgot-password']), 3000);
      }
    })
  }
}
