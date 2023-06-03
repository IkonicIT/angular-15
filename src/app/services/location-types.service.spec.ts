import { TestBed, inject } from '@angular/core/testing';
import { LocationTypesService } from './location-types.service';

describe('LocationTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationTypesService],
    });
  });

  it('should be created', inject(
    [LocationTypesService],
    (service: LocationTypesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
