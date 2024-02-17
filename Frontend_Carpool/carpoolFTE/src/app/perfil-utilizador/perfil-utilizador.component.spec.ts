import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUtilizadorComponent } from './perfil-utilizador.component';

describe('PerfilUtilizadorComponent', () => {
  let component: PerfilUtilizadorComponent;
  let fixture: ComponentFixture<PerfilUtilizadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilUtilizadorComponent]
    });
    fixture = TestBed.createComponent(PerfilUtilizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
