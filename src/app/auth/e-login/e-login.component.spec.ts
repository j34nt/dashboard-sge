import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELoginComponent } from './e-login.component';

describe('ELoginComponent', () => {
  let component: ELoginComponent;
  let fixture: ComponentFixture<ELoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ELoginComponent]
    });
    fixture = TestBed.createComponent(ELoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
