import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemRepairAttachmentsComponent } from './edit-item-repair-attachments.component';

describe('EditItemRepairAttachmentsComponent', () => {
  let component: EditItemRepairAttachmentsComponent;
  let fixture: ComponentFixture<EditItemRepairAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditItemRepairAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRepairAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
