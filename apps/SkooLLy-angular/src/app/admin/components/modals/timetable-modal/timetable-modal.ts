import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from '../../../../core/models/subject.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-timetable-modal',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    FormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './timetable-modal.html',
  styleUrl: './timetable-modal.scss'
})
export class TimetableModal {
  selected: Subject | null = null;

  constructor(
    private dialogRef: MatDialogRef<TimetableModal>,
    @Inject(MAT_DIALOG_DATA) public data: { subjects: Subject[] }
  ) {}

  close() {
    this.dialogRef.close(null);
  }

  confirm() {
    this.dialogRef.close(this.selected);
  }
}
