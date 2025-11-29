import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassService } from '../../../../core/services/class.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TeacherService } from '../../../../core/services/teacher.service';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add-class-modal',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgFor,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './add-class-modal.html',
  styleUrl: './add-class-modal.scss'
})
export class AddClassModal implements OnInit {
  classForm!: FormGroup;
  isLoading = false;
  teachers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private classService: ClassService,
    private auth: AuthService,
    private teacher: TeacherService,
    public dialogRef: MatDialogRef<AddClassModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      assignedTeacher: ['', Validators.required]
    });

    this.loadTeachers();
  }

  loadTeachers() {
    this.teacher.getTeachers().subscribe({
      next: (res) => {
        this.teachers = res; 
        console.log('Teachers fetched:', res)
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Failed to load teachers', '', { duration: 3000 });
      }
    });
  }

  save() {
    if (this.classForm.invalid) return;

    const schoolId = this.auth.getTenantId();
    if (!schoolId) {
      this.snack.open('School ID missing. Please log in again.', '', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.classForm.value,
      schoolId,
    };

    this.classService.createClass(payload).subscribe({
      next: (res) => {
        // this.isLoading = false;
        this.snack.open('Class created successfully!', '', { duration: 3000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Failed to create class', '', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
