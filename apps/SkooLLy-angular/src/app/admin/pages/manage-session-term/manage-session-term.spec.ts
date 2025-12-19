import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSessionTerm } from './manage-session-term';

describe('ManageSessionTerm', () => {
  let component: ManageSessionTerm;
  let fixture: ComponentFixture<ManageSessionTerm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSessionTerm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSessionTerm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
