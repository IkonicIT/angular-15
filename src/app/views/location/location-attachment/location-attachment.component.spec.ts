import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationAttachmentComponent } from './location-attachment.component';

describe('LocationAttachmentComponent', () => {
  let component: LocationAttachmentComponent;
  let fixture: ComponentFixture<LocationAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationAttachmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
