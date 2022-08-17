import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErisimNoktalariComponent } from './erisim-noktalari.component';

describe('ErisimNoktalariComponent', () => {
  let component: ErisimNoktalariComponent;
  let fixture: ComponentFixture<ErisimNoktalariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErisimNoktalariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErisimNoktalariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
