let cards = [];

let favoritesOnly = false;

fetch('cards.json')
.then(res => res.json())
.then(data => {

    cards = data;

    populateFilters();

    renderCards();
});

function populateFilters(){

    populateDropdown(
        "speciesFilter",
        [...new Set(cards.map(c=>c.species))]
    );

    populateDropdown(
        "typeFilter",
        [...new Set(cards.map(c=>c.type))]
    );

    populateDropdown(
        "yearFilter",
        [...new Set(cards.map(c=>c.year))]
    );

    populateDropdown(
        "setFilter",
        [...new Set(cards.map(c=>c.set))]
    );

    populateDropdown(
        "eraFilter",
        [...new Set(cards.map(c=>c.era))]
    );
}

function populateDropdown(id, values){

    const select = document.getElementById(id);

    values.sort().forEach(value=>{

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });
}

function getFavorites(){

    return JSON.parse(
        localStorage.getItem("favorites") || "[]"
    );
}

function toggleFavorite(id){

    let favorites = getFavorites();

    if(favorites.includes(id)){
        favorites = favorites.filter(f=>f!==id);
    }
    else{
        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderCards();
}

function renderCards(){

    const container =
        document.getElementById("cardContainer");

    container.innerHTML = "";

    const favorites = getFavorites();

    const name =
        document.getElementById("nameFilter")
        .value
        .toLowerCase();

    const species =
        document.getElementById("speciesFilter")
        .value;

    const type =
        document.getElementById("typeFilter")
        .value;

    const year =
        document.getElementById("yearFilter")
        .value;

    const set =
        document.getElementById("setFilter")
        .value;

    const era =
        document.getElementById("eraFilter")
        .value;


    const filtered = cards.filter(card=>{

        const favoriteCheck =
            !favoritesOnly ||
            favorites.includes(card.id);

        return (

            card.name.toLowerCase().includes(name)

            && (!species || card.species === species)

            && (!type || card.type === type)

            && (!year || card.year === year)

            && (!set || card.set === set)

            && (!era || card.era === era)

            && favoriteCheck
        );
    });

    filtered.forEach(card=>{

        const isFavorite =
            favorites.includes(card.id);

        container.innerHTML += `
        <div class="card">

            <img src="${card.image}"
                 alt="${card.name}">

            <div class="card-content">

                <h2>${card.name}</h2>

                <p><b>Soort:</b> ${card.species}</p>

                <p><b>Type:</b> ${card.type}</p>

                <p><b>Jaartal:</b> ${card.year}</p>

                <p><b>Set:</b> ${card.set}</p>

                <p><b>Era:</b> ${card.era}</p>

                <p><b>Voorraad:</b> ${card.amount}</p>

                <button
                    class="favorite-btn"
                    onclick="toggleFavorite(${card.id})">

                    ${isFavorite ? "⭐ Favoriet" : "☆ Toevoegen"}

                </button>

            </div>

        </div>
        `;
    });
}

document.addEventListener("input", renderCards);

document
.getElementById("speciesFilter")
.addEventListener("change", renderCards);

document
.getElementById("typeFilter")
.addEventListener("change", renderCards);

document
.getElementById("yearFilter")
.addEventListener("change", renderCards);

document
.getElementById("setFilter")
.addEventListener("change", renderCards);

document
.getElementById("eraFilter")
.addEventListener("change", renderCards);

document
.getElementById("favoritesOnly")
.addEventListener("click", () => {

    favoritesOnly = !favoritesOnly;

    renderCards();
});
