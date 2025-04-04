import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTableComponent } from './artist-table.component';

describe('ArtistTableComponent', () => {
  let component: ArtistTableComponent;
  let fixture: ComponentFixture<ArtistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
