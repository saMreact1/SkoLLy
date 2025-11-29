import { NgxTypedJsModule } from 'ngx-typed-js';
import { NgIf } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import AOS from 'aos';
import Typed from 'typed.js'
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [
    NgxTypedJsModule,
    MatIconModule,
    MatButtonModule,
    Header,
    Footer,
    RouterModule
  ]
})
export class HomeComponent implements AfterViewInit {
  showTyped: boolean = true;

  ngAfterViewInit() {
    AOS.init(); // init AOS after DOM is ready

    const options = {
      strings: ['automate admin.', 'manage students.', 'track performance.', ' simplify school tasks.'],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true
    };

    new Typed('.typing-element', options)
  }
}
