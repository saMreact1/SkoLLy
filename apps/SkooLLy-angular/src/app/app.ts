import { Component, OnInit, signal } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('client');

  ngOnInit(): void {
    AOS.init({
      duration: 1000,
      once: true // animation happens only once
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }
}
