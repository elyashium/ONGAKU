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

    // this is not the ideal way to get the songs but we are not using any backend so 

    // let a = await fetch(`/ONGAKU/${folder}/`);
    let a = await fetch(`https://elyashium.github.io/ONGAKU/${folder}/`);

    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];
    songImages = [];



    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href.split(`${folder}`)[1]);
            let filename = element.href.split("/").slice(-1)[0]; // Get just the filename
            songs.push(filename);



        }

        else if (element.href.endsWith(".jpg") || element.href.endsWith(".jpeg")) {

            let parts = element.href.split("/");
            songImages.push(parts[parts.length - 1]);
            
        }

    }





    console.log(songs);
    console.log(songImages);

    // Select the unordered list element where the songs will be listed 
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    // Loop through each song and corresponding image to create the list items

    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        let imgSrc = songImages[i % songImages.length]; // Handle case where songImages might be fewer than songs

        // Append the list item to the songUL
        songUL.innerHTML += `<li> 
            <img src="${currFolder}/${imgSrc}" alt="">
            <div class="info">
                <div> ${song.replaceAll("%20", " ")} </div>
                
            </div>
            <div class="playnow invert">
                <img src="image/play.svg" alt="">
            </div> </li>`;
    }



    // attach an evnet listner to each song.

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML);
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




