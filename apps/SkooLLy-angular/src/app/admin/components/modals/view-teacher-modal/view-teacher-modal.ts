import { DatePipe, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-teacher-modal',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    DatePipe
  ],
  templateUrl: './view-teacher-modal.html',
  styleUrl: './view-teacher-modal.scss'
})
export class ViewTeacherModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewTeacherModal>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
