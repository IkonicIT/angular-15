import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNoteAttachmentsComponent } from './location-note-attachments.component';

describe('LocationNoteAttachmentsComponent', () => {
  let component: LocationNoteAttachmentsComponent;
  let fixture: ComponentFixture<LocationNoteAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationNoteAttachmentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationNoteAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
