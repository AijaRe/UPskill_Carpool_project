import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoComponent } from './registo.component';

describe('RegistoComponent', () => {
  let component: RegistoComponent;
  let fixture: ComponentFixture<RegistoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistoComponent]
    });
    fixture = TestBed.createComponent(RegistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
