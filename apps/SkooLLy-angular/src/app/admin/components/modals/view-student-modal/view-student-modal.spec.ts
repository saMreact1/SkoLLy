import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentModal } from './view-student-modal';

describe('ViewStudentModal', () => {
  let component: ViewStudentModal;
  let fixture: ComponentFixture<ViewStudentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
