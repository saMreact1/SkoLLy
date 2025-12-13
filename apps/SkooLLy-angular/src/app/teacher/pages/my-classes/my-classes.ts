import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ViewStudent } from '../../modal/view-student/view-student';

@Component({
  selector: 'app-my-classes',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgFor
  ],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.scss',
})
export class MyClasses {
  classes = [
    {
      name: 'JSS1',
      students: 35,
      subjects: ['Mathematics', 'Basic Science'],
    },
    {
      name: 'JSS2',
      students: 32,
      subjects: ['Mathematics', 'Agricultural Science'],
    },
    {
      name: 'SS1',
      students: 28,
      subjects: ['Physics', 'Further Mathematics'],
    },
  ];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openStudents(classItem: any): void {
    this.dialog.open(ViewStudent, {
      data: {
        className: classItem.name,
        students: [
          { name: 'Sarah Johnson', id: 'ST001', avatar: '' },
          { name: 'Daniel Kwame', id: 'ST002', avatar: '' },
          { name: 'Maryam Yusuf', id: 'ST003', avatar: '' }
        ]
      }
    })
  }
}
