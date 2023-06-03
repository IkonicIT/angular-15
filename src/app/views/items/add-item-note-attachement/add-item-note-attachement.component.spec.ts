import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemNoteAttachementComponent } from './add-item-note-attachement.component';

describe('AddItemNoteAttachementComponent', () => {
  let component: AddItemNoteAttachementComponent;
  let fixture: ComponentFixture<AddItemNoteAttachementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemNoteAttachementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemNoteAttachementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
