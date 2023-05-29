import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompanydocumentComponent } from './editcompanydocument.component';

describe('EditcompanydocumentComponent', () => {
  let component: EditcompanydocumentComponent;
  let fixture: ComponentFixture<EditcompanydocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditcompanydocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcompanydocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
