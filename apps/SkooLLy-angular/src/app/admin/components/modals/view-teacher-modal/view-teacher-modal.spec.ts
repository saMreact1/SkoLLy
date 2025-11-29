import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherModal } from './view-teacher-modal';

describe('ViewTeacherModal', () => {
  let component: ViewTeacherModal;
  let fixture: ComponentFixture<ViewTeacherModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeacherModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeacherModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
