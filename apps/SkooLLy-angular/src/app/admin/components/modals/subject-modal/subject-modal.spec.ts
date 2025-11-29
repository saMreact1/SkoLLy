import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectModal } from './subject-modal';

describe('SubjectModal', () => {
  let component: SubjectModal;
  let fixture: ComponentFixture<SubjectModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
