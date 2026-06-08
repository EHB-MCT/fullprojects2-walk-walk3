var toggle = document.getElementById("taalToggle");
var nl = document.querySelector(".taal-nl");
var fr = document.querySelector(".taal-fr");

nl.classList.add("wit");

toggle.addEventListener("change", function () {
  if (toggle.checked) {
    nl.classList.remove("wit");
    fr.classList.add("wit");
  } else {
    nl.classList.add("wit");
    fr.classList.remove("wit");
  }
});

var inputs = document.querySelectorAll(".locatieObject input");
var kaart = document.getElementById("kaart");
var openMapLink = document.getElementById("openMapLink");

function updateMap() {
  var straat = document.getElementById("inputStraat").value;
  var gemeente = document.getElementById("inputGemeente").value;
  var postcode = document.getElementById("inputPostcode").value;
  var adres = straat + " " + postcode + " " + gemeente + " Brussel";
  var embedUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(adres) +
    "&output=embed";
  var fullUrl = "https://maps.google.com/maps?q=" + encodeURIComponent(adres);

  if (kaart) {
    kaart.src = embedUrl;
  }
  if (openMapLink) {
    openMapLink.href = fullUrl;
  }
}

inputs.forEach(function (input) {
  input.addEventListener("input", updateMap);
});
