import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartAttachmentComponent } from './add-part-attachment.component';

describe('AddPartAttachmentComponent', () => {
  let component: AddPartAttachmentComponent;
  let fixture: ComponentFixture<AddPartAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPartAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
