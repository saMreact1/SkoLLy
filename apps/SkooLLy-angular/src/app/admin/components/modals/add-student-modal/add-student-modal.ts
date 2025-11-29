import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from '../../../../core/services/student.service';
import { ClassService } from '../../../../core/services/class.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-add-student-modal',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgFor
  ],
  templateUrl: './add-student-modal.html',
  styleUrl: './add-student-modal.scss'
})
export class AddStudentModal implements OnInit {
  studentForm!: FormGroup;
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentModal>,
    private snack: MatSnackBar,
    private student: StudentService,
    private classService: ClassService,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadClasses();

    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      classId: ['', Validators.required],
      dob: [''],
      gender: [''],
      phone: [''],
      bio: [''],
      password: ['', Validators.required]
    });
  }

  loadClasses() {
    const tenantId = this.auth.getTenantId();
    if (!tenantId) {
      console.warn('Tenant ID is missing. Cannot load classes.');
      return;
    }

    this.classService.getClassesByTenant(tenantId).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: () => {
        this.snack.open('Could not fetch classes for this school.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  submit() {
    if (this.studentForm.invalid) {
      this.snack.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    };

    this.student.addStudent(this.studentForm.value).subscribe({
      next: (res) => {
        this.snack.open('Student added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Error adding student.', 'Close', { duration: 3000 });
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  // submit() {
  //   if (this.studentForm.invalid) {
  //     this.snack.open('Please fill all required fields.', 'Close', { duration: 3000 });
  //     return;
  //   }

  //   const payload = {
  //     ...this.studentForm.value,
  //     tenantId: this.data.tenantId, // passed when opening modal
  //     schoolName: this.data.schoolName
  //   };

  //   this.student.addStudent(payload).subscribe({
  //     next: () => {
  //       this.snack.open('Student added successfully!', 'Close', { duration: 3000 });
  //       this.dialogRef.close(true);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.snack.open('Error adding student.', 'Close', { duration: 3000 });
  //     }
  //   });
  // }
}
