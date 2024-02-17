import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoleiasComponent } from './ofertaBoleias.component';

describe('BoleiasComponent', () => {
  let component: BoleiasComponent;
  let fixture: ComponentFixture<BoleiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoleiasComponent]
    });
    fixture = TestBed.createComponent(BoleiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
