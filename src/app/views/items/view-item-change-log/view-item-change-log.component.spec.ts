import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemChangeLogComponent } from './view-item-change-log.component';

describe('ViewItemChangeLogComponent', () => {
  let component: ViewItemChangeLogComponent;
  let fixture: ComponentFixture<ViewItemChangeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewItemChangeLogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
