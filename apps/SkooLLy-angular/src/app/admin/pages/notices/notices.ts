import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NoticeService } from '../../../core/services/notice.service';
import { AddNoticeModal } from '../../components/modals/add-notice-modal/add-notice-modal';
import { Notice } from '../../../core/models/notice.model';

@Component({
  selector: 'app-notices',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    NgClass,
    NgFor,
    NgIf,
    DatePipe
  ],
  templateUrl: './notices.html',
  styleUrl: './notices.scss'
})
export class Notices {
  notices: Notice[] = [];


  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private notice: NoticeService
  ) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.notice.getNotice();
    this.notice.notices$.subscribe((data) => {
      this.notices = data;
    })
  }

  addNotice() {
    const dialogRef = this.dialog.open(AddNoticeModal, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((newNotice) => {
      if (newNotice) {
        const noticeToAdd = {
          ...newNotice,
          date: new Date().toISOString()
        };
        this.notice.createNotice(noticeToAdd).subscribe({
          next: (createdNotice) => {
            this.notices.unshift(createdNotice);
            this.snack.open('Notice added', 'Close', { duration: 3000 });
          },
          error: () => this.snack.open('Failed to add notice', 'Close', { duration: 3000 })
        });
      }
    });
  }

  onNoticeUpdated(index: number) {
    const updated = this.notices[index];
    if (!updated._id) return;

    this.notice.updateNotice(updated._id, updated).subscribe({
      next: () => this.snack.open('Notice updated', 'Close', { duration: 3000 }),
      error: () => this.snack.open('Failed to update notice', 'Close', { duration: 3000 }),
    });
  }

  confirmDeleteNotice(id: string) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Notice',
        message: 'Are you sure you want to delete this notice?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.notice.deleteNotice(id).subscribe(() => {
          this.notices = this.notices.filter(n => n._id !== id);
        });
        this.snack.open('Notice deleted', 'Close', { duration: 3000 });
      }
    });
  }
}
