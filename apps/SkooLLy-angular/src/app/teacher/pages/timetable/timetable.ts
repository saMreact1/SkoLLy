import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-timetable',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    FormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss',
})
export class Timetable {
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  editingCell: string | null = null;
  editedValue: string = '';

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'];

  // Dummy timetable — replace with actual teacher-assigned data
  timetable: { [key: string]: string } = {
    'Monday_Period 1': 'JS1 - Mathematics',
    'Tuesday_Period 2': 'JS3 - Physics',
    'Wednesday_Period 4': 'SS1 - Chemistry',
    'Thursday_Period 3': 'JS1 - Mathematics',
    'Friday_Period 5': 'SS2 - Biology'
  };

  isAssigned(day: string, period: string): boolean {
    return !!this.timetable[`${day}_${period}`];
  }

  editCell(day: string, period: string): void {
    const key = `${day}_${period}`;
    if (!this.isAssigned(day, period)) return;

    this.editingCell = key;
    this.editedValue = this.timetable[key];
  }

  saveCell(day: string, period: string): void {
    const key = `${day}_${period}`;
    this.timetable[key] = this.editedValue.trim() || this.timetable[key];
    this.editingCell = null;
  }

  cancelEdit(): void {
    this.editingCell = null;
  }

  downloadPDF(): void {
    const tableEl = this.pdfTable.nativeElement;

    html2canvas(tableEl, {
      scale: 2,
      scrollX: 0,
      scrollY: 0,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      // const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Timetable_${new Date().getTime()}.pdf`);
    });
  }
}
