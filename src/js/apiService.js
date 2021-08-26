const API_KEY = '23088812-5b110276eac3708e5449cfd31';

export default function fetchImages(searchQuery, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNumber}&per_page=12&key=${API_KEY}`,
  ).then(response => response.json());
}
