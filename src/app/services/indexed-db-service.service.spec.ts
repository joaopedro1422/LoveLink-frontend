import { TestBed } from '@angular/core/testing';

import { IndexedDbServiceService } from './indexed-db-service.service';

describe('IndexedDbServiceService', () => {
  let service: IndexedDbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
