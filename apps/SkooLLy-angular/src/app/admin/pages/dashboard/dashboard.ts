import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartWidget } from '../../components/widgets/chart-widget/chart-widget';
import { OverviewCard } from '../../components/widgets/overview-card/overview-card';
import { NoticeBoard } from '../../components/widgets/notice-board/notice-board';
import { AdminOverview } from '../../../core/models/overview.model';
import { AdminService } from '../../../core/services/admin.service';
import { NgChartsModule } from 'ng2-charts';
import { NoticeService } from '../../../core/services/notice.service';
import { Notice } from '../../../core/models/notice.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    ChartWidget,
    OverviewCard,
    NoticeBoard,
    NgChartsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  classLabels: string[] = [];
  classData: number[] = [];

  genderLabels: string[] = [];
  genderData: number[] = [];

  attendanceLabels: string[] = [];
  attendanceData: number[] = [];

  notices: Notice[] = [];


  overview: AdminOverview | any;
  totalStudents = 0;
  totalTeachers = 0;
  attendanceToday = 0;

  constructor(
    private admin: AdminService,
    private notice: NoticeService
  ) {}

  ngOnInit(): void {
    this.admin.getOverview().subscribe({
      next: (data) => {
        this.totalStudents = data.totalStudents;
        this.totalTeachers = data.totalTeachers;
        this.attendanceToday = data.attendanceToday;
      },
      error: (err) => {
        console.error('Error fetching overview', err);
      }
    })

    this.loadNotices();
    this.loadStudentsByClass();
    this.loadGenderDistribution();
    // this.loadWeeklyAttendance();
  }

  loadStudentsByClass() {
    this.admin.getStudentsByClass().subscribe(res => {
      this.classLabels = res.labels;
      this.classData = res.data;
    });
  }

  loadGenderDistribution() {
    this.admin.getGenderDistribution().subscribe(res => {
      this.genderLabels = res.labels;
      this.genderData = res.data;
    });
  }

  loadNotices() {
    this.notice.getNotice()
  }

  // loadWeeklyAttendance() {
  //   this.admin.getWeeklyAttendance().subscribe(res => {
  //     this.attendanceLabels = res.labels;
  //     this.attendanceData = res.data;
  //   });
  // }
}
