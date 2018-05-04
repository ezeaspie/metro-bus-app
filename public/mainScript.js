var x = document.getElementById("demo");
console.log("WHO THE HECK IS HE");

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

getLocation();

document.querySelector(".search").addEventListener("click", () => {
    let inputs = document.querySelectorAll(".search-form input");
    for (let i=0 ; i<inputs.length ; i++) {
        inputs[i].classList.toggle("expand");
        console.log('working');
    }
});