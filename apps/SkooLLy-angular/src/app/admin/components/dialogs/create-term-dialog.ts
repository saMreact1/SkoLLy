import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../core/services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-term-dialog',
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
        <mat-icon>event_note</mat-icon>
        Create New Term
      </h2>

      <mat-dialog-content>
        <form [formGroup]="termForm">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Term Name</mat-label>
            <mat-select formControlName="name">
              <mat-option value="FIRST">First Term</mat-option>
              <mat-option value="SECOND">Second Term</mat-option>
              <mat-option value="THIRD">Third Term</mat-option>
            </mat-select>
            <mat-error *ngIf="termForm.get('name')?.hasError('required')">
              Term name is required
            </mat-error>
          </mat-form-field>

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

          <div class="info-box">
            <mat-icon>info</mat-icon>
            <p>Creating a new term will automatically deactivate any currently active terms.</p>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button 
          mat-flat-button 
          color="primary" 
          (click)="onSubmit()"
          [disabled]="termForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create Term' }}
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
      background: #e3f2fd;
      border-radius: 8px;
      margin-top: 8px;
      border-left: 4px solid #2196f3;

      mat-icon {
        color: #2196f3;
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        color: #555;
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
export class CreateTermDialogComponent implements OnInit {
  termForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTermDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sessionId: string }
  ) {}

  ngOnInit(): void {
    this.termForm = this.fb.group({
      name: ['FIRST', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
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
      name: formValue.name,
      startDate: this.sessionService.formatDateForBackend(formValue.startDate),
      endDate: this.sessionService.formatDateForBackend(formValue.endDate),
      sessionId: this.data.sessionId
    };

    this.sessionService.createTerm(termData).subscribe({
      next: (res) => {
        this.snack.open(res.message, '', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Failed to create term', '', {
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