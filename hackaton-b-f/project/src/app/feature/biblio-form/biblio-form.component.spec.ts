import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiblioFormComponent } from './biblio-form.component';

describe('BiblioFormComponent', () => {
  let component: BiblioFormComponent;
  let fixture: ComponentFixture<BiblioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiblioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiblioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
