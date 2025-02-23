import { useState } from 'react'
import { injectSpeedInsights } from '@vercel/speed-insights';
import './App.css'

interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
}

async function fetchTrendingMovies(){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };
  
  const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options);
  const data = await response.json();
  return data;
}

async function fetchMovieDetails(movieId: number){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };
  
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
  const data = await response.json();
  return data;
}

function App() {
  injectSpeedInsights();
  const [movieData, setMovieData] = useState<{results: Movie[]} | null>(null);

  const handleFetchMovies = async () => {
    const data = await fetchTrendingMovies();
    setMovieData(data);
    console.log(data);
  };

  const handleFetchMovieDetails = async (movieId: number) => {
    const data = await fetchMovieDetails(movieId);
    window.open(data.homepage);
    console.log(`Redirected to ${data.homepage}.`)
  };

  return (
    <>
      <h1>Movies!</h1>
      <div className="card">
        <button onClick={handleFetchMovies}>
          Fetch trending movies
        </button>
        <div className="movie-list">
          {movieData?.results
            ?.sort((a: Movie, b: Movie) => b.vote_average - a.vote_average)
            .slice(0, 5)
            .map((movie: Movie) => (
              <div key={movie.id} className="movie-item">
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <button onClick={() => handleFetchMovieDetails(movie.id)}>
                  Watch now!
                </button>
                <small>Rating: {movie.vote_average.toFixed(1)}/10</small>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default App
