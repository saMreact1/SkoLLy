import { Component, Inject } from '@angular/core';
import { StudentProfile } from '../student-profile/student-profile';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view-student',
  imports: [
    MatCardModule,
    MatDialogContent,
    MatButtonModule,
    MatIconModule,
    MatDialogActions,
    NgFor
  ],
  templateUrl: './view-student.html',
  styleUrl: './view-student.scss',
})
export class ViewStudent {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewStudent>,
    @Inject(MAT_DIALOG_DATA) public data: { className: string; students: any[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  openStudentProfile(student: any) {
    this.dialog.open(StudentProfile, {
      width: '600px',
      data: { student }
    });
  }
}
