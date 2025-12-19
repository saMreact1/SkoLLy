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
import { MatDialog } from '@angular/material/dialog';
import { SessionTerm } from '../../../features/session-term/session-term';
import { SessionService } from '../../../core/services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    ChartWidget,
    OverviewCard,
    NoticeBoard,
    NgChartsModule,
    MatIconModule,
    MatButtonModule,
    NgIf
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

  hasActiveSession = false;
  currentSession = '';
  currentTerm = '';

  overview: AdminOverview | any;
  totalStudents = 0;
  totalTeachers = 0;
  attendanceToday = 0;

  constructor(
    private admin: AdminService,
    private notice: NoticeService,
    private sessionService: SessionService,
    private dialog: MatDialog
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

    this.checkActiveSession()
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

  checkActiveSession(): void {
    this.sessionService.getCurrentSession().subscribe({
      next: (res) => {
        this.hasActiveSession = true;
        this.currentSession = res.session; // "2024/2025"
        this.loadCurrentTerm();
      },
      error: (err) => {
        this.hasActiveSession = false;
        // Auto-open modal for new admins only if error is 404
        if (err.status === 404) {
          setTimeout(() => this.openSessionSetup(), 1000);
        }
      }
    });
  }

  loadCurrentTerm(): void {
    this.sessionService.getCurrentTerm().subscribe({
      next: (res) => {
        this.currentTerm = res.term; // "FIRST", "SECOND", or "THIRD"
      },
      error: () => {
        this.currentTerm = '';
      }
    });
  }

  openSessionSetup(): void {
    const dialogRef = this.dialog.open(SessionTerm, {
      maxWidth: '85vw',
      maxHeight: '90vh',
      disableClose: !this.hasActiveSession, // Force completion if no session
      panelClass: 'session-setup-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.completed) {
        this.checkActiveSession(); // Refresh session status
      }
    });
  }
}
