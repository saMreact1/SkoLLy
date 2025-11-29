import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoticeModal } from './add-notice-modal';

describe('AddNoticeModal', () => {
  let component: AddNoticeModal;
  let fixture: ComponentFixture<AddNoticeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNoticeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNoticeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
