import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from '../core/services/school.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  backendUrl = 'http://localhost:5000';

  collapsed: boolean = false;
  admin: any;
  schoolName = '';
  schoolLogo = '';

  loading: boolean = true;

  constructor(
    private router: Router,
    private school: SchoolService,
    private user: UserService,
  ) {}

  ngOnInit(): void {
    this.collapsed = window.innerWidth <= 768;

    this.user.user$.subscribe(user => {
      this.admin = user;
    });

    this.school.getProfile().subscribe({
      next: (profile) => {
        this.schoolName = profile.name;
        this.schoolLogo = `${this.backendUrl}${profile.logo}`;
      },
      error: (err) => {
        console.log('Failed to load profile', err);
      }
    })

    this.getUser();
  }

  getUser() {
    this.user.getUserProfile().subscribe({
      next: (res) => {
        this.admin = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed
  }

  goToSettings() {
    this.router.navigate(['/admin/profile'])
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
