import { Movie } from '../movie.service';

export type SortOption = 'year' | 'length' | 'title' | 'imdb' | 'rottenTomatoes' | 'metacritic';

export interface DecadeFilterOption {
    decade: string;
    count: number;
}

export interface GenericFilterOption {
    _id: string;
    count: number;
}

export interface MovieListState {
    movies: Movie[];
    totalMovies: number;
    currentPage: number;
    totalPages: number;
    decades: DecadeFilterOption[];
    genres: GenericFilterOption[];
    countries: GenericFilterOption[];
    directors: GenericFilterOption[];
    selectedDecade: string | null;
    selectedGenres: string[];
    selectedCountries: string[];
    selectedDirectors: string[];
    currentSortOption: SortOption;
    isAscending: boolean;
    hasActiveFilters: boolean;
    currentUser: any;
    sortOptions: SortOption[];
    isWatchlistFilter: boolean;
    isSeenlistFilter: boolean;
    showDocumentaries: boolean;
}