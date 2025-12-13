import { Component } from '@angular/core';
import { ViewStudent } from '../../modal/view-student/view-student';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-my-subjects',
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgFor
  ],
  templateUrl: './my-subjects.html',
  styleUrl: './my-subjects.scss',
})
export class MySubjects {
  subjects = [
    {
      name: 'Mathematics',
      class: 'JS1',
      code: 'MTH101',
      totalStudents: 28
    },
    {
      name: 'Physics',
      class: 'JS3',
      code: 'PHY301',
      totalStudents: 30
    },
    {
      name: 'Chemistry',
      class: 'SS1',
      code: 'CHM401',
      totalStudents: 26
    }
  ];

  constructor(
      private dialog: MatDialog
    ) {}

  viewStudents(subject: any) {
    this.dialog.open(ViewStudent, {
      width: '600px',
      data: {
        subjectName: subject.name,
        className: subject.class,
        students: [
          { name: 'John Doe', id: 'ST001', avatar: '' },
          { name: 'Jane Smith', id: 'ST002', avatar: '' },
          { name: 'Alice Johnson', id: 'ST003', avatar: '' }
        ]
      }
    })
    console.log('View Students:', subject);
  }

  viewResources(subject: any) {
    console.log('Resources for:', subject);
  }
}
