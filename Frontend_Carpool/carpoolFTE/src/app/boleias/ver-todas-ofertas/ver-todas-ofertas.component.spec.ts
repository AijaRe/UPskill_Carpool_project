import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodasOfertasComponent } from './ver-todas-ofertas.component';

describe('VerTodasOfertasComponent', () => {
  let component: VerTodasOfertasComponent;
  let fixture: ComponentFixture<VerTodasOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerTodasOfertasComponent]
    });
    fixture = TestBed.createComponent(VerTodasOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
