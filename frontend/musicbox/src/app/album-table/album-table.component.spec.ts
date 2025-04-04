import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumTableComponent } from './album-table.component';

describe('AlbumTableComponent', () => {
  let component: AlbumTableComponent;
  let fixture: ComponentFixture<AlbumTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
