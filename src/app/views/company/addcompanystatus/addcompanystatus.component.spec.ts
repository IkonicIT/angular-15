import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompanystatusComponent } from './addcompanystatus.component';

describe('AddcompanystatusComponent', () => {
  let component: AddcompanystatusComponent;
  let fixture: ComponentFixture<AddcompanystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddcompanystatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcompanystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
