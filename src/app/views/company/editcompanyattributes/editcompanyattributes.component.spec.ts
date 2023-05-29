import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompanyattributesComponent } from './editcompanyattributes.component';

describe('EditcompanyattributesComponent', () => {
  let component: EditcompanyattributesComponent;
  let fixture: ComponentFixture<EditcompanyattributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditcompanyattributesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcompanyattributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
