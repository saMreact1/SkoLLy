import FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-results',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss'
})
export class Results {
  classes = ['JSS1', 'JSS2', 'SS1'];
  terms = ['1st Term', '2nd Term', '3rd Term'];
  sessions = ['2023/2024', '2024/2025'];
  subjects = ['Mathematics', 'English', 'Biology'];

  selectedClass = '';
  selectedTerm = '';
  selectedSession = '';
  selectedSubject = '';

  students = [
    { name: 'Blessing Ayo', ca: 0, exam: 0, total: 0, grade: '', remark: '', position: 0 },
    { name: 'Samuel Adeleke', ca: 0, exam: 0, total: 0, grade: '', remark: '', position: 0 },
  ];

  displayedColumns = ['name', 'ca', 'exam', 'total', 'grade', 'remark', 'position'];

  recalculate(student: any) {
    student.ca = Math.min(+student.ca || 0, 30); // Max 30
    student.exam = Math.min(+student.exam || 0, 70); // Max 70

    student.total = student.ca + student.exam;
    student.grade = this.getGrade(student.total);
    this.calculatePositions();
  }

  calculatePositions() {
    const sorted = [...this.students].sort((a, b) => b.total - a.total);
    sorted.forEach((s, index) => {
      s.position = index + 1;
    });
  }

  getGrade(total: number): string {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'D';
    return 'F';
  }

  saveResults() {
    console.log('Results saved:', this.students);
    // you’ll eventually call your API here
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.students);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, `Results_${this.selectedClass}_${this.selectedSubject}.xlsx`);
  }

  importExcel(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const imported = XLSX.utils.sheet_to_json(sheet);

      // Optional: sanitize or map data format
      this.students = imported.map((s: any) => ({
        name: s.name || '',
        ca: +s.ca || 0,
        exam: +s.exam || 0,
        total: (+s.ca || 0) + (+s.exam || 0),
        grade: this.getGrade((+s.ca || 0) + (+s.exam || 0)),
        remark: s.remark || '',
        position: 0,
      }));

      this.calculatePositions();
    };

    reader.readAsArrayBuffer(file);
  }
}
