import { TestBed } from '@angular/core/testing';

import { RegistoService } from './registo.service';

describe('RegistoService', () => {
  let service: RegistoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
