import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubjectModal } from '../../components/modals/subject-modal/subject-modal';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from '../../../core/models/subject.model';
import { SubjectService } from '../../../core/services/subject.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-subjects',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    MatFormFieldModule,
    MatMenuModule,
  ],
  templateUrl: './subjects.html',
  styleUrl: './subjects.scss'
})
export class Subjects implements OnInit {
  subjects: Subject[] = [];
  teachers: any[] = [];
  columnsToDisplay = ['name', 'code', 'teacher', 'actions'];
  dataSource = new MatTableDataSource<Subject>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private subject: SubjectService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  loadSubjects() {
    this.subject.getSubjects().subscribe({
      next: (data: Subject[]) => {
        this.subjects = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading subjects', err);
        this.snack.open('Failed to load subjects', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openAddSubjectModal(subject?: Subject) {
    const dialogRef = this.dialog.open(SubjectModal, { width: '400px', data: subject });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (subject) {
        const idx = this.subjects.findIndex(s => s._id === result._id);
        if (idx !== -1) {
          this.subjects[idx] = result;
        }
      } else {
        this.subjects.push(result);
      }

      // ✅ Always update the table
      this.dataSource.data = [...this.subjects];
    });
  }

  editSubject(subject: Subject) {
    const dialogRef = this.dialog.open(SubjectModal, {
      width: '400px',
      data: { ...subject }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated && updated._id) {
        this.subject.updateSubject(updated._id, updated).subscribe(res => {
          const idx = this.dataSource.data.findIndex(s => s._id === res._id);
          if (idx !== -1) {
            const updatedData = [...this.dataSource.data];

            // 🔑 replace teacher with the actual object
            const teacherObj = this.teachers.find(t => t._id === updated.teacher);
            updated.teacher = teacherObj || res.teacher;

            updatedData[idx] = updated;
            this.dataSource.data = updatedData;
          }
        });
      }
    });
  }

  deleteSubject(subject: Subject) {
    if (subject._id) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Delete Subject',
          message: 'Are you sure you want to delete this subject?'
        }
      });

      confirmDialog.afterClosed().subscribe(result => {
        if (result) {
          this.subject.deleteSubject(subject._id!).subscribe(() => {
            this.subjects = this.subjects.filter(s => s._id !== subject._id);
            this.dataSource.data = this.subjects;
            this.snack.open('Subject deleted', 'Close', { duration: 3000 });
          });
        }
      });
    }
  }
}
