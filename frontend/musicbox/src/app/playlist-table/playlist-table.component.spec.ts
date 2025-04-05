import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistTableComponent } from './playlist-table.component';

describe('PlaylistTableComponent', () => {
  let component: PlaylistTableComponent;
  let fixture: ComponentFixture<PlaylistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
