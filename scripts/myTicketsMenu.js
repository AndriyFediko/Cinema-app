import { supabase } from "./supabase.js"; 

const cardsContainer = document.getElementById("myTicketsCardsContainer");

function sortSeats(arr) {
    let seatsSorted = "";
    let row1 = [];
    let row2 = [];
    let row3 = [];

    arr.forEach((el) => {
        if (el <= 6) {
            row1.push(el);
        } else if (el > 6 && el <= 14) {
            row2.push(el - 6);
        } else {
            row3.push(el - 14);
        }
    });

    row1.sort((a, b) => a - b);
    row2.sort((a, b) => a - b);
    row3.sort((a, b) => a - b);

    if (row1.length >= 1) {
        seatsSorted += `Ряд 1 (${row1.join(", ")});  `;
    }

    if (row2.length >= 1) {
        seatsSorted += `Ряд 2 (${row2.join(", ")}); `;
    }

    if (row3.length >= 1) {
        seatsSorted += `Ряд 3 (${row3.join(", ")}); `;
    }

    return seatsSorted;
}

export async function renderMyTicketsCards(arr) {
    cardsContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: var(--color-text-main);'>Завантаження квитків...</p>";

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        cardsContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: var(--color-text-grey);'>Будь ласка, увійдіть в акаунт, щоб побачити свої квитки.</p>";
        return;
    }

    const userId = session.user.id;

    try {
        const { data: dbTickets, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        if (!dbTickets || dbTickets.length === 0) {
            cardsContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: var(--color-text-grey);'>У вас поки немає заброньованих квитків.</p>";
            return;
        }

        const groupedTickets = {};
        
        dbTickets.forEach(ticket => {
            const key = `${ticket.movie_id}_${ticket.session_time}`;
            
            if (!groupedTickets[key]) {
                groupedTickets[key] = {
                    movieId: ticket.movie_id,
                    time: ticket.session_time,
                    seats: []
                };
            }
            groupedTickets[key].seats.push(ticket.seat_index);
        });

        cardsContainer.innerHTML = "";

        Object.values(groupedTickets).forEach((group) => {
            const film = arr.find(f => f.id === group.movieId);

            if (film) {
                cardsContainer.innerHTML += `
                    <div class="ticket-minicard">
                        <div class="ticket-minicard__img" style="background-image: url('${film.thumbnailUrl}')"></div>
                        <div class="ticket-minicard__info">
                            <h3 class="ticket-minicard__title">${film.title}</h3>
                            <p class="ticket-minicard__time">${group.time}</p>
                            <div class="ticket-minicard__details">
                                <span id="ticketsAmount">Кількість: ${group.seats.length} шт.</span>
                                <span id="seatsInfo">Місця: ${sortSeats(group.seats)}</span>
                            </div>
                        </div>
                        <div class="ticket-minicard__price">${film.price * group.seats.length} грн</div>
                    </div>
                `;
            }
        });

    } catch (err) {
        console.error(err);
        cardsContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: #ff4d4f;'>Сталася помилка при завантаженні квитків.</p>";
    }
}