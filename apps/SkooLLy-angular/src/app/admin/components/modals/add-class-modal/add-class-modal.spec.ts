import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassModal } from './add-class-modal';

describe('AddClassModal', () => {
  let component: AddClassModal;
  let fixture: ComponentFixture<AddClassModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClassModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClassModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
