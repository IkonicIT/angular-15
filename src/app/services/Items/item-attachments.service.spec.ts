import { TestBed, inject } from '@angular/core/testing';
import { ItemAttachmentsService } from './item-attachments.service';

describe('ItemAttachmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemAttachmentsService],
    });
  });

  it('should be created', inject(
    [ItemAttachmentsService],
    (service: ItemAttachmentsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
