import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KartlarComponent } from './kartlar.component';

describe('KartlarComponent', () => {
  let component: KartlarComponent;
  let fixture: ComponentFixture<KartlarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KartlarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KartlarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
