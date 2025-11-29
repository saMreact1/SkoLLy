import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TimetableModal } from '../../components/modals/timetable-modal/timetable-modal';
import { ClassService } from '../../../core/services/class.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { TimetableService } from '../../../core/services/timetable.service';
import { SubjectService } from '../../../core/services/subject.service';
import { TimetableClass } from '../../../core/models/timetable.model';
import { Subject } from '../../../core/models/subject.model';

type Slot = { id?: string; subjectName: string; color: string; };
type Grid = Record<string, Slot[]>;


@Component({
  selector: 'app-timetable',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    FormsModule,
    NgIf,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss'
})
export class Timetable implements OnInit {
  classes: any[] = [];
  selectedClass: string = '';
  timetables: { [classId: string]: { [slotId: string]: TimetableClass[] } } = {};
  subjects: Subject[] = [];

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  times: string[] = ['8-9am', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm'];

  grid: { [slotId: string]: TimetableClass[] } = {};

  @ViewChild('timetableWrapper') timetableWrapper!: ElementRef;

  constructor(
    private dialog: MatDialog,
    private classService: ClassService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private timetableService: TimetableService,
    private subject: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadSubjects();
  }

  private ensureGridSkeleton() {
    for (const d of this.days) {
      for (const t of this.times) {
        const k = this.key(d, t);
        if (!this.grid[k]) this.grid[k] = [];
      }
    }
  }

  key(day: string, time: string) {
    return `${day}-${time}`;
  }

  openSubjectSelector(day: string, time: string) {
    const dialogRef = this.dialog.open(TimetableModal, {
      width: '300px',
      data: { subjects: this.subjects }
    });

    dialogRef.afterClosed().subscribe((selected: Subject | null) => {
      if (selected) {
        const timetableClass: TimetableClass = {
          id: selected._id!,
          subjectName: selected.name ?? 'Unnamed',
          color: (selected as any).color ?? this.getRandomColor()
        };

        const key = this.key(day, time);
        this.grid[key] = [timetableClass];

        if (!this.timetables[this.selectedClass]) {
          this.initTimetableForClass(this.selectedClass);
        }
        this.timetables[this.selectedClass][key] = [timetableClass];

        this.saveTimetable();
      }
    });
  }

  addRow() {
    if (!this.selectedClass) return;

    const newTime = `Slot ${this.times.length + 1}`;

    this.timetableService.addRow(this.selectedClass, newTime).subscribe({
      next: (res) => {
        this.times.push(newTime);

        // Update local grid from backend response
        this.days.forEach(day => {
          const key = this.key(day, newTime);
          this.grid[key] = [];
          this.timetables[this.selectedClass][key] = [];
        });
      },
      error: (err) => {
        console.error("Failed to add row:", err);
      }
    });
  }

  removeRow(index: number) {
    const time = this.times[index];
    this.times.splice(index, 1);

    // Remove from grid
    this.days.forEach(day => {
      const key = this.key(day, time);
      delete this.grid[key];
      if (this.selectedClass && this.timetables[this.selectedClass]) {
        delete this.timetables[this.selectedClass][key];
      }
    });
  }

  loadClasses() {
    const tenantId = this.auth.getTenantId();
    
    if (!tenantId) {
      console.warn('Tenant ID is missing. Cannot load classes.');
      return;
    }

    this.classService.getClassesByTenant(tenantId).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: () => {
        this.snack.open('Could not fetch classes for this school.', '', {
          duration: 3000,
        });
      }
    });
  }

  loadSubjects() {
    this.subject.getSubjects().subscribe((res: Subject[]) => {
      this.subjects = res.map(s => ({
        ...s,
        color: this.getRandomColor()
      }));
    });
  }

  getClasses(day: string, time: string) {
    return this.grid[this.key(day, time)] || [];
  }

  get selectedClassName(): string {
    const cls = this.classes.find(c => c._id === this.selectedClass);
    return cls ? cls.name : '';
  }

  onClassChange() {
    if (!this.selectedClass) return;

    if (this.timetables[this.selectedClass]) {
      this.grid = { ...this.timetables[this.selectedClass] };
      this.ensureGridSkeleton();
      return;
    }

    this.timetableService.getTimetable(this.selectedClass).subscribe({
      next: (res: any) => {
        const fetchedGrid = res.data || {};
        this.timetables[this.selectedClass] = fetchedGrid;
        this.grid = { ...fetchedGrid };
        this.ensureGridSkeleton();
      },
      error: () => this.snack.open('Failed to load timetable.', '', { duration: 2500 })
    });
  }

  saveTimetable() {
    if (!this.selectedClass) {
      this.snack.open('Select a class first', '', { duration: 2000 });
      return;
    }
    this.timetableService.saveTimetable(this.selectedClass, this.grid).subscribe({
      next: () => this.snack.open('Timetable saved.', '', { duration: 2000 }),
      error: () => this.snack.open('Failed to save timetable.', '', { duration: 3000 })
    });
  }

  downloadPDF() {
    if (!this.selectedClass || !this.timetableWrapper) return;

    const element = this.timetableWrapper.nativeElement as HTMLElement;

    // Save original styles
    const originalOverflow = element.style.overflow;
    const originalWidth = element.style.width;

    // Expand to fit all content
    element.style.overflow = 'visible';
    element.style.width = element.scrollWidth + 'px';

    html2canvas(element, {
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    }).then(canvas => {
      // Restore styles
      element.style.overflow = originalOverflow;
      element.style.width = originalWidth;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let position = 0;

      // Handle multipage if timetable is taller than A4
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, position * -1, imgWidth, imgHeight);
        if (position + pageHeight < imgHeight) pdf.addPage();
        position += pageHeight;
      }

      pdf.save(`${this.getClassName(this.selectedClass)}_Timetable.pdf`);
    });
  }

  downloadExcel() {
    if (!this.selectedClass) return;

    const worksheetData: any[][] = [];

    worksheetData.push(['Time', ...this.days]);

    this.times.forEach(time => {
      const row: string[] = [time];

      this.days.forEach(day => {
        const classes = this.grid[this.key(day, time)];
        if (classes?.length > 0) {
          row.push(classes[0].subjectName ?? '');
        } else {
          row.push('');
        }
      });

      worksheetData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
    XLSX.writeFile(wb, `${this.getClassName(this.selectedClass)}_Timetable.xlsx`);
  }

  private getClassName(classId: string) {
    const cls = this.classes.find(c => c._id === classId);
    return cls ? cls.name.replace(/\s+/g, '_') : 'Class';
  }

  private getRandomColor(): string {
    const colors = ['#6c5ce7', '#00b894', '#0984e3', '#d63031', '#fdcb6e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private initTimetableForClass(classId: string) {
    this.timetables[classId] = {};
    this.days.forEach(day => {
      this.times.forEach(time => {
        this.timetables[classId][`${day}-${time}`] = [];
      });
    });
  }
}