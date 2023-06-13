import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorNoteComponent } from './add-vendor-note.component';

describe('AddVendorNoteComponent', () => {
  let component: AddVendorNoteComponent;
  let fixture: ComponentFixture<AddVendorNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorNoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
