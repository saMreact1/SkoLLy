import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubjects } from './my-subjects';

describe('MySubjects', () => {
  let component: MySubjects;
  let fixture: ComponentFixture<MySubjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySubjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySubjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
