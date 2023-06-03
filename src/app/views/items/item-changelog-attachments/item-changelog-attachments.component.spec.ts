import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemChangelogAttachmentsComponent } from './item-changelog-attachments.component';

describe('ItemChangelogAttachmentsComponent', () => {
  let component: ItemChangelogAttachmentsComponent;
  let fixture: ComponentFixture<ItemChangelogAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemChangelogAttachmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemChangelogAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
