import { TestBed } from '@angular/core/testing';

import { PaginaServiceService } from './pagina-service.service';

describe('PaginaServiceService', () => {
  let service: PaginaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
