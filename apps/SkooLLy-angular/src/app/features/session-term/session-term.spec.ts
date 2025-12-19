import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTerm } from './session-term';

describe('SessionTerm', () => {
  let component: SessionTerm;
  let fixture: ComponentFixture<SessionTerm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTerm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTerm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
