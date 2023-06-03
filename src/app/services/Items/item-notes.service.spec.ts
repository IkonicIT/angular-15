import { TestBed, inject } from '@angular/core/testing';
import { ItemNotesService } from './item-notes.service';

describe('ItemNotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemNotesService],
    });
  });

  it('should be created', inject(
    [ItemNotesService],
    (service: ItemNotesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
