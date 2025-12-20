import { Component, OnInit } from '@angular/core';
import { Session, SessionService, Term } from '../../../core/services/session.service';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { CreateTermDialogComponent } from '../../components/dialogs/create-term-dialog';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpdateTermDialogComponent } from '../../components/dialogs/update-term-dialog';


@Component({
  selector: 'app-manage-session-term',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgIf,
    NgFor,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-session-term.html',
  styleUrl: './manage-session-term.scss',
})
export class ManageSessionTerm implements OnInit {
  isLoading = true;
  hasActiveSession = false;
  currentSession: Session | null = null;
  allSessions: Session[] = [];

  constructor(
    private sessionService: SessionService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    
    this.sessionService.getCurrentSessionWithTerms().subscribe({
      next: (session) => {
        this.currentSession = session;
        this.hasActiveSession = true;
        this.loadAllSessions();
      },
      error: () => {
        this.hasActiveSession = false;
        this.loadAllSessions();
      }
    });
  }

  loadAllSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        this.allSessions = sessions;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  createNewSession(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Create New Session',
        message: 'Are you sure you want to create a new session? This will automatically use the current year.',
        confirmText: 'Create',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.sessionService.createSession().subscribe({
          next: (res) => {
            this.snack.open(res.message, '', {
              duration: 3000,
              panelClass: ['success-snack']
            });
            this.loadSessions();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Failed to create session', '', {
              duration: 3000,
              panelClass: ['error-snack']
            });
          }
        });
      }
    });
  }

  openCreateTermDialog(sessionId: string): void {
    const dialogRef = this.dialog.open(CreateTermDialogComponent, {
      width: '500px',
      data: { sessionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSessions();
      }
    });
  }

  openUpdateTermDialog(term: Term): void {
    if (!this.currentSession) return;

    const dialogRef = this.dialog.open(UpdateTermDialogComponent, {
      width: '500px',
      data: { 
        sessionId: this.currentSession._id,
        term: term
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSessions();
      }
    });
  }

  closeSession(sessionId: string, sessionName: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Close Session',
        message: `Are you sure you want to close ${sessionName}? This will deactivate all terms and cannot be undone.`,
        confirmText: 'Close Session',
        cancelText: 'Cancel',
        isWarning: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.sessionService.closeSession(sessionId).subscribe({
          next: (res) => {
            this.snack.open(res.message, '', {
              duration: 3000,
              panelClass: ['success-snack']
            });
            this.loadSessions();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Failed to close session', '', {
              duration: 3000,
              panelClass: ['error-snack']
            });
          }
        });
      }
    });
  }

  viewSessionDetails(session: Session): void {
    console.log('View session details:', session);
  }

  formatDate(date: string | Date): string {
    return this.sessionService.formatDateForDisplay(date);
  }

  getActiveTermName(): string {
    if (!this.currentSession?.terms) return 'None';
    const activeTerm = this.currentSession.terms.find(t => t.isActive);
    return activeTerm ? activeTerm.name : 'None';
  }
}
