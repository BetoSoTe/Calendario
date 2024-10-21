import { TestBed } from '@angular/core/testing';

import { HorariosClasesService } from './horarios-clases.service';

describe('HorariosClasesService', () => {
  let service: HorariosClasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorariosClasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
