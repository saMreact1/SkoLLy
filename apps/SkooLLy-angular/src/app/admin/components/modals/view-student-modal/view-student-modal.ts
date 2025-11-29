import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-student-modal',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './view-student-modal.html',
  styleUrl: './view-student-modal.scss'
})
export class ViewStudentModal {
  colorScheme = {
    name: 'skoolly',
    selectable: true,
    group: 'ordinal',
    domain: ['#4caf50', '#f44336']
  };

  attendance = [
    { name: 'Present', value: 78 },
    { name: 'Absent', value: 22 }
  ];

  grades = new MatTableDataSource ([
    { subject: 'Mathematics', grade: 'A', score: 80 },
    { subject: 'English', grade: 'B+', score: 72 },
    { subject: 'Physics', grade: 'A-', score: 75 },
    { subject: 'Civic', grade: 'B', score: 69 }
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewStudentModal>,
  ) {}

  ngOnInit(): void {
    console.log(this.attendance)
  }

  close() {
    this.dialogRef.close();
  }
}
