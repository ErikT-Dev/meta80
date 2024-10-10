import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export type SortOption = 'year' | 'length' | 'title' | 'imdb' | 'rottenTomatoes' | 'metacritic';

export interface DecadeFilterOption {
    decade: string;
    count: number;
}

export interface GenericFilterOption {
    _id: string;
    count: number;
}

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private decadeFilterSubject = new BehaviorSubject<string | null>(null);
    private genreFilterSubject = new BehaviorSubject<string[]>([]);
    private countryFilterSubject = new BehaviorSubject<string[]>([]);
    private directorFilterSubject = new BehaviorSubject<string[]>([]);
    private sortOptionSubject = new BehaviorSubject<SortOption>('year');
    private sortOrderSubject = new BehaviorSubject<'asc' | 'desc'>('desc');

    private watchlistFilterSubject = new BehaviorSubject<boolean>(false);
    private seenlistFilterSubject = new BehaviorSubject<boolean>(false);
    private showDocumentariesSubject = new BehaviorSubject<boolean>(false);

    private decadesSubject = new BehaviorSubject<DecadeFilterOption[]>([]);
    private genresSubject = new BehaviorSubject<GenericFilterOption[]>([]);
    private countriesSubject = new BehaviorSubject<GenericFilterOption[]>([]);
    private directorsSubject = new BehaviorSubject<GenericFilterOption[]>([]);

    private filtersChangedSubject = new BehaviorSubject<void>(undefined);
    filtersChanged$ = this.filtersChangedSubject.asObservable();

    getFilters(): Observable<{
        decade: string | null,
        genres: string[],
        countries: string[],
        directors: string[],
        sortOption: SortOption,
        sortOrder: 'asc' | 'desc',
        watchlist: boolean,
        seenlist: boolean,
        showDocumentaries: boolean
    }> {
        return combineLatest([
            this.decadeFilterSubject,
            this.genreFilterSubject,
            this.countryFilterSubject,
            this.directorFilterSubject,
            this.sortOptionSubject,
            this.sortOrderSubject,
            this.watchlistFilterSubject,
            this.seenlistFilterSubject,
            this.showDocumentariesSubject
        ]).pipe(
            map(([decade, genres, countries, directors, sortOption, sortOrder, watchlist, seenlist, showDocumentaries,]) => ({
                decade, genres, countries, directors, sortOption, sortOrder, watchlist, seenlist, showDocumentaries,
            }))
        );
    }

    setWatchlistFilter(isWatchlist: boolean) {
        this.watchlistFilterSubject.next(isWatchlist);
        this.filtersChangedSubject.next();
    }

    setSeenlistFilter(isSeenlist: boolean) {
        this.seenlistFilterSubject.next(isSeenlist);
        this.filtersChangedSubject.next();
    }

    setShowDocumentaries(show: boolean) {
        this.showDocumentariesSubject.next(show);
        this.filtersChangedSubject.next();
    }

    setDecadeFilter(decade: string | null) {
        this.decadeFilterSubject.next(decade);
        this.filtersChangedSubject.next();
    }

    setGenreFilter(genres: string[]) {
        this.genreFilterSubject.next(genres);
        this.filtersChangedSubject.next();
    }

    setCountryFilter(countries: string[]) {
        this.countryFilterSubject.next(countries);
        this.filtersChangedSubject.next();
    }

    setDirectorFilter(directors: string[]) {
        this.directorFilterSubject.next(directors);
        this.filtersChangedSubject.next();
    }

    setDecades(decades: DecadeFilterOption[]) {
        this.decadesSubject.next(decades);
    }

    setGenres(genres: GenericFilterOption[]) {
        this.genresSubject.next(genres);
    }

    setCountries(countries: GenericFilterOption[]) {
        this.countriesSubject.next(countries);
    }

    setDirectors(directors: GenericFilterOption[]) {
        this.directorsSubject.next(directors);
    }

    getDecades(): Observable<DecadeFilterOption[]> {
        return this.decadesSubject.asObservable();
    }

    getGenres(): Observable<GenericFilterOption[]> {
        return this.genresSubject.asObservable();
    }

    getCountries(): Observable<GenericFilterOption[]> {
        return this.countriesSubject.asObservable();
    }

    getDirectors(): Observable<GenericFilterOption[]> {
        return this.directorsSubject.asObservable();
    }

    setSortOption(option: SortOption) {
        this.sortOptionSubject.next(option);
        this.filtersChangedSubject.next();
    }

    setSortOrder(order: 'asc' | 'desc') {
        this.sortOrderSubject.next(order);
        this.filtersChangedSubject.next();
    }

    clearAllFilters() {
        this.decadeFilterSubject.next(null);
        this.genreFilterSubject.next([]);
        this.countryFilterSubject.next([]);
        this.directorFilterSubject.next([]);
        this.watchlistFilterSubject.next(false);
        this.seenlistFilterSubject.next(false);
        this.filtersChangedSubject.next();
    }
}