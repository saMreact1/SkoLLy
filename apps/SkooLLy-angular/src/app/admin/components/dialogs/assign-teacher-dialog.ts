import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TeacherService } from '../../../core/services/teacher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-teacher-dialog',
  standalone: true, // <-- This is the key!
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  template: `
    <h1 mat-dialog-title>Assign Teacher</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Select Teacher</mat-label>
        <mat-select [(value)]="selectedTeacherId">
          <mat-option *ngFor="let teacher of teachers" [value]="teacher._id">
            {{ teacher.fullName }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onAssign()">Assign</button>
    </div>
  `
})
export class AssignTeacherDialogComponent implements OnInit {
  teachers: any[] = [];
  selectedTeacherId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AssignTeacherDialogComponent>,
    private teacher: TeacherService
  ) {}

  ngOnInit() {
    this.teacher.getTeachers().subscribe(t => this.teachers = t);
    this.selectedTeacherId = this.data.teacher?._id || '';
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAssign() {
    this.dialogRef.close(this.selectedTeacherId);
  }
}
