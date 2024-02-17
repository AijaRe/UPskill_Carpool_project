import { TestBed } from '@angular/core/testing';

import { OfertaBoleiasService } from './oferta-boleias.service';

describe('OfertaBoleiasService', () => {
  let service: OfertaBoleiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaBoleiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
