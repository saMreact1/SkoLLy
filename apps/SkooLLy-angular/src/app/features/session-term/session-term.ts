import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { SessionService } from '../../core/services/session.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-session-term',
  imports: [
    MatIconModule,
    MatDialogContent,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
    MatDatepickerModule,
    MatDialogActions,
    ReactiveFormsModule
  ],
  templateUrl: './session-term.html',
  styleUrl: './session-term.scss',
})
export class SessionTerm {
  termForm!: FormGroup;
  currentSessionName = '';
  createdSessionId = '';
  sessionCreated = false;
  termCreated = false;
  isCreatingSession = false;
  isCreatingTerm = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<SessionTerm>
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.currentSessionName = `${currentYear}/${currentYear + 1}`;

    this.termForm = this.fb.group({
      name: ['FIRST', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  createSession(): void {
    this.isCreatingSession = true;

    this.sessionService.createSession().subscribe({
      next: (res) => {
        this.sessionCreated = true;
        this.createdSessionId = res.session._id;
        this.snack.open(res.message || 'Session created successfully!', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        this.isCreatingSession = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to create session';
        this.snack.open(errorMessage, '', {
          duration: 4000,
          panelClass: ['white-bg-snack']
        });
        this.isCreatingSession = false;
      }
    });
  }

  createTerm(): void {
    if (this.termForm.invalid) return;

    this.isCreatingTerm = true;

    const formValue = this.termForm.value;
    const termData = {
      name: formValue.name,
      startDate: this.sessionService.formatDateForBackend(formValue.startDate),
      endDate: this.sessionService.formatDateForBackend(formValue.endDate),
      sessionId: this.createdSessionId
    };

    this.sessionService.createTerm(termData).subscribe({
      next: (res) => {
        this.termCreated = true;
        this.snack.open(res.message || 'Term created successfully!', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        this.isCreatingTerm = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to create term';
        this.snack.open(errorMessage, '', {
          duration: 4000,
          panelClass: ['white-bg-snack']
        });
        this.isCreatingTerm = false;
      }
    });
  }

  formatDateForBackend(date: Date): string {
    return this.sessionService.formatDateForBackend(date);
  }

  formatDate(date: Date): string {
    return this.sessionService.formatDateForDisplay(date);
  }

  skipSetup(): void {
    this.dialogRef.close({ skipped: true });
  }

  closeModal(): void {
    this.dialogRef.close({ completed: true });
  }
}