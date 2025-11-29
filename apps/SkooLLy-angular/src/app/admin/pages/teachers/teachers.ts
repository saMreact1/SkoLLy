import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ViewTeacherModal } from '../../components/modals/view-teacher-modal/view-teacher-modal';
import { AddTeacherModal } from '../../components/modals/add-teacher-modal/add-teacher-modal';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-teachers',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss'
})
export class Teachers implements OnInit {
  searchTerm = '';
  columns: string[] = ['name', 'email', 'actions'];
  teachers: any[] = [];

  constructor(
    private dialog: MatDialog,
    private teacher: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacher.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (err) => {
        console.log('Failed to load teachers', err);
        
      }
    })
  }

  filteredTeachers() {
    if(!this.searchTerm) return this.teachers;
    const term = this.searchTerm.toLowerCase();
    return this.teachers.filter(t => 
      t.name.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term)
    );
  }

  openAddTeacherModal() {
    const dialogRef = this.dialog.open(AddTeacherModal, {
      width: '400px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teachers.push(result); // TEMP: Update local array
      }
    });
  }

  viewTeacher(teacher: any) {
    this.dialog.open(ViewTeacherModal, {
      width: '400px',
      data: teacher,
      panelClass: 'custom-modal'
    });
  }
}
