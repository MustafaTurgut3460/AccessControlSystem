import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErisimKayitlariComponent } from './erisim-kayitlari.component';

describe('ErisimKayitlariComponent', () => {
  let component: ErisimKayitlariComponent;
  let fixture: ComponentFixture<ErisimKayitlariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErisimKayitlariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErisimKayitlariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
