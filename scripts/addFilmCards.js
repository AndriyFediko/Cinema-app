const filmsContainer = document.getElementById("films-section__grid");

export function addCards(arr) {
    filmsContainer.innerHTML = ""; 

    for (let i = 0; i < arr.length; i++) {
        
        const timesHTML = arr[i].time.map(t => `<span class="film-card__time">${t}</span>`).join('');

        filmsContainer.innerHTML += `
            <article class="film-card" id="c${arr[i].id}" itemscope itemtype="https://schema.org/Movie">
                <div class="film-card__thumbnail">
                    <img src="${arr[i].thumbnailUrl}" 
                         alt="Постер фільму ${arr[i].title}" 
                         loading="lazy" 
                         width="100%"
                         height="100%"
                         itemprop="image">
                </div>
                <div class="film-card__info">
                    <h3 class="film-card__title" itemprop="name">${arr[i].title}</h3>
                    <p class="film-card__genre" itemprop="genre">${arr[i].genre}</p>
                    <div class="film-card__sessions">
                        ${timesHTML}
                    </div>
                    <div class="film-card__footer" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <div class="film-card__price-box">
                            <span class="film-card__price-label">Ціна</span>
                            <span class="film-card__price-value" itemprop="price" content="${arr[i].price}">${arr[i].price} грн</span>
                            <meta itemprop="priceCurrency" content="UAH">
                        </div>
                        <button class="button button--card">Придбати квитки</button>
                    </div>
                </div>
            </article>`;
    }
}