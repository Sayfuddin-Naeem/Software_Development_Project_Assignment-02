
// Fetch Data Fucntion Start
const fetchData = async (apiUrl, isPlayer) => {
    const errorShow = document.getElementById("errorShow");
    errorShow.innerHTML = '';

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.json();
        if(isPlayer)
            return data.player;
        else
            return data.players;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        errorShow.classList.remove("d-none");
        errorShow.classList.add("d-block");
        errorShow.innerHTML = 'Error fetching data';
        setTimeout(() => {
            errorShow.classList.remove("d-block");
            errorShow.classList.add("d-none");
        }, 3000);
        return null;
    }
};
// Fetch Data Function End  

// Display Player In Modal Function Start  
const displayPlayer_InModal = (players)=>{
    const modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = '';

    if (!players || players.length === 0) {
        const errorShow = document.getElementById("errorShow");
        errorShow.classList.remove("d-none");
        errorShow.classList.add("d-block");
        errorShow.innerHTML = 'No players found';
        return;
    }

    players.forEach(player => {
        const playerCard = `
            <div class="card bg-card col-12" style="width: 27rem;">
                <img src="${player.strThumb}" class="card-img-top" alt="${player.strPlayer}" style="height: 15rem;">
                <div class="card-body">
                    <h4 class="card-title text-center">${player.strPlayer}</h4>
                </div>
                
                <div class="list-group list-group-flush">
                <p class="list-group-item bg-transparent">Sport: ${player.strSport}</p>
                <p class="list-group-item bg-transparent">Team: ${player.strTeam}</p>
                    <p class="list-group-item bg-transparent">Nationality: ${player.strNationality}</p>
                    <p class="list-group-item bg-transparent">Date of Birth: ${player.dateBorn}</p>
                    <p class="list-group-item bg-transparent">Gender: ${player.strGender}</p>
                    <p class="list-group-item bg-transparent">Salary: ${player.strWage}</p>
                    <p class="list-group-item bg-transparent text-justify">Bio:<br> <span class="ms-2">${player.strDescriptionEN}</span></p>
                </div>
                <div class="d-flex justify-content-evenly w-25 my-3 mx-auto">
                    <a href="https://${player.strFacebook}" target="_blank" aria-label="Facebook">
                        <i class="fab fa-facebook text-accent-first fs-4"></i>
                    </a>
                    <a href="https://www.${player.strInstagram}" target="_blank" aria-label="Instagram">
                        <i class="fab fa-instagram text-accent-first fs-4"></i>
                    </a>
                </div>
            
            </div>
        `;
        modalBody.innerHTML += playerCard;
    });


    const playerDetailsModal = new bootstrap.Modal(document.getElementById('playerDetailsModal'));
    playerDetailsModal.show();
};
// Display Player In Modal End

const addEventListenerTo_cardButton = (container) =>{
    container.addEventListener('click', (event) => {
        const details = event.target.closest('.details');
        const addToGroup = event.target.closest('.addToGroup');
    
        if (details) {
            const playerId = details.getAttribute('data-playerid');
            modalView(playerId);
        }
        else if (addToGroup) {
            const member = document.getElementById("member");
            
            let totalMember = parseInt(member.innerText);

            if(totalMember < 11){
                const playerContainer = document.getElementById("player-container");
                const playerName = addToGroup.getAttribute('data-playername');
                member.innerText = totalMember + 1;
                const playerShow = `
                    <div class="d-flex">
                        <h5 class="card-title me-2">Player: </h5>
                        <p class="card-text">${playerName}</p>
                    </div>
                `;
                playerContainer.innerHTML += playerShow;
                
                addToGroup.classList.remove("brd-color-first");
                addToGroup.classList.add("border-danger");
                addToGroup.innerText = "Already Added";
            }
            else{
                const groupAlert = new bootstrap.Modal(document.getElementById('groupAlert'));
                groupAlert.show();
            }
        }
    });
};

// displayPlayers function Start
const displayPlayer = (players) => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.classList.remove("d-none");

    cardContainer.innerHTML = '';

    if (!players || players.length === 0) {
        const errorShow = document.getElementById("errorShow");
        errorShow.classList.remove("d-none");
        errorShow.classList.add("d-block");
        errorShow.innerHTML = 'No players found';
        return;
    }

    const div = document.createElement("div");
    div.classList.add("row", "mx-auto");
    players.forEach(player => {
        const playerCard = `
            <div class="card bg-card col-12 col-md-4 col-lg-4 col-xl-4 my-sm-2 mx-1" style="width: 25rem;">
                <img src="${player.strThumb}" class="card-img-top" alt="${player.strPlayer}" style="height: 15rem;">
                <div class="card-body">
                    <h4 class="card-title text-center">${player.strPlayer}</h4>
                </div>
                
                <div class="list-group list-group-flush">
                <p class="list-group-item bg-transparent">Sport: ${player.strSport}</p>
                <p class="list-group-item bg-transparent">Team: ${player.strTeam}</p>
                    <p class="list-group-item bg-transparent">Nationality: ${player.strNationality}</p>
                    <p class="list-group-item bg-transparent">Date of Birth: ${player.dateBorn}</p>
                    <p class="list-group-item bg-transparent">Gender: ${player.strGender}</p>
                    <p class="list-group-item bg-transparent">Salary: ${player.strWage}</p>
                </div>
                <div class="d-flex justify-content-evenly">
                    <buttton data-playername="${player.strPlayer}" class="addToGroup btn border-4 brd-color-first text-hover my-1">Add To Group</buttton>
                    <buttton data-playerid="${player.idPlayer}" class="details btn border-4 brd-color-second text-hover my-1">Details</buttton>
                </div>
            
            </div>
        `;
        div.innerHTML += playerCard;
    });
    cardContainer.appendChild(div);

    addEventListenerTo_cardButton(div);

};
// displayPlayers function end

// Default View Function Start
const defaultView = async () => {
    const apiUrl = "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?t=Arsenal";
    const players = await fetchData(apiUrl, true);
    if (players) {
        //console.log(players);
        displayPlayer(players);
    }
};
// Default View Function End

// Modal View Function Start
const modalView = async (playerId)=>{
    const apiUrl = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;
    const player = await fetchData(apiUrl, false);
    if (player) {
        //console.log(player);
        displayPlayer_InModal(player);
    }
};
// Modal View Function End

// Default View Function Start
const searchView = async (playerName) => {
    const apiUrl = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`;
    const players = await fetchData(apiUrl, true);

    document.getElementById("member").innerText = 0;
    document.getElementById("player-container").innerHTML = '';

    if (players) {
        //console.log(players);
        displayPlayer(players);
    }
};
// Default View Function End

document.addEventListener("DOMContentLoaded", () => {
    defaultView();
    const searchBtn = document.getElementById("searchBtn");

    // Search button onClick listner Start
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const searchInput = document.getElementById("searchInput");
        const searchVal = searchInput.value.trim();

        const errorShow = document.getElementById("errorShow");
        errorShow.innerHTML = '';
        

        if (!searchVal) {
            errorShow.classList.remove("d-none");
            errorShow.classList.add("d-block");

            errorShow.innerHTML = 'Please enter a search term';
            setTimeout(() => {
                errorShow.classList.remove("d-block");
                errorShow.classList.add("d-none");
            }, 3000);

            return;
        }
        
        searchView(searchVal);
        
    });
    // Search button onClick listner end
    
});
