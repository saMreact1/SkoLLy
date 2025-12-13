import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-results',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    MatTableModule,
    FormsModule,
    MatOptionModule,
    MatInputModule,
    NgFor
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  resultForm!: FormGroup;
  students: any[] = [];
  isSubmitted: boolean = false;

  classes = ['Pry 1', 'Pry 2', 'Pry 3', 'Pry 4', 'Pry 5'];
  subjects = ['Mathematics', 'English', 'Physics'];
  terms = ['First Term', 'Second Term', 'Third Term'];
  sessions = ['2024/2025', '2023/2024'];

  constructor(
    private fb: FormBuilder
  ) {
    this.resultForm = this.fb.group({
      selectedClass: [''],
      selectedSubject: [''],
      term: [''],
      session: ['']
    });
  }

  loadStudents() {
    this.students = [
      { id: 'ST001', name: 'Samuel Adeleke', test: 0, exam: 0, total: 0, grade: '', remark: '' },
      { id: 'ST002', name: 'Ada Obi', test: 0, exam: 0, total: 0, grade: '', remark: '' }
    ]
  }

  calculate(student: any) {
    student.total = student.test + student.exam;

    const total = student.total;
    if(total >= 70) {
      student.grade = 'A';
      student.remark = 'Excellent';
    } else if(total >= 60) {
      student.grade = 'B';
      student.remark = 'Very Good';
    } else if (total >= 50) {
      student.grade = 'C';
      student.remark = 'Good';
    } else if (total >= 40) {
      student.grade = 'D';
      student.remark = 'Fair';
    } else {
      student.grade = 'F';
      student.remark = 'Poor';
    }
  }

  submitResults() {
    this.isSubmitted = true;
    console.log('📤 Results Submitted:', this.students);
  }
}
