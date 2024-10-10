import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenav } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SortOption } from '../movie-list.types';

@Component({
  selector: 'app-movie-list-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './movie-list-layout.component.html',
  styleUrls: ['./movie-list-layout.component.css', '../../../styles/custom-theme.scss']
})
export class MovieListLayoutComponent {
  @Input() opened: boolean = true;
  @Input() currentSortOption: SortOption = 'year';
  @Input() isAscending: boolean = false;
  @Input() sortOptions: SortOption[] = [];

  @Output() sortChange = new EventEmitter<SortOption>();
  @Output() toggleSortDirection = new EventEmitter<void>();

  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav() {
    this.sidenav.toggle();
  }

  onSortChange(option: SortOption) {
    this.sortChange.emit(option);
  }

  onToggleSortDirection() {
    this.toggleSortDirection.emit();
  }

  getSortOptionDisplay(option: SortOption): string {
    switch (option) {
      case 'year': return 'Year';
      case 'metacritic': return 'Metacritic';
      case 'rottenTomatoes': return 'Rotten Tomatoes';
      case 'imdb': return 'IMDb Rating';
      case 'length': return 'Length';
      case 'title': return 'Title';
      default: return option;
    }
  }
}