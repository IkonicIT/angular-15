import { TestBed, inject } from '@angular/core/testing';
import { ItemServiceManagementService } from './item-service-management.service';

describe('ItemServiceManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemServiceManagementService],
    });
  });

  it('should be created', inject(
    [ItemServiceManagementService],
    (service: ItemServiceManagementService) => {
      expect(service).toBeTruthy();
    }
  ));
});
