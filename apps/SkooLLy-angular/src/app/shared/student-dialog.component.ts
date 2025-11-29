import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-student-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgFor
  ],
  template: `
    <h2 mat-dialog-title>Students in {{ data.className }}</h2>
    <mat-dialog-content>
        <ul class="student-list">
            <li *ngFor="let student of data.students">{{ student }}</li>
        </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
//   styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { className: string, students: string[] }) {}
}
