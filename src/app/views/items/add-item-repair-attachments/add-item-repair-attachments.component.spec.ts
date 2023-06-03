import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemRepairAttachmentsComponent } from './add-item-repair-attachments.component';

describe('AddItemRepairAttachmentsComponent', () => {
  let component: AddItemRepairAttachmentsComponent;
  let fixture: ComponentFixture<AddItemRepairAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemRepairAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemRepairAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
