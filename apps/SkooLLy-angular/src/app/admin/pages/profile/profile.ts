import { DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileModal } from '../../components/modals/edit-profile-modal/edit-profile-modal';
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
  styleUrl: './profile.scss'
})
export class Profile {
  backendUrl = 'http://localhost:5000';

  admin: any;
  loading: boolean = true;

  constructor(
    // private user: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.user.getUserProfile().subscribe({
    //   next: (res) => {
    //     this.admin = res;
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //   }
    // });
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileModal, {
      width: '90%',
      maxWidth: '500px',
      panelClass: 'custom-dialog-container',
    });

    // dialogRef.componentInstance.profileUpdated.subscribe((formData: FormData) => {
    //   this.user.updateProfile(formData).subscribe((res) => {
    //     this.admin = res;
    //   })
    // })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);

    // this.user.uploadProfilePic(formData).subscribe({
    //   next: (res: any) => {
    //     this.admin.profilePic = res.profilePic; // ✅ use res.profilePic
    //     console.log('Updated teacher:', this.admin);
    //   },
    //   error: (err) => {
    //     console.error('Upload failed', err);
    //   }
    // });
  }
}
