import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  backendUrl = 'http://localhost:5000';

  editForm: FormGroup;
  preview: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProfile>
  ) {
    this.editForm = this.fb.group({
      fullName: [data.fullName],
      email: [data.email],
      phone: [data.phone],
      gender: [data.gender],
      address: [data.address],
      bio: [data.bio],
    });
  }

  get profilePicUrl() {
    return this.preview || (this.data.profilePic ? this.backendUrl + this.data.profilePic : 'assets/images/profile_picture.png');
  }

  onFileChange(ev: any) {
    const file = ev.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result as string);
    reader.readAsDataURL(file);
  }

  save() {
    const formValues = this.editForm.value;

    const fileInput = (document.getElementById('editPic') as HTMLInputElement).files?.[0];
    let payload: any;

    if(fileInput) {
      payload = new FormData();
      Object.keys(formValues).forEach(key => payload.append(key, formValues[key]));
      payload.append('profilePic', fileInput);
    } else {
      payload = formValues;
    }

    this.dialogRef.close(payload);
  }
}
