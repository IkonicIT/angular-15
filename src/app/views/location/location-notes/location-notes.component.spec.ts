import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNotesComponent } from './location-notes.component';

describe('LocationNotesComponent', () => {
  let component: LocationNotesComponent;
  let fixture: ComponentFixture<LocationNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationNotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
