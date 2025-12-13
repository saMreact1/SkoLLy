import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { SchoolService } from '../core/services/school.service';

@Component({
  selector: 'app-teacher',
  standalone: false,
  templateUrl: './teacher.html',
  styleUrl: './teacher.scss',
})
export class Teacher implements OnInit {
  backendUrl = 'http://localhost:5000';

  collapsed: boolean = false;
  teacher: any;
  schoolName = '';
  schoolLogo = '';

  loading: boolean = true;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private school: SchoolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.collapsed = window.innerWidth <= 768;

    this.user.user$.subscribe(user => {
      this.teacher = user;
    });

    this.school.getProfile().subscribe({
      next: (profile) => {
        this.schoolName = profile.name;
        this.schoolLogo = `${this.backendUrl}/${profile.logo}`;
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
        this.teacher = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToSettings() {
    this.router.navigate(['/teacher/settings']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed
  }
}
