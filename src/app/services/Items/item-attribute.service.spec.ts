import { TestBed, inject } from '@angular/core/testing';
import { ItemAttributeService } from './item-attribute.service';

describe('ItemAttributeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemAttributeService],
    });
  });

  it('should be created', inject(
    [ItemAttributeService],
    (service: ItemAttributeService) => {
      expect(service).toBeTruthy();
    }
  ));
});
