import countryCard from '../templates/country-card.hbs';
import countryList from '../templates/country-list.hbs';
import fetchCountries from './fetchCountries';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import debounce from 'lodash.debounce';

const refs = {
  input: document.querySelector('#input'),
  countryList: document.querySelector('.country__list'),
};

refs.input.addEventListener('input', debounce(searchCountry, 500));

function searchCountry(e) {
  resetOutput();
  const searchQuery = e.target.value.trim();
  if (searchQuery) {
    makeCountryCard(searchQuery);
  }

  function makeCountryCard(searchQuery) {
    fetchCountries(searchQuery)
      .then(data => {
        if (data.length > 10) {
          error({
            text: 'Too many matches found. Please enter a more specific name!',
          });
        } else if (data.status === 404) {
          error({
            text: 'No country has been found. Please enter a more specific name!',
          });
        } else if (data.length === 1) {
          renderCountryCard(data, countryCard);
        } else if (data.length <= 10) {
          renderCountryCard(data, countryList);
        }
      })
      .catch(err => {
        error({ text: 'Network error!', delay: 1500 });
      });
  }
}

function resetOutput() {
  refs.countryList.innerHTML = '';
}

function renderCountryCard(countries, template) {
  const markup = countries.map(country => template(country)).join('');
  refs.countryList.insertAdjacentHTML('afterbegin', markup);
}
