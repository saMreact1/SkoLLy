import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceModal } from './view-invoice-modal';

describe('ViewInvoiceModal', () => {
  let component: ViewInvoiceModal;
  let fixture: ComponentFixture<ViewInvoiceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvoiceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInvoiceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
