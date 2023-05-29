import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompanyattributesComponent } from './addcompanyattributes.component';

describe('AddcompanyattributesComponent', () => {
  let component: AddcompanyattributesComponent;
  let fixture: ComponentFixture<AddcompanyattributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcompanyattributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcompanyattributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
