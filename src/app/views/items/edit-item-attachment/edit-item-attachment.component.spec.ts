import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemAttachmentComponent } from './edit-item-attachment.component';

describe('EditItemAttachmentComponent', () => {
  let component: EditItemAttachmentComponent;
  let fixture: ComponentFixture<EditItemAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
