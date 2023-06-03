import { TestBed, inject } from '@angular/core/testing';
import { ItemRepairItemsService } from './item-repair-items.service';

describe('ItemRepairItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemRepairItemsService],
    });
  });

  it('should be created', inject(
    [ItemRepairItemsService],
    (service: ItemRepairItemsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
