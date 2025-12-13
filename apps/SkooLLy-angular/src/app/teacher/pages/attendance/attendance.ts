import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-attendance',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    NgIf,
    NgFor
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance {
  attendanceForm!: FormGroup;
  students: any[] = [];
  isSubmitted: boolean = false;

  classes = ['Pry 1', 'Pry 2', 'Pry 3', 'Pry 4', 'Pry 5', 'Pry 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];
  subjects = ['Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History', 'Economics', 'Government', 'Literature in English'];

  constructor(
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      selectedClass: [''],
      selectedSubject: [''],
      date: [new Date()]
    })
  }

  loadStudents() {
    this.students = [
      { id: 'ST101', name: 'Samuel Adeleke', status: 'absent' },
      { id: 'ST102', name: 'Ada Obi', status: 'absent' },
      { id: 'ST103', name: 'Ibrahim Musa', status: 'absent' }
    ];
  }

  toggleStatus(student: any) {
    student.status = student.status === 'present' ? 'absent' : 'present';
  }

  submitAttendance() {
    this.isSubmitted = true;
    console.log('📤 Attendance submitted:', this.students);
  }
}
