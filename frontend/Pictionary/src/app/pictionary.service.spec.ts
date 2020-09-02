import { TestBed } from '@angular/core/testing';

import { PictionaryService } from './pictionary.service';

describe('PictionaryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictionaryService = TestBed.get(PictionaryService);
    expect(service).toBeTruthy();
  });
});
