import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AddStudentModal } from '../../components/modals/add-student-modal/add-student-modal';
import { ViewStudentModal } from '../../components/modals/view-student-modal/view-student-modal';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../../../core/services/student.service';
import { ClassModel, ClassService } from '../../../core/services/class.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-students',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    NgIf,
    NgFor,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students implements OnInit {
  searchTerm = '';
  columns: string[] = ['name', 'class', 'gender', 'email', 'actions'];
  selectedClass: string = '';
  students: any[] = [];
  // class: ClassModel[] = [];
  classOptions: ClassModel[] = [];
  // tenantId: string = '';

  constructor(
    private dialog: MatDialog,
    private student: StudentService,
    private classes: ClassService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
    this.loadClasses();
  }

  fetchStudents() {
    this.student.getStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        console.error('Failed to load students:', err);
      }
    });
  }

  loadClasses() {
    const tenantId = this.auth.getTenantId();
    if (!tenantId) {
      console.warn('Tenant ID is missing. Cannot load classes.');
      return;
    }

    this.classes.getClassesByTenant(tenantId).subscribe({
      next: (data) => {
        this.classOptions = data;
      },
      error: () => {
        this.snack.open('Could not fetch classes for this school.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  openAddStudentModal() {
    const dialogRef = this.dialog.open(AddStudentModal, {
      width: '400px',
      data: { classes: this.classes },
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchStudents();
      }
    });
  }

  viewStudent(student: any) {
    this.dialog.open(ViewStudentModal, {
      width: '100%',
      maxWidth: '600px',
      data: student,
      panelClass: 'responsive-modal'
    });
  }

  onFilterChange() {
    // Triggers filteredStudents() change
  }

  filteredStudents() {
    let filtered = this.students;

    if (this.selectedClass) {
      filtered = filtered.filter(s => s.classId._id === this.selectedClass);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.fullName?.toLowerCase().includes(term) ||
        student.classId?.name?.toLowerCase().includes(term) ||
        student.gender?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
