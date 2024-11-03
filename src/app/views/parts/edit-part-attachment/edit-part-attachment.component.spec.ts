import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartAttachmentComponent } from './edit-part-attachment.component';

describe('EditVendorAttachmentComponent', () => {
  let component: EditPartAttachmentComponent;
  let fixture: ComponentFixture<EditPartAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPartAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
