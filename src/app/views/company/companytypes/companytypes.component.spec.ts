import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanytypesComponent } from './companytypes.component';

describe('CompanytypesComponent', () => {
  let component: CompanytypesComponent;
  let fixture: ComponentFixture<CompanytypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanytypesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanytypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
