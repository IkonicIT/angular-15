import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemAttachmentsComponent } from './item-attachments.component';

describe('ItemAttachmentsComponent', () => {
  let component: ItemAttachmentsComponent;
  let fixture: ComponentFixture<ItemAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
