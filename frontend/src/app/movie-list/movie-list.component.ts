import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { SortOptionDisplayPipe } from "../pipes/sort-option-display.pipe";
import { MovieListService } from './movie-list.service';
import { MovieListFilterService } from './movie-list-filter.service';
import { MovieListAuthService } from './movie-list-auth.service';
import { SortOption, MovieListState } from './movie-list.types';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MovieListToolbarComponent } from './movie-list-toolbar/movie-list-toolbar.component';
import { MovieListLayoutComponent } from './movie-list-layout/movie-list-layout.component'

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MovieCardComponent,
    MatGridListModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatSelectModule,
    MatMenuModule,
    SortOptionDisplayPipe,
    MatSlideToggleModule,
    MatFormFieldModule,
    MovieListToolbarComponent,
    MovieListLayoutComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent implements OnInit, OnDestroy {
  @ViewChild(MovieListLayoutComponent) layout!: MovieListLayoutComponent;
  state: MovieListState;
  private destroy$ = new Subject<void>();

  constructor(
    private movieListService: MovieListService,
    private filterService: MovieListFilterService,
    private authService: MovieListAuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.state = this.movieListService.getInitialState();
  }

  ngOnInit() {
    this.setupSubscriptions();
    this.movieListService.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav() {
    this.layout.toggleSidenav();
  }

  private setupSubscriptions() {
    this.movieListService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        this.cdr.markForCheck();
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.state.currentUser = user;
        this.cdr.markForCheck();
      });
  }

  openLoginDialog() {
    this.authService.openLoginDialog();
  }

  openRegisterDialog() {
    this.authService.openRegisterDialog();
  }

  logout() {
    this.authService.logout();
  }

  toggleSeenlistFilter() {
    this.filterService.toggleSeenlistFilter();
  }

  toggleWatchlistFilter() {
    this.filterService.toggleWatchlistFilter();
  }

  toggleDocumentaries() {
    this.filterService.toggleDocumentaries();
  }

  toggleDecadeFilter(decade: string) {
    this.filterService.toggleDecadeFilter(decade);
  }

  toggleGenreFilter(genre: string) {
    this.filterService.toggleGenreFilter(genre);
  }

  toggleSortDirection() {
    this.movieListService.toggleSortDirection();
  }

  toggleCountryFilter(country: string) {
    this.filterService.toggleCountryFilter(country);
  }

  toggleDirectorFilter(director: string) {
    this.filterService.toggleDirectorFilter(director);
  }

  removeDecade() {
    this.filterService.removeDecade();
  }

  removeGenre(genre: string) {
    this.filterService.removeGenre(genre);
  }

  removeCountry(country: string) {
    this.filterService.removeCountry(country);
  }

  removeDirector(director: string) {
    this.filterService.removeDirector(director);
  }

  clearAllFilters() {
    this.filterService.clearAllFilters();
  }

  loadNextPage() {
    this.movieListService.loadNextPage();
  }

  loadPreviousPage() {
    this.movieListService.loadPreviousPage();
  }

  onSortChange(option: SortOption) {
    this.movieListService.onSortChange(option);
  }

  getSortOptionDisplay(option: SortOption): string {
    return this.movieListService.getSortOptionDisplay(option);
  }
}