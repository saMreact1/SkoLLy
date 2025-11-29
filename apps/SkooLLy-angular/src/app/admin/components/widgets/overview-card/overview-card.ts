import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-overview-card',
  imports: [
    MatIconModule
  ],
  templateUrl: './overview-card.html',
  styleUrl: './overview-card.scss'
})
export class OverviewCard {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() value: string | number = '';
}
