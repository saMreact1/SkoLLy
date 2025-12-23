import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface Student {
  id: string;
  name: string;
  test: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
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
  students: Student[] = [];
  isSubmitted: boolean = false;

  classes = ['Pry 1', 'Pry 2', 'Pry 3', 'Pry 4', 'Pry 5', 'Pry 6'];
  subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Social Studies'];
  terms = ['First Term', 'Second Term', 'Third Term'];
  sessions = ['2024/2025', '2023/2024', '2022/2023'];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.resultForm = this.fb.group({
      selectedClass: ['', Validators.required],
      selectedSubject: ['', Validators.required],
      term: ['', Validators.required],
      session: ['', Validators.required]
    });
  }

  loadStudents(): void {
    if (this.resultForm.invalid) {
      this.resultForm.markAllAsTouched();
      return;
    }

    // Reset submission state
    this.isSubmitted = false;

    // Mock data - replace with actual API call
    this.students = [
      { id: 'ST001', name: 'Samuel Adeleke', test: 0, exam: 0, total: 0, grade: '', remark: '' },
      { id: 'ST002', name: 'Ada Obi', test: 0, exam: 0, total: 0, grade: '', remark: '' },
      { id: 'ST003', name: 'Chinonso Okeke', test: 0, exam: 0, total: 0, grade: '', remark: '' },
      { id: 'ST004', name: 'Fatima Mohammed', test: 0, exam: 0, total: 0, grade: '', remark: '' },
      { id: 'ST005', name: 'Emmanuel Bassey', test: 0, exam: 0, total: 0, grade: '', remark: '' }
    ];
  }

  calculate(student: Student): void {
    // Ensure values are within bounds
    student.test = Math.min(Math.max(student.test || 0, 0), 30);
    student.exam = Math.min(Math.max(student.exam || 0, 0), 70);
    
    student.total = student.test + student.exam;

    const total = student.total;
    
    if (total >= 70) {
      student.grade = 'A';
      student.remark = 'Excellent';
    } else if (total >= 60) {
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

  clearResults(): void {
    this.students = this.students.map(student => ({
      ...student,
      test: 0,
      exam: 0,
      total: 0,
      grade: '',
      remark: ''
    }));
    this.isSubmitted = false;
  }

  submitResults(): void {
    // Validate that all students have scores
    const hasIncompleteScores = this.students.some(
      student => student.test === 0 && student.exam === 0
    );

    if (hasIncompleteScores) {
      console.warn('⚠️ Some students have incomplete scores');
      // You can add a snackbar or dialog here
    }

    const payload = {
      class: this.resultForm.value.selectedClass,
      subject: this.resultForm.value.selectedSubject,
      term: this.resultForm.value.term,
      session: this.resultForm.value.session,
      results: this.students
    };

    console.log('📤 Results Submitted:', payload);
    
    // Replace with actual API call
    // this.resultsService.submitResults(payload).subscribe(...)
    
    this.isSubmitted = true;
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      this.isSubmitted = false;
    }, 5000);
  }
}