import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompanydocumentsComponent } from './addcompanydocuments.component';

describe('AddcompanydocumentsComponent', () => {
  let component: AddcompanydocumentsComponent;
  let fixture: ComponentFixture<AddcompanydocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddcompanydocumentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcompanydocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
