import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    RouterModule,
    MatCardModule,
    MatLabel,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements OnInit {
  forgotForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
  if (this.forgotForm.invalid) return;

  this.auth.forgotPassword(this.forgotForm.value.email).subscribe({
    next: () => {
      this.snack.open('Reset password link successfully sent', '', { 
        duration: 3000,
        panelClass: ['white-bg-snack']
      });
    this.router.navigate(['']);
    },
    error: (err) => {
      this.snack.open('Error sending a reset link', '', { 
        duration: 3000,
        panelClass: ['white-bg-snack']
        });
    },
  });
}
}
