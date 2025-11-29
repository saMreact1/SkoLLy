import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddClassModal } from '../../components/modals/add-class-modal/add-class-modal';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClassService } from '../../../core/services/class.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentDialogComponent } from '../../../shared/student-dialog.component';
import { AssignTeacherDialogComponent } from '../../components/dialogs/assign-teacher-dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';

@Component({
  selector: 'app-classes',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    MatDialogModule
    // NgIf
  ],
  templateUrl: './classes.html',
  styleUrl: './classes.scss'
})
export class Classes implements OnInit {
  classes: any[] = [];
  teachers: any[] = [];
  displayedColumns: string[] = ['name', 'students', 'teacher', 'actions'];
  newClass = { name: '' };
  teachersMap: { [key: string]: string } = {};
  // @ViewChild('addClassModal') addClassModal!: TemplateRef<any>;

  constructor(
    private classService: ClassService,
    private snackBar: MatSnackBar,
    private teacher: TeacherService,
    private dialog: MatDialog,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
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
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  loadTeachers() {
    this.teacher.getTeachers().subscribe((teachers: any[]) => {
      this.teachersMap = {};
      teachers.forEach(t => {
        this.teachersMap[t._id] = `${t.fullName}`;
      });
    });
  }

  onAssignTeacher(classId: string, teacherId: string) {
    console.log('Sending to backend:', { classId, teacherId });
    this.classService.assignTeacher(classId, teacherId).subscribe({
      next: (res) => {
        this.snackBar.open('Teacher assigned successfully', 'Close', { duration: 3000 });
        this.loadClasses(); // refresh after update
      },
      error: () => this.snackBar.open('Failed to assign teacher', 'Close', { duration: 3000 })
    });
  }

  openAddClassModal() {
    const dialogRef = this.dialog.open(AddClassModal, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((newClass) => {
      if (newClass) {
        this.loadClasses();
      }
    });
  }

  openAssignTeacherDialog(cls: any) {
    const dialogRef = this.dialog.open(AssignTeacherDialogComponent, {
      width: '400px',
      data: cls
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.assignTeacher(cls._id, result).subscribe({
          next: () => {
            this.snackBar.open('Teacher updated successfully', 'Close', { duration: 3000 });
            this.loadClasses();
          },
          error: () => this.snackBar.open('Failed to update teacher', 'Close', { duration: 3000 })
        });
      }
    });
  }

  
  confirmDeleteClass(classId: string) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Class',
        message: 'Are you sure you want to delete this class?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.classService.deleteClass(classId).subscribe(() => {
          this.classes = this.classes.filter(n => n._id !== classId);
        });
        this.snack.open('Class deleted', 'Close', { duration: 3000 });
      }
    });
  }
}