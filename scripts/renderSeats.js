import { supabase } from "./supabase.js"; 

const seats = document.querySelectorAll(".seat");

export async function renderSeats(film) {
    let selectedTime = document.querySelector(".time-pill--active").textContent;
    let arr = film.occupiedSeats;
    let occupiedSeatsArr = [];

    seats.forEach((seat) => {
        if (!seat.classList.contains("seat--example")) {
            seat.classList.remove("seat--occupied", "seat--selected", "seat--booked");
        }
    });

    for (let j = 0; j < arr.length; j++) {
        if (arr[j].time == selectedTime) {
            occupiedSeatsArr = arr[j].seats;
        }
    }

    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session ? session.user.id : null;

    let dbTickets = [];
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('seat_index, user_id')
            .eq('movie_id', film.id)
            .eq('session_time', selectedTime);

        if (error) {
            console.error(error);
        } else if (data) {
            dbTickets = data;
        }
    } catch (err) {
        console.error(err);
    }

    let i = 1;
    seats.forEach((seat) => {
        if (!seat.classList.contains("seat--example")) {
            if (occupiedSeatsArr.includes(i)) {
                seat.classList.add("seat--occupied");
            }
            
            const ticketFromDB = dbTickets.find(ticket => ticket.seat_index === i);
            
            if (ticketFromDB) {
                if (currentUserId && ticketFromDB.user_id === currentUserId) {
                    seat.classList.add("seat--booked");
                } else {
                    seat.classList.add("seat--occupied");
                }
                seat.classList.remove("seat--selected"); 
            }
        }
        i++;
    });
}