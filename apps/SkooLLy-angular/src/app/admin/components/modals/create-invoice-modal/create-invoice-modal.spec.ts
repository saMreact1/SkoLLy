import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceModal } from './create-invoice-modal';

describe('CreateInvoiceModal', () => {
  let component: CreateInvoiceModal;
  let fixture: ComponentFixture<CreateInvoiceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInvoiceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInvoiceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
