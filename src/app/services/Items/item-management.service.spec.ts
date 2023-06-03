import { TestBed, inject } from '@angular/core/testing';
import { ItemManagementService } from './item-management.service';

describe('ItemManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemManagementService],
    });
  });

  it('should be created', inject(
    [ItemManagementService],
    (service: ItemManagementService) => {
      expect(service).toBeTruthy();
    }
  ));
});
