import { Injectable } from '@angular/core';
import { MovieListService } from './movie-list.service';
import { FilterService } from '../filter.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class MovieListFilterService {
    constructor(
        private movieListService: MovieListService,
        private filterService: FilterService,
        private snackBar: MatSnackBar,
    ) { }

    toggleSeenlistFilter() {
        const state = this.movieListService.getCurrentState();
        if (state.currentUser) {
            const isSeenlistFilter = !state.isSeenlistFilter;
            this.movieListService.updateState({ isSeenlistFilter });
            this.filterService.setSeenlistFilter(isSeenlistFilter);

            if (isSeenlistFilter && state.isWatchlistFilter) {
                this.movieListService.updateState({ isWatchlistFilter: false });
                this.filterService.setWatchlistFilter(false);
            }

            this.movieListService.goToFirstPage()
            this.movieListService.loadMovies();
        } else {
            this.snackBar.open('Please log in to use the seenlist feature', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        }
    }

    toggleWatchlistFilter() {
        const state = this.movieListService.getCurrentState();
        if (state.currentUser) {
            const isWatchlistFilter = !state.isWatchlistFilter;
            this.movieListService.updateState({ isWatchlistFilter });
            this.filterService.setWatchlistFilter(isWatchlistFilter);

            if (isWatchlistFilter && state.isSeenlistFilter) {
                this.movieListService.updateState({ isSeenlistFilter: false });
                this.filterService.setSeenlistFilter(false);
            }

            this.movieListService.goToFirstPage()
            this.movieListService.loadMovies();
        } else {
            this.snackBar.open('Please log in to use the watchlist feature', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        }
    }

    toggleDocumentaries() {
        const state = this.movieListService.getCurrentState();
        const showDocumentaries = !state.showDocumentaries;
        this.movieListService.updateState({ showDocumentaries });
        this.filterService.setShowDocumentaries(showDocumentaries);

        const selectedGenres = [...state.selectedGenres];
        const index = selectedGenres.indexOf("Documentary");
        if (showDocumentaries && index === -1) {
            selectedGenres.push("Documentary");
        } else if (!showDocumentaries && index > -1) {
            selectedGenres.splice(index, 1);
        }

        this.movieListService.updateState({ selectedGenres });
        this.filterService.setGenreFilter(selectedGenres);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    toggleDecadeFilter(decade: string) {
        const state = this.movieListService.getCurrentState();
        const selectedDecade = state.selectedDecade === decade ? null : decade;
        this.movieListService.updateState({ selectedDecade });
        this.filterService.setDecadeFilter(selectedDecade);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    toggleGenreFilter(genre: string) {
        if (genre === "Documentary") {
            this.toggleDocumentaries();
            return;
        }
        const state = this.movieListService.getCurrentState();
        const selectedGenres = [...state.selectedGenres];
        const index = selectedGenres.indexOf(genre);
        if (index > -1) {
            selectedGenres.splice(index, 1);
        } else {
            selectedGenres.push(genre);
        }
        this.movieListService.updateState({ selectedGenres });
        this.filterService.setGenreFilter(selectedGenres);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    toggleCountryFilter(country: string) {
        const state = this.movieListService.getCurrentState();
        const selectedCountries = [...state.selectedCountries];
        const index = selectedCountries.indexOf(country);
        if (index > -1) {
            selectedCountries.splice(index, 1);
        } else {
            selectedCountries.push(country);
        }
        this.movieListService.updateState({ selectedCountries });
        this.filterService.setCountryFilter(selectedCountries);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    toggleDirectorFilter(director: string) {
        const state = this.movieListService.getCurrentState();
        const selectedDirectors = [...state.selectedDirectors];
        const index = selectedDirectors.indexOf(director);
        if (index > -1) {
            selectedDirectors.splice(index, 1);
        } else {
            selectedDirectors.push(director);
        }
        this.movieListService.updateState({ selectedDirectors });
        this.filterService.setDirectorFilter(selectedDirectors);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    removeDecade() {
        this.movieListService.updateState({ selectedDecade: null });
        this.filterService.setDecadeFilter(null);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    removeGenre(genre: string) {
        if (genre === "Documentary") {
            this.toggleDocumentaries();
            return;
        }
        const state = this.movieListService.getCurrentState();
        const selectedGenres = state.selectedGenres.filter(g => g !== genre);
        this.movieListService.updateState({ selectedGenres });
        this.filterService.setGenreFilter(selectedGenres);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    removeCountry(country: string) {
        const state = this.movieListService.getCurrentState();
        const selectedCountries = state.selectedCountries.filter(c => c !== country);
        this.movieListService.updateState({ selectedCountries });
        this.filterService.setCountryFilter(selectedCountries);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    removeDirector(director: string) {
        const state = this.movieListService.getCurrentState();
        const selectedDirectors = state.selectedDirectors.filter(d => d !== director);
        this.movieListService.updateState({ selectedDirectors });
        this.filterService.setDirectorFilter(selectedDirectors);
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }

    clearAllFilters() {
        this.movieListService.updateState({
            selectedDecade: null,
            selectedGenres: [],
            selectedCountries: [],
            selectedDirectors: [],
            isWatchlistFilter: false,
            isSeenlistFilter: false,
            showDocumentaries: false
        });
        this.filterService.clearAllFilters();
        this.movieListService.goToFirstPage()
        this.movieListService.loadMovies();
    }
}