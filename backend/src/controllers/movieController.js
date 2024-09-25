const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
    try {
        const { decade, genres, countries, directors, sortBy, sortOrder, page = 1, limit = 20, watchlist, seenlist, showDocumentaries } = req.query;

        const query = {
            'omdbData.Year': { $exists: true, $ne: null }
        };

        if (watchlist === 'true' && req.user) {
            query['_id'] = { $in: req.user.watchlist };
        }

        if (seenlist === 'true' && req.user) {
            query['_id'] = { $in: req.user.seenlist };
        }

        // Create a genres condition array
        let genresCondition = [];

        // Handle showDocumentaries filter
        if (showDocumentaries === 'true') {
            genresCondition.push({ 'tmdbData.genres': { $elemMatch: { name: 'Documentary' } } });
        } else if (showDocumentaries === 'false') {
            genresCondition.push({ 'tmdbData.genres': { $not: { $elemMatch: { name: 'Documentary' } } } });
        }

        // Handle other genres
        if (genres) {
            const genreList = genres.split(',');
            genresCondition.push(...genreList.map(genre => ({ 'tmdbData.genres': { $elemMatch: { name: genre } } })));
        }

        // Apply genres condition if any
        if (genresCondition.length > 0) {
            query['$and'] = genresCondition;
        }

        // Handle other filters
        if (decade) {
            const startYear = parseInt(decade);
            query['omdbData.Year'] = {
                $gte: startYear.toString(),
                $lt: (startYear + 10).toString()
            };
        }

        if (countries) {
            const countryList = countries.split(',');
            query['tmdbData.production_countries'] = { $all: countryList.map(country => ({ $elemMatch: { name: country } })) };
        }

        if (directors) {
            query['tmdbData.directors'] = { $in: directors.split(',') };
        }

        // Prepare sort object
        const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

        let aggregationPipeline = [
            { $match: query }
        ];

        // Add sorting stage based on sortBy
        switch (sortBy) {
            case 'year':
                aggregationPipeline.push({ $sort: { 'omdbData.Year': sortOrderValue, _id: 1 } });
                break;
            case 'length':
                aggregationPipeline.push({ $sort: { 'tmdbData.runtime': sortOrderValue, _id: 1 } });
                break;
            case 'title':
                aggregationPipeline.push({ $sort: { 'tmdbData.title': sortOrderValue, _id: 1 } });
                break;
            case 'imdb':
                aggregationPipeline.push(
                    {
                        $addFields: {
                            sortField: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ['$omdbData.imdbRating', null] },
                                            { $ne: ['$omdbData.imdbRating', 'N/A'] }
                                        ]
                                    },
                                    { $toDouble: '$omdbData.imdbRating' },
                                    null
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            sortField: sortOrderValue,
                            _id: 1
                        }
                    },
                    {
                        $sort: {
                            'sortField': { $cond: [{ $eq: ['$sortField', null] }, -1, 1] },
                            'sortField': sortOrderValue,
                            _id: 1
                        }
                    }
                );
                break;
            case 'rottenTomatoes':
                aggregationPipeline.push(
                    {
                        $addFields: {
                            rottenTomatoesRating: {
                                $let: {
                                    vars: {
                                        rottenTomatoesRating: {
                                            $filter: {
                                                input: '$omdbData.Ratings',
                                                as: 'rating',
                                                cond: { $eq: ['$$rating.Source', 'Rotten Tomatoes'] }
                                            }
                                        }
                                    },
                                    in: {
                                        $cond: [
                                            { $gt: [{ $size: '$$rottenTomatoesRating' }, 0] },
                                            { $arrayElemAt: ['$$rottenTomatoesRating.Value', 0] },
                                            null
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            sortField: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ['$rottenTomatoesRating', null] },
                                            { $ne: ['$rottenTomatoesRating', 'N/A'] }
                                        ]
                                    },
                                    { $toDouble: { $rtrim: { input: '$rottenTomatoesRating', chars: '%' } } },
                                    null
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            sortField: sortOrderValue,
                            _id: 1
                        }
                    },
                    {
                        $sort: {
                            'sortField': { $cond: [{ $eq: ['$sortField', null] }, -1, 1] },
                            'sortField': sortOrderValue,
                            _id: 1
                        }
                    }
                );
                break;
            case 'metacritic':
                aggregationPipeline.push(
                    {
                        $addFields: {
                            sortField: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ['$mcRating', null] },
                                            { $ne: ['$mcRating', 'N/A'] }
                                        ]
                                    },
                                    { $toDouble: '$mcRating' },
                                    null
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            sortField: sortOrderValue,
                            _id: 1
                        }
                    },
                    {
                        $sort: {
                            'sortField': { $cond: [{ $eq: ['$sortField', null] }, -1, 1] },
                            'sortField': sortOrderValue,
                            _id: 1
                        }
                    }
                );
                break;
            default:
                aggregationPipeline.push({ $sort: { 'omdbData.Year': -1, _id: 1 } });
        }

        // Add pagination
        aggregationPipeline.push(
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        );

        const movies = await Movie.aggregate(aggregationPipeline);
        const total = await Movie.countDocuments(query);

        res.json({
            movies,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error in getMovies:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getFilterOptions = async (req, res) => {
    try {
        const { decade, genres, countries, directors, watchlist, seenlist, showDocumentaries } = req.query;

        const baseQuery = { 'omdbData.Year': { $exists: true, $ne: null } };

        if (watchlist === 'true' && req.user) {
            baseQuery['_id'] = { $in: req.user.watchlist };
        }

        if (seenlist === 'true' && req.user) {
            baseQuery['_id'] = { $in: req.user.seenlist };
        }

        let genresCondition = [];

        if (showDocumentaries === 'true') {
            genresCondition.push({ 'tmdbData.genres': { $elemMatch: { name: 'Documentary' } } });
        } else if (showDocumentaries === 'false') {
            genresCondition.push({ 'tmdbData.genres': { $not: { $elemMatch: { name: 'Documentary' } } } });
        }

        if (genres) {
            const genreList = genres.split(',');
            genresCondition.push(...genreList.map(genre => ({ 'tmdbData.genres': { $elemMatch: { name: genre } } })));
        }

        if (genresCondition.length > 0) {
            baseQuery['$and'] = genresCondition;
        }

        // Apply existing filters to the base query
        if (decade) {
            const startYear = parseInt(decade);
            baseQuery['omdbData.Year'] = {
                $gte: startYear.toString(),
                $lt: (startYear + 10).toString()
            };
        }
        if (countries) {
            const countryList = countries.split(',');
            baseQuery['tmdbData.production_countries'] = { $all: countryList.map(country => ({ $elemMatch: { name: country } })) };
        }
        if (directors) {
            baseQuery['tmdbData.directors'] = { $in: directors.split(',') };
        }

        // Get distinct values and counts for each filter
        const genresWithCount = await Movie.aggregate([
            { $match: baseQuery },
            { $unwind: '$tmdbData.genres' },
            { $group: { _id: '$tmdbData.genres.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const countriesWithCount = await Movie.aggregate([
            { $match: baseQuery },
            { $unwind: '$tmdbData.production_countries' },
            { $group: { _id: '$tmdbData.production_countries.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const directorsWithCount = await Movie.aggregate([
            { $match: baseQuery },
            { $unwind: '$tmdbData.directors' },
            { $group: { _id: '$tmdbData.directors', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const decadesWithCount = await Movie.aggregate([
            { $match: baseQuery },
            {
                $addFields: {
                    yearInt: {
                        $toInt: {
                            $arrayElemAt: [
                                { $split: [{ $ifNull: ["$omdbData.Year", ""] }, "–"] },
                                0
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    decade: {
                        $concat: [
                            { $toString: { $subtract: ["$yearInt", { $mod: ["$yearInt", 10] }] } },
                            "s"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$decade",
                    count: { $sum: 1 }
                }
            },
            { $match: { _id: { $ne: "s" } } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    decade: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            genres: genresWithCount,
            countries: countriesWithCount,
            directors: directorsWithCount,
            decades: decadesWithCount
        });
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateFilterCounts = async (req, res) => {
    try {
        const { decade, genres, countries, directors, watchlist, seenlist, showDocumentaries } = req.query;

        const baseQuery = { 'omdbData.Year': { $exists: true, $ne: null } };

        if (watchlist === 'true' && req.user) {
            baseQuery['_id'] = { $in: req.user.watchlist };
        }

        if (seenlist === 'true' && req.user) {
            baseQuery['_id'] = { $in: req.user.seenlist };
        }

        let genresCondition = [];

        if (showDocumentaries === 'true') {
            genresCondition.push({ 'tmdbData.genres': { $elemMatch: { name: 'Documentary' } } });
        } else if (showDocumentaries === 'false') {
            genresCondition.push({ 'tmdbData.genres': { $not: { $elemMatch: { name: 'Documentary' } } } });
        }

        if (genres) {
            const genreList = genres.split(',');
            genresCondition.push(...genreList.map(genre => ({ 'tmdbData.genres': { $elemMatch: { name: genre } } })));
        }

        if (genresCondition.length > 0) {
            baseQuery['$and'] = genresCondition;
        }

        // Apply existing filters to the base query
        if (decade) {
            const startYear = parseInt(decade);
            baseQuery['omdbData.Year'] = {
                $gte: startYear.toString(),
                $lt: (startYear + 10).toString()
            };
        }
        if (countries) {
            const countryList = countries.split(',');
            baseQuery['tmdbData.production_countries'] = { $all: countryList.map(country => ({ $elemMatch: { name: country } })) };
        }
        if (directors) {
            baseQuery['tmdbData.directors'] = { $in: directors.split(',') };
        }

        // Get updated counts for each filter
        const [genresWithCount, countriesWithCount, directorsWithCount, decadesWithCount] = await Promise.all([
            Movie.aggregate([
                { $match: baseQuery },
                { $unwind: '$tmdbData.genres' },
                { $group: { _id: '$tmdbData.genres.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Movie.aggregate([
                { $match: baseQuery },
                { $unwind: '$tmdbData.production_countries' },
                { $group: { _id: '$tmdbData.production_countries.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Movie.aggregate([
                { $match: baseQuery },
                { $unwind: '$tmdbData.directors' },
                { $group: { _id: '$tmdbData.directors', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Movie.aggregate([
                { $match: baseQuery },
                {
                    $addFields: {
                        yearInt: {
                            $toInt: {
                                $arrayElemAt: [
                                    { $split: [{ $ifNull: ["$omdbData.Year", ""] }, "–"] },
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        decade: {
                            $concat: [
                                { $toString: { $subtract: ["$yearInt", { $mod: ["$yearInt", 10] }] } },
                                "s"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$decade",
                        count: { $sum: 1 }
                    }
                },
                { $match: { _id: { $ne: "s" } } },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        decade: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ])
        ]);

        res.json({
            genres: genresWithCount,
            countries: countriesWithCount,
            directors: directorsWithCount,
            decades: decadesWithCount
        });
    } catch (error) {
        console.error('Error in updateFilterCounts:', error);
        res.status(500).json({ message: error.message });
    }
};