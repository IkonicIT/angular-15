import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompanystatusComponent } from './editcompanystatus.component';

describe('EditcompanystatusComponent', () => {
  let component: EditcompanystatusComponent;
  let fixture: ComponentFixture<EditcompanystatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditcompanystatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcompanystatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
