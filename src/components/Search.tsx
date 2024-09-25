// src/Search.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Skema validasi Zod
const searchSchema = z.object({
  query: z.string().min(1, 'Please enter a search term'),
});

const Search = () => {
  const [results, setResults] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const apiKey = 'ff088c51acc87b9f37ac7c31c63855cb'; // Ganti dengan API Key TMDB Anda

  // Fungsi untuk menangani submit form
  const onSubmit = async (data) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${data.query}`
    );
    const json = await response.json();
    setResults(json.results);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Search for a movie..."
          {...register('query')}
        />
        <button type="submit">Search</button>
        {errors.query && <p>{errors.query.message}</p>}
      </form>

      {/* Display results */}
      <div>
        {results.length > 0 ? (
          <ul>
            {results.map((movie) => (
              <li key={movie.id}>
                {movie.title} ({movie.release_date})
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
function zodResolver(searchSchema: z.ZodObject<{ query: z.ZodString; }, "strip", z.ZodTypeAny, { query: string; }, { query: string; }>): import("react-hook-form").Resolver<import("react-hook-form").FieldValues, any> | undefined {
    throw new Error('Function not implemented.');
}

