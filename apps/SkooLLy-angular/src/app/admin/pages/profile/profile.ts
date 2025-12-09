import { DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.service';
import { EditProfile } from '../../../shared/edit-profile/edit-profile';

@Component({
  selector: 'app-profile',
  imports: [
    NgIf,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  backendUrl = 'http://localhost:5000';

  admin: any;
  loading: boolean = true;

  constructor(
    private user: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user.getUserProfile().subscribe({
      next: (res) => {
        this.admin = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    console.log(this.admin);
    
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfile, {
      width: '90%',
      maxWidth: '500px',
      panelClass: 'custom-dialog-container',
      data: this.admin
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.updateProfile(updated);
      }
    });
  }

  updateProfile(updated: any) {
    this.user.updateProfile(updated).subscribe({
      next: (res: any) => {
        this.admin = res.user;
        console.log("Profile updated:", this.admin);
      },
      error: (err) => {
        console.error("Profile update failed", err);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);

    this.user.uploadProfilePic(formData).subscribe({
      next: (res: any) => {
        this.admin.profilePic = res.profilePic;
        console.log('Updated teacher:', this.admin);
      },
      error: (err) => {
        console.error('Upload failed', err);
      }
    });
  }
}
