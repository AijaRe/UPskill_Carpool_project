import { TestBed } from '@angular/core/testing';

import { EdicaoUtilizadorService } from './edicao-utilizador.service';

describe('EdicaoUtilizadorService', () => {
  let service: EdicaoUtilizadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdicaoUtilizadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
