import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-profile',
  imports: [
    NgFor,
    MatDialogActions,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss',
})
export class StudentProfile {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { student: any },
    public dialogRef: MatDialogRef<StudentProfile>
  ) {};

  close(): void {
    this.dialogRef.close();
  }
}
