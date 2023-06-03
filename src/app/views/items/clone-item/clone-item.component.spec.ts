import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CloneItemComponent } from './clone-item.component';

describe('CloneItemComponent', () => {
  let component: CloneItemComponent;
  let fixture: ComponentFixture<CloneItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloneItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
