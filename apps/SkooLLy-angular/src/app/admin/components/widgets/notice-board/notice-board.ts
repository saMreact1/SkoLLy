import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { NoticeService } from '../../../../core/services/notice.service';
import { DatePipe, NgFor } from '@angular/common';
import { Notice } from '../../../../core/models/notice.model';

@Component({
  selector: 'app-notice-board',
  imports: [
    MatCardModule,
    DatePipe,
    NgFor
  ],
  templateUrl: './notice-board.html',
  styleUrl: './notice-board.scss'
})
export class NoticeBoard {
  notices: Notice[] = [];

  constructor(
    private dialog: MatDialog,
    private notice: NoticeService
  ) {}

  ngOnInit() {
    this.notice.notices$.subscribe((data) => {
      this.notices = data;
    });
  }
}
