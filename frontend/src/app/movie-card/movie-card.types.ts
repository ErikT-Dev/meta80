import { Movie } from '../movie.service';
import { SortOption } from '../filter.service';

export interface MovieCardFilters {
  selectedGenres: string[];
  selectedCountries: string[];
  selectedDirectors: string[];
  selectedDecade: string | null;
  sortOption: SortOption;
  sortOrder: 'asc' | 'desc';
  isWatchlistFilter: boolean;
  isSeenlistFilter: boolean;
  showDocumentaries: boolean;
}

export interface MovieCardLists {
  isInWatchlist: boolean;
  isInSeenlist: boolean;
}

export interface MovieCardData extends MovieCardFilters, MovieCardLists {
  movie: Movie;
}