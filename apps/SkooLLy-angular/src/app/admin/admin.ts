import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from '../core/services/school.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  backendUrl = 'http://localhost:5000/uploads/logos';

  collapsed: boolean = false;
  user: any;
  schoolName = '';
  schoolLogo = '';

  constructor(
    private router: Router,
    private school: SchoolService
  ) {}

  ngOnInit(): void {
    this.collapsed = window.innerWidth <= 768;
    this.school.getProfile().subscribe({
      next: (profile) => {
        this.schoolName = profile.name;
        this.schoolLogo = `${this.backendUrl}/${profile.logo}`;
      },
      error: (err) => {
        console.log('Failed to load profile', err);
      }
    })
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
