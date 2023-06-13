import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorNoteComponent } from './edit-vendor-note.component';

describe('EditVendorNoteComponent', () => {
  let component: EditVendorNoteComponent;
  let fixture: ComponentFixture<EditVendorNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditVendorNoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
