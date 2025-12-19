import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isWarning?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container" [class.warning]="data.isWarning">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.isWarning ? 'warning' : 'help_outline' }}</mat-icon>
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button 
          mat-flat-button 
          [color]="data.isWarning ? 'warn' : 'primary'"
          (click)="onConfirm()"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;

      &.warning {
        h2[mat-dialog-title] mat-icon {
          color: #ff9800;
        }
      }
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
      min-width: 300px;

      p {
        margin: 0;
        color: #555;
        font-size: 16px;
        line-height: 1.6;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})

export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}