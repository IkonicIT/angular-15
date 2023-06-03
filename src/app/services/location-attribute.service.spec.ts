import { TestBed, inject } from '@angular/core/testing';
import { LocationAttributeService } from './location-attribute.service';

describe('LocationAttributeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationAttributeService],
    });
  });

  it('should be created', inject(
    [LocationAttributeService],
    (service: LocationAttributeService) => {
      expect(service).toBeTruthy();
    }
  ));
});
