const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    mcListNumber: Number,
    mcTitle: String,
    mcYear: Number,
    mcRating: Number,
    tmdbData: {
        budget: Number,
        genres: [{ id: Number, name: String }],
        imdb_id: String,
        original_title: String,
        overview: String,
        poster_path: String,
        backdrop_path: String,
        production_companies: [{ id: Number, name: String }],
        production_countries: [{ iso_3166_1: String, name: String }],
        revenue: Number,
        runtime: Number,
        spoken_languages: [{ english_name: String, iso_639_1: String, name: String }],
        tagline: String,
        title: String,
        cast: [{ original_name: String, character: String }],
        writers: [String],
        directors: [String]
    },
    omdbData: {
        imdbRating: String,
        Released: String,
        Year: String,
        BoxOffice: String,
        Ratings: [{
            Source: String,
            Value: String
        }]
    },
    dataUpdated: Boolean
}, { collection: 'MCListMovies' });

const Movie = mongoose.model('MCListMovie', MovieSchema);

module.exports = Movie;