import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoticeService } from '../../../../core/services/notice.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-notice-modal',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatOptionModule,
    CommonModule
  ],
  templateUrl: './add-notice-modal.html',
  styleUrl: './add-notice-modal.scss'
})
export class AddNoticeModal {
  dialogRef = inject(MatDialogRef<AddNoticeModal>);
  fb = inject(FormBuilder);

  tags = ['Urgent', 'Event', 'Reminder'];

  noticeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', [Validators.required]],
    tag: ['', Validators.required]
  });

  save(): void {
    if (this.noticeForm.invalid) return;
    this.dialogRef.close(this.noticeForm.value); // Send notice data back
  }

  cancel(): void {
    this.dialogRef.close();
  }

  get title() {
    return this.noticeForm.get('title');
  }

  get description() {
    return this.noticeForm.get('description');
  }
}
