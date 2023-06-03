import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLocationAttachmentComponent } from './edit-location-attachment.component';

describe('EditLocationAttachmentComponent', () => {
  let component: EditLocationAttachmentComponent;
  let fixture: ComponentFixture<EditLocationAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocationAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
