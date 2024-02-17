import { TestBed } from '@angular/core/testing';

import { VerOfertasBoleiasService } from './ver-ofertas-boleias.service';

describe('VerOfertasBoleiasService', () => {
  let service: VerOfertasBoleiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerOfertasBoleiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
