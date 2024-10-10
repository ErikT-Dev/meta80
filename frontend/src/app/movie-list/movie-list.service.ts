import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MovieService, MovieResponse, FilterOptions } from '../movie.service';
import { MovieListState, SortOption } from './movie-list.types';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MovieListService {
    private stateSubject = new BehaviorSubject<MovieListState>(this.getInitialState());
    state$: Observable<MovieListState> = this.stateSubject.asObservable();

    constructor(
        private movieService: MovieService,
        private router: Router
    ) { }

    getInitialState(): MovieListState {
        const urlFilters = this.movieService.loadFiltersFromUrl();
        return {
            movies: [],
            totalMovies: 0,
            currentPage: urlFilters.page || 1,
            totalPages: 0,
            decades: [],
            genres: [],
            countries: [],
            directors: [],
            selectedDecade: urlFilters.decade || null,
            selectedGenres: urlFilters.genres || [],
            selectedCountries: urlFilters.countries || [],
            selectedDirectors: urlFilters.directors || [],
            currentSortOption: urlFilters.sortBy || 'year',
            isAscending: urlFilters.sortOrder === 'asc',
            hasActiveFilters: false,
            currentUser: null,
            sortOptions: ['year', 'metacritic', 'rottenTomatoes', 'imdb', 'length', 'title'],
            isWatchlistFilter: urlFilters.watchlist || false,
            isSeenlistFilter: urlFilters.seenlist || false,
            showDocumentaries: urlFilters.showDocumentaries || false
        };
    }

    loadInitialData() {
        this.movieService.getFilterOptions().subscribe(
            (data: any) => {
                this.updateState({
                    decades: data.decades,
                    genres: data.genres,
                    countries: data.countries,
                    directors: data.directors
                });
                this.loadMovies();
            },
            error => console.error('Error loading filter options:', error)
        );
    }

    loadMovies() {
        const options: FilterOptions = this.getFilterOptions();
        this.movieService.getMovies(options).subscribe(
            (response: MovieResponse) => {
                this.updateState({
                    movies: response.movies,
                    totalMovies: response.total,
                    currentPage: response.page,
                    totalPages: response.pages
                });
                this.updateFilterCounts();
                this.updateUrl(options);
            },
            (error) => {
                console.error('Error fetching movies:', error);
            }
        );
    }

    private getFilterOptions(): FilterOptions {
        const state = this.stateSubject.getValue();
        return {
            decade: state.selectedDecade,
            genres: state.selectedGenres,
            countries: state.selectedCountries,
            directors: state.selectedDirectors,
            sortBy: state.currentSortOption,
            sortOrder: state.isAscending ? 'asc' : 'desc',
            page: state.currentPage,
            limit: 20,
            watchlist: state.isWatchlistFilter,
            seenlist: state.isSeenlistFilter,
            showDocumentaries: state.showDocumentaries
        };
    }

    private updateUrl(options: FilterOptions) {
        const queryParams: any = {};
        if (options.decade) queryParams.decade = options.decade;
        if (options.genres?.length) queryParams.genres = options.genres.join(',');
        if (options.countries?.length) queryParams.countries = options.countries.join(',');
        if (options.directors?.length) queryParams.directors = options.directors.join(',');
        if (options.sortBy) queryParams.sortBy = options.sortBy;
        if (options.sortOrder) queryParams.sortOrder = options.sortOrder;
        if (options.page && options.page > 1) queryParams.page = options.page;
        if (options.watchlist) queryParams.watchlist = options.watchlist;
        if (options.seenlist) queryParams.seenlist = options.seenlist;
        if (options.showDocumentaries) queryParams.showDocumentaries = options.showDocumentaries;

        this.router.navigate([], {
            relativeTo: this.router.routerState.root,
            queryParams: queryParams,
            queryParamsHandling: 'merge'
        });
    }

    updateFilterCounts() {
        const options = this.getFilterOptions();
        this.movieService.updateFilterCounts(options).subscribe(
            (data: any) => {
                this.updateState({
                    decades: data.decades,
                    genres: data.genres,
                    countries: data.countries,
                    directors: data.directors,
                });
            },
            error => console.error('Error updating filter counts:', error)
        );
    }

    getCurrentState(): MovieListState {
        return this.stateSubject.getValue();
    }

    updateState(newState: Partial<MovieListState>) {
        this.stateSubject.next({ ...this.stateSubject.getValue(), ...newState });
    }

    toggleSortDirection() {
        const currentState = this.stateSubject.getValue();
        const newState = {
            ...currentState,
            isAscending: !currentState.isAscending
        };
        this.stateSubject.next(newState);
        this.goToFirstPage();
        this.loadMovies();
    }

    onSortChange(option: SortOption) {
        const state = this.stateSubject.getValue();
        if (state.currentSortOption === option) {
            this.updateState({ isAscending: !state.isAscending });
        } else {
            this.updateState({ currentSortOption: option, isAscending: false });
        }
        this.loadMovies();
    }

    getSortOptionDisplay(option: SortOption): string {
        switch (option) {
            case 'year': return 'Year';
            case 'length': return 'Length';
            case 'title': return 'Title';
            case 'imdb': return 'IMDb Rating';
            case 'rottenTomatoes': return 'Rotten Tomatoes';
            case 'metacritic': return 'Metacritic';
            default: return option;
        }
    }

    goToFirstPage() {
        this.updateState({ currentPage: 1 });
    }

    loadNextPage() {
        const state = this.stateSubject.getValue();
        if (state.currentPage < state.totalPages) {
            this.updateState({ currentPage: state.currentPage + 1 });
            this.loadMovies();
        }
    }

    loadPreviousPage() {
        const state = this.stateSubject.getValue();
        if (state.currentPage > 1) {
            this.updateState({ currentPage: state.currentPage - 1 });
            this.loadMovies();
        }
    }
}