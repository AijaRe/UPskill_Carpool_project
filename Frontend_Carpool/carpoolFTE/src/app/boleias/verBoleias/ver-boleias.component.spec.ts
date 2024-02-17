import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerBoleiasComponent } from './ver-boleias.component';

describe('VerBoleiasComponent', () => {
  let component: VerBoleiasComponent;
  let fixture: ComponentFixture<VerBoleiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerBoleiasComponent]
    });
    fixture = TestBed.createComponent(VerBoleiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
