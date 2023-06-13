import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuserLogComponent } from './viewuser-log.component';

describe('ViewuserLogComponent', () => {
  let component: ViewuserLogComponent;
  let fixture: ComponentFixture<ViewuserLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewuserLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewuserLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
