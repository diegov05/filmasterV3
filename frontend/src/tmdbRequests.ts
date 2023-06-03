const key: string = "bf0048d3c2f01f2c4e53d30b41cea183"

const requests = {
    popularMoviesRequest: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&page=1&without_genres=27,14`,
    upcomingMoviesRequest: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1&without_genres=27,14`,
    trendingMoviesRequest: `https://api.themoviedb.org/3/trending/all/day?api_key=${key}&without_genres=27,14`,
    nowPlayingMovies: `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1`,
    popularSeriesRequest: `https://api.themoviedb.org/3/tv/popular?api_key=${key}&language=en-US&page=1&with_original_language=en&without_genres=27,14`,
    trendingSeriesRequest: `https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&page=2&with_original_language=en&without_genres=27,14`,
    onAirSeriesRequest: `https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=1&with_original_language=en|ja&without_genres=27,14`,

}

export { requests, key }
