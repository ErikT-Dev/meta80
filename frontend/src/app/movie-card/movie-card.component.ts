import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { MovieService, Movie } from '../movie.service';
import { MovieDetailsDialogComponent } from '../dialogs/movie-details-dialog/movie-details-dialog.component';
import { MovieCardListsService } from './movie-card-lists.service';
import { MovieCardData } from './movie-card.types';
import { MovieListFilterService } from '../movie-list/movie-list-filter.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent implements OnInit, OnDestroy {
  @Input() movie!: Movie;

  data: MovieCardData = {} as MovieCardData;
  private destroy$ = new Subject<void>();

  constructor(
    public movieService: MovieService,
    private dialog: MatDialog,
    private listService: MovieCardListsService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private movieListFilterService: MovieListFilterService
  ) { }

  ngOnInit() { this.updateListStatuses(); }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateListStatuses() {
    const listStatuses = this.listService.getListsStatuses(this.movie._id);
    this.data = { ...this.data, ...listStatuses };
    this.cdr.markForCheck();
  }

  openMovieDialog(): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '80vw',
      maxWidth: '1000px',
      data: this.movie
    });
  }

  toggleList(event: Event, listType: 'watchlist' | 'seenlist') {
    event.stopPropagation();
    if (!this.listService.isUserLoggedIn()) {
      this.showLoginSnackbar(listType);
      return;
    }

    this.listService.toggleList(this.movie._id, listType).subscribe(
      () => {
        this.updateListStatuses();
      },
      error => console.error(`Error updating ${listType}`, error)
    );
  }

  private showLoginSnackbar(feature: string) {
    this.snackBar.open(`Please log in to use the ${feature} feature`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  toggleDecadeFilter(event: Event) {
    event.stopPropagation();
    const decade = this.getDecade();
    this.movieListFilterService.toggleDecadeFilter(decade);
  }

  toggleGenreFilter(event: Event, genre: string) {
    event.stopPropagation();
    this.movieListFilterService.toggleGenreFilter(genre);
  }

  toggleCountryFilter(event: Event, country: string) {
    event.stopPropagation();
    this.movieListFilterService.toggleCountryFilter(country);
  }

  toggleDirectorFilter(event: Event, director: string) {
    event.stopPropagation();
    this.movieListFilterService.toggleDirectorFilter(director);
  }

  getDecade(): string {
    const year = parseInt(this.movie.omdbData.Year);
    return `${Math.floor(year / 10) * 10}s`;
  }

  getDirectors(): string {
    return this.movie.tmdbData?.directors?.join(', ') || 'N/A';
  }

  getRottenTomatoesRating(): string {
    const rating = this.movie.omdbData?.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    return rating ? rating.Value : 'N/A';
  }

  getProductionCountries(): string[] {
    return this.movie.tmdbData?.production_countries?.map(c => c.name) || ['N/A'];
  }
}