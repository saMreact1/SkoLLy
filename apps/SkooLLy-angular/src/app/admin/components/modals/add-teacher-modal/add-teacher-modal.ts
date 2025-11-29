import { MatFormFieldModule } from '@angular/material/form-field';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-teacher-modal',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './add-teacher-modal.html',
  styleUrl: './add-teacher-modal.scss'
})
export class AddTeacherModal {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTeacherModal>,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    password: ['']
  });
  }

  submit() {
    if (this.form.invalid) return;

    const formData = this.form.value;
    console.log('Submitting new teacher:', formData);

    // TODO: Hook with backend
    this.snackBar.open('Teacher added successfully!', 'Close', { duration: 3000 });
    this.dialogRef.close(formData);
  }
}