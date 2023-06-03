import { TestBed, inject } from '@angular/core/testing';
import { LocationAttachmentsService } from './location-attachments.service';

describe('LocationAttachmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationAttachmentsService],
    });
  });

  it('should be created', inject(
    [LocationAttachmentsService],
    (service: LocationAttachmentsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
