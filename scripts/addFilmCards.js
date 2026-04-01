const filmsContainer = document.getElementById("films-section__grid");

export function addCards(arr) {
    filmsContainer.innerHTML = ""; 

    for (let i = 0; i < arr.length; i++) {
        
        const timesHTML = arr[i].time.map(t => `<span class="film-card__time">${t}</span>`).join('');

        filmsContainer.innerHTML += `
            <article class="film-card" id="c${arr[i].id}">
                <div class="film-card__thumbnail" style="background-image: url('${arr[i].thumbnailUrl}')"></div>
                <div class="film-card__info">
                    <h3 class="film-card__title">${arr[i].title}</h3>
                    <p class="film-card__genre">${arr[i].genre}</p>
                    <div class="film-card__sessions">
                        ${timesHTML} </div>
                    <div class="film-card__footer">
                        <div class="film-card__price-box">
                            <span class="film-card__price-label">Ціна</span>
                            <span class="film-card__price-value">${arr[i].price} грн</span>
                        </div>
                        <button class="button button--card">Придбати квитки</button>
                    </div>
                </div>
            </article>
        `;
    }
}