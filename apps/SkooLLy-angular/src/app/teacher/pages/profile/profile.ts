import { Component } from '@angular/core';
import { EditProfile } from '../../../shared/edit-profile/edit-profile';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  styleUrl: './profile.scss',
})
export class Profile {
  backendUrl = 'http://localhost:5000';
  
    teacher: any;
    loading: boolean = true;
  
    constructor(
      private user: UserService,
      private dialog: MatDialog
    ) {}
  
    ngOnInit(): void {
      this.user.getUserProfile().subscribe({
        next: (res) => {
          this.teacher = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  
      console.log(this.teacher);
      
    }
  
    editProfile() {
      const dialogRef = this.dialog.open(EditProfile, {
        width: '90%',
        maxWidth: '500px',
        panelClass: 'custom-dialog-container',
        data: this.teacher
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
          this.teacher = res.user;
          this.user.setUser(this.teacher);
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
          this.teacher.profilePic = res.profilePic;
          this.user.setUser(this.teacher);
          console.log('Updated teacher:', this.teacher);
        },
        error: (err) => {
          console.error('Upload failed', err);
        }
      });
    }
}
