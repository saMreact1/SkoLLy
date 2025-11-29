import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgIf],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
  loading = false;
  apiCallSubscription!: Subscription;

  constructor(
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const cssRule =
      'color: #E70000;' +
      'font-size: 17px;' +
      'text-align: center;' +
      'font-weight: bold;' +
      'text-shadow: 1px 1px 5px #E70000;' +
      'filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);';

    setTimeout(console.info.bind(console, '%cX-Path Teller (ADELEKE SAMUEL)', cssRule), 0);

    // ✅ No nested setTimeout needed
    this.apiCallSubscription = this.loaderService.isLoading.subscribe((isLoading: boolean) => {
      this.loading = isLoading;

      if (isLoading) {
        this.disableUserInput();
      } else {
        this.enableUserInput();
      }

      // ✅ Tell Angular we changed something after the view was checked
      this.cdRef.detectChanges();
    });
  }

  @HostListener('keydown', ['$event'])
  @HostListener('mousedown', ['$event'])
  disableInputEvents(event: KeyboardEvent | MouseEvent) {
    if (this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  disableUserInput() {
    document.body.classList.add('no-scroll');
  }

  enableUserInput() {
    document.body.classList.remove('no-scroll');
  }

  ngOnDestroy() {
    if (this.apiCallSubscription) {
      this.apiCallSubscription.unsubscribe();
    }
  }
}
