import { TestBed, inject } from '@angular/core/testing';
import { ItemTypesService } from './item-types.service';

describe('ItemTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemTypesService],
    });
  });

  it('should be created', inject(
    [ItemTypesService],
    (service: ItemTypesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
