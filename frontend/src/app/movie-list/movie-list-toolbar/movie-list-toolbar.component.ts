import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonToggleModule
  ],
  templateUrl: './movie-list-toolbar.component.html',
  styleUrls: ['./movie-list-toolbar.component.css', '../../../styles/custom-theme.scss']
})
export class MovieListToolbarComponent implements OnInit, OnDestroy {

  isSmallScreen$: Observable<boolean>;
  isSmallPhone$: Observable<boolean>;
  private destroy$ = new Subject<void>();
  private smallScreenBreakpoint = '(max-width: 810px)';
  private smallPhoneBreakpoint = '(max-width: 600px)';
  isSidenavOpen = false;

  @Input() currentUser: any = null;
  @Input() isWatchlistFilter: boolean = false;
  @Input() isSeenlistFilter: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalMovies: number = 0;
  @Input() selectedDecade: string | null = null;
  @Input() selectedGenres: string[] = [];
  @Input() showDocumentaries: boolean = false;
  @Input() selectedCountries: string[] = [];
  @Input() selectedDirectors: string[] = [];

  @Output() onDocumentariesToggle = new EventEmitter<void>();
  @Output() onLoginClick = new EventEmitter<void>();
  @Output() onRegisterClick = new EventEmitter<void>();
  @Output() onLogoutClick = new EventEmitter<void>();
  @Output() onWatchlistToggle = new EventEmitter<void>();
  @Output() onSeenlistToggle = new EventEmitter<void>();
  @Output() onPreviousPage = new EventEmitter<void>();
  @Output() onNextPage = new EventEmitter<void>();
  @Output() onRemoveDecade = new EventEmitter<void>();
  @Output() onRemoveGenre = new EventEmitter<string>();
  @Output() onRemoveCountry = new EventEmitter<string>();
  @Output() onRemoveDirector = new EventEmitter<string>();
  @Output() onClearAllFilters = new EventEmitter<void>();
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isSmallPhone$ = this.breakpointObserver
      .observe(this.smallPhoneBreakpoint)
      .pipe(
        takeUntil(this.destroy$),
        map((state: BreakpointState) => state.matches)
      );

    this.isSmallScreen$ = this.breakpointObserver
      .observe(this.smallScreenBreakpoint)
      .pipe(
        takeUntil(this.destroy$),
        map((state: BreakpointState) => state.matches)
      );


  }

  ngOnInit() {
    // Additional initialization if needed
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.toggleSidenav.emit();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedDecade ||
      this.selectedGenres.length > 0 ||
      this.selectedCountries.length > 0 ||
      this.selectedDirectors.length > 0 ||
      this.isWatchlistFilter ||
      this.isSeenlistFilter
    );
  }
}