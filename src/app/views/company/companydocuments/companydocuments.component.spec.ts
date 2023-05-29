import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanydocumentsComponent } from './companydocuments.component';

describe('CompanydocumentsComponent', () => {
  let component: CompanydocumentsComponent;
  let fixture: ComponentFixture<CompanydocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanydocumentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanydocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
