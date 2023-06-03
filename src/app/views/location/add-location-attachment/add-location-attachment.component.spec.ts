import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLocationAttachmentComponent } from './add-location-attachment.component';

describe('AddLocationAttachmentComponent', () => {
  let component: AddLocationAttachmentComponent;
  let fixture: ComponentFixture<AddLocationAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
