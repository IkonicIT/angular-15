import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemAttachmentComponent } from './add-item-attachment.component';

describe('AddItemAttachmentComponent', () => {
  let component: AddItemAttachmentComponent;
  let fixture: ComponentFixture<AddItemAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
