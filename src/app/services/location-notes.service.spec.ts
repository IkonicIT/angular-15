import { TestBed, inject } from '@angular/core/testing';
import { LocationNotesService } from './location-notes.service';

describe('LocationNotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationNotesService],
    });
  });

  it('should be created', inject(
    [LocationNotesService],
    (service: LocationNotesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
