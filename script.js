console.log('lets start with javascript baby');

let currentSong = new Audio();
let songs, songImages;
let currFolder;



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;

    // Fetch the JSON file
    let response = await fetch(`https://elyashium.github.io/ONGAKU/${folder}/songs.json`);
    let data = await response.json();

    songs = data.songs;
    songImages = data.images;

    console.log(songs);
    console.log(songImages);

    // Populate the UI with songs and images as before
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        let imgSrc = songImages[i % songImages.length];

        songUL.innerHTML += `<li> 
            <img src="${currFolder}/${imgSrc}" alt="">
            <div class="info">
                <div> ${song.replaceAll("%20", " ")} </div>
            </div>
            <div class="playnow invert">
                <img src="image/play.svg" alt="">
            </div> </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return { songs, songImages };
}






const playMusic = (track) => {

    // let audio = new Audio("/SPOTIFY%20clone/songs/" + track);

    currentSong.src = `${currFolder}/${track}`;
    currentSong.play();
    play.src = "image/pause.svg"

    //song duration and song info

    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "0:00 0:00"





}

async function main() {

    // Get the list of all songs and images
    await getSongs("songs/nujabesque");





    // attach an evrnt listner to play next previous and current song.

    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            play.src = "image/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "image/play.svg"
        }
    })

    //listen for time update


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add an event listner to get the address of song 
    //when clicked on the seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration) * percent / 100;

    });

    //add an event listner for hamburger

    document.querySelector(".ham").addEventListener("click", e => {

        document.querySelector(".left").style.left = "0";

    });

    document.querySelector(".cross").addEventListener("click", e => {

        document.querySelector(".left").style.left = "-100%";


    });


    //add event listner for previous nd next 

    previous.addEventListener("click", () => {
        currentSong.pause();

        let currentFilename = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentFilename);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();

        let currentFilename = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentFilename);

        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });


    // load the playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            songs, songImages = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
             playMusic(songs[0])


        })


    })













}

main();




