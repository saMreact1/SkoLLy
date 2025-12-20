import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService, Term } from '../../../core/services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface UpdateTermDialogData {
  sessionId: string;
  term: Term;
}

@Component({
  selector: 'app-update-term-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    NgIf,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
        <h2 mat-dialog-title>
            <mat-icon>edit</mat-icon>
            Update {{ data.term.name }} Term
        </h2>

      <mat-dialog-content>
        <form [formGroup]="termForm">
          <div class="info-box">
            <mat-icon>info</mat-icon>
            <p>Update the start and end dates for this term. The term will be automatically activated.</p>
          </div>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Start Date</mat-label>
            <input 
              matInput 
              [matDatepicker]="startPicker" 
              formControlName="startDate"
              placeholder="Select start date"
            />
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error *ngIf="termForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>End Date</mat-label>
            <input 
              matInput 
              [matDatepicker]="endPicker" 
              formControlName="endDate"
              placeholder="Select end date"
              [min]="termForm.get('startDate')?.value"
            />
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
            <mat-error *ngIf="termForm.get('endDate')?.hasError('required')">
              End date is required
            </mat-error>
            <mat-error *ngIf="termForm.hasError('dateOrder')">
              End date must be after start date
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button 
          mat-flat-button 
          color="primary" 
          (click)="onSubmit()"
          [disabled]="termForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Updating...' : 'Update Term' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #333;

      mat-icon {
        color: #667eea;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    mat-dialog-content {
      padding: 0 24px;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #fff3cd;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #ffc107;

      mat-icon {
        color: #ff9800;
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        color: #856404;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      justify-content: flex-end;
      gap: 8px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
      }
    }
  `]
})
export class UpdateTermDialogComponent implements OnInit {
  termForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateTermDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateTermDialogData
  ) {}

  ngOnInit(): void {
    const currentStartDate = this.data.term.startDate ? new Date(this.data.term.startDate) : '';
    const currentEndDate = this.data.term.endDate ? new Date(this.data.term.endDate) : '';

    this.termForm = this.fb.group({
      startDate: [currentStartDate, Validators.required],
      endDate: [currentEndDate, Validators.required]
    }, { validators: this.dateOrderValidator });
  }

  dateOrderValidator(group: FormGroup): { [key: string]: boolean } | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(start) >= new Date(end)) {
      return { dateOrder: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.termForm.invalid) return;

    this.isSubmitting = true;

    const formValue = this.termForm.value;
    const termData = {
      startDate: this.sessionService.formatDateForBackend(formValue.startDate),
      endDate: this.sessionService.formatDateForBackend(formValue.endDate)
    };

    this.sessionService.updateTerm(this.data.sessionId, this.data.term._id, termData).subscribe({
      next: (res) => {
        this.snack.open(res.message || 'Term updated successfully!', '', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Failed to update term', '', {
          duration: 4000,
          panelClass: ['error-snack']
        });
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}