import { TestBed } from '@angular/core/testing';

import { PerfilUtilizadorService } from './perfil-utilizador.service';

describe('PerfilUtilizadorService', () => {
  let service: PerfilUtilizadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilUtilizadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
