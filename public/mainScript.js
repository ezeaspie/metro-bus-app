var x = document.getElementById("demo");

let userPreferences = [];
let saveButtons = document.querySelectorAll(".save");


localforage.getItem("userInfo").then(function(value) {
    if (value != null) {
        userPreferences = value;
    }
    if(value != null && document.title == "Next Bus Express - Search") {
        for(let i=0 ; i<saveButtons.length ; i++) {
            if(userPreferences.includes(saveButtons[i].id)) {
                saveButtons[i].disabled = true;
            }
            if(userPreferences.length >= 2) {
                for(let i = 0 ; i<saveButtons.length ; i++) {
                    saveButtons[i].disabled = true;
                }
            }
        }
        return;
    }
    if (document.title == "Next Bus Express" && value != [] && value != null) {
        document.getElementById("array").value = JSON.stringify(userPreferences);
        document.getElementById("stop-data").submit();
        return;
    }
    if (document.title == "Next Bus Express" && value == [] && value != null){
        getLocation();
        console.log("Getting stops near you...");
        return;
    }
 

});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function sendPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    document.getElementById("latitude").value = position.coords.latitude;
    document.getElementById("longitude").value = position.coords.longitude;
    document.getElementById('coordinates').submit();
}

document.querySelector(".search").addEventListener("click", () => {
    let inputs = document.querySelectorAll(".search-form input");
    for (let i=0 ; i<inputs.length ; i++) {
        inputs[i].classList.toggle("expand");
    }
});

document.querySelector(".locate").addEventListener("click", function() {
    getLocation();
});

let removeButtons = document.querySelectorAll(".remove");

for(let i=0 ; i<removeButtons.length ; i++) {
    removeButtons[i].addEventListener("click", function() {
        let index = Number(this.id);
        userPreferences.splice(index,1);
        document.querySelector(`#card${i}`).style.display = "none";
        if(userPreferences.length == 0){
            localforage.clear().then(function () {
                console.log('Database is now empty.');
            }).catch(function (err) {
                console.log(err);
            });
        }
        else{
            localforage.setItem('userInfo', userPreferences).then(function (value) {
            }).catch(function (err) {
                console.log(err);
            });
        }
        
    });
}

for(let i = 0 ; i<saveButtons.length ; i++) {
    saveButtons[i].addEventListener("click", function() {
        userPreferences.push(this.id);
        if (userPreferences.length >= 2) {
            for (let i = 0; i < saveButtons.length; i++) {
                saveButtons[i].disabled = true;
            }
        }
        localforage.setItem('userInfo', userPreferences).then(function (value) {
                console.log(value);
        }).catch(function (err) {
                console.log(err);
        });

        if (userPreferences.includes(this.id)) {
            this.disabled = true;
            return;
        }
    });
}

const countdown = (msTime) => {
    let times = document.querySelectorAll(".time");
    setInterval(() => {
        for(let i = 0 ; i<times.length ; i++) {
            let newTime = Number(times[i].innerHTML) -1;
            if(newTime >= 0){
                times[i].innerHTML = newTime;
            }
            else {
                times[i].parentNode.innerHTML = "Bus has passed";
            }
        }
    }, msTime);
}
countdown(60000);

document.querySelector(".search-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let searchTerm = document.querySelector(".search-input").value;
    searchTerm = searchTerm.toUpperCase();
    if(searchTerm == "" || searchTerm == " ") {
        document.querySelector(".search-input").classList.add("invalid");
        return;
    }
    else{
        let res = searchTerm.replace(/street/gi, "ST");
        if(/avenue/gi.test(searchTerm)){
            res = searchTerm.replace(/avenue/gi, "AVE");
        }
        document.querySelector(".search-input").value = res;
       document.querySelector(".search-form").submit();
    }
});