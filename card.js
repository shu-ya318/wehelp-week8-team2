import { renderSunRaiseAndSet } from './render_sun_raise_and_set.js';
import { weather } from './weekly.js';
import { render_three_span_wether } from './render_three_span.js';

function setupLocationCards() {
  const cards = document.querySelectorAll('.card-wrapper');

  // 為每個卡片加上click監聽
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const location = card.querySelector('.card-text').innerText;
      renderSunRaiseAndSet(location);
      weather(location);
      render_three_span_wether(location);
    });
  });
}

setupLocationCards();
