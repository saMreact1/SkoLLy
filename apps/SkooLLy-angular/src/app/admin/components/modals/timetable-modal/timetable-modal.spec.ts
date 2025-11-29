import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableModal } from './timetable-modal';

describe('TimetableModal', () => {
  let component: TimetableModal;
  let fixture: ComponentFixture<TimetableModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
