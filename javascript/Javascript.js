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

var kaartMobile = document.getElementById("kaartMobile");
var kaartDesktop = document.getElementById("kaartDesktop");

function updateMap() {
  var straat = document.getElementById("inputStraat").value;
  var gemeente = document.getElementById("inputGemeente").value;
  var postcode = document.getElementById("inputPostcode").value;
  var adres = straat + " " + postcode + " " + gemeente + " Brussel";
  var embedUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(adres) +
    "&output=embed";

  if (kaartMobile) kaartMobile.src = embedUrl;
  if (kaartDesktop) kaartDesktop.src = embedUrl;
}

var inputs = document.querySelectorAll(".locatieObject input");
if (inputs.length > 0) {
  inputs.forEach(function (input) {
    input.addEventListener("input", updateMap);
  });
}

var inputFoto = document.getElementById("inputFoto");
if (inputFoto) {
  var fotoPreview = document.getElementById("fotoPreview");
  var fotoLabelText = document.getElementById("fotoLabelText");
  inputFoto.addEventListener("change", function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        fotoPreview.src = e.target.result;
        fotoPreview.style.display = "block";
        fotoLabelText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}

document.querySelectorAll(".deelLocatieButton").forEach(function (knop) {
  knop.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (positie) {
      var lat = positie.coords.latitude;
      var lon = positie.coords.longitude;
      fetch(
        "https://nominatim.openstreetmap.org/reverse?lat=" +
          lat +
          "&lon=" +
          lon +
          "&format=json",
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var adres = data.address;
          var straat = (adres.road || "") + " " + (adres.house_number || "");
          var gemeente = adres.city || adres.town || adres.municipality || "";
          var postcode = adres.postcode || "";

          document.getElementById("inputStraat").value = straat;
          document.getElementById("inputGemeente").value = gemeente;
          document.getElementById("inputPostcode").value = postcode;

          if (document.getElementById("inputStraatDesktop")) {
            document.getElementById("inputStraatDesktop").value = straat;
            document.getElementById("inputGemeenteDesktop").value = gemeente;
            document.getElementById("inputPostcodeDesktop").value = postcode;
          }

          var volledigAdres =
            straat + " " + postcode + " " + gemeente + " Brussel";
          var embedUrl =
            "https://maps.google.com/maps?q=" +
            encodeURIComponent(volledigAdres) +
            "&output=embed";
          if (kaartMobile) kaartMobile.src = embedUrl;
          if (kaartDesktop) kaartDesktop.src = embedUrl;
        });
    });
  });
});
