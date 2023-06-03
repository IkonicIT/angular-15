import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRepairsComponent } from './view-all-repairs.component';

describe('ViewAllRepairsComponent', () => {
  let component: ViewAllRepairsComponent;
  let fixture: ComponentFixture<ViewAllRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllRepairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
