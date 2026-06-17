/* ===== TAAL WISSELEN (NL/FR) ===== */

var taalKnop = document.getElementById("languageToggle");
var nlTekst = document.querySelector(".language-nl");
var frTekst = document.querySelector(".language-fr");

// Lijst die zegt: "als ik op deze pagina sta, ga dan naar deze andere pagina"
var anderePaginaInAndereTaal = {
  "index.html": "paginas/indexFR.html",
  "indexFR.html": "../index.html",
  "welkObstakel.html": "welkObstakelFR.html",
  "welkObstakelFR.html": "welkObstakel.html",
  "gegevens.html": "gegevensFR.html",
  "gegevensFR.html": "gegevens.html",
  "verzonden.html": "verzondenFR.html",
  "verzondenFR.html": "verzonden.html",
};

// Naam van het huidige bestand ophalen (bv. "gegevens.html")
function huidigeBestandsnaam() {
  return window.location.pathname.split("/").pop();
}

// Bij het laden van de pagina: check of we al op een Franse pagina staan
var ditIsEenFransePagina = huidigeBestandsnaam().endsWith("FR.html");

if (ditIsEenFransePagina) {
  taalKnop.checked = true;
  nlTekst.classList.remove("active");
  frTekst.classList.add("active");
}

// Als er op de taalknop geklikt wordt
taalKnop.addEventListener("change", function () {
  if (taalKnop.checked) {
    nlTekst.classList.remove("active");
    frTekst.classList.add("active");
  } else {
    nlTekst.classList.add("active");
    frTekst.classList.remove("active");
  }

  var doelPagina = anderePaginaInAndereTaal[huidigeBestandsnaam()];
  if (doelPagina) {
    window.location.href = doelPagina;
  }
});

/* ===== KAART BIJWERKEN MET ADRES ===== */

var kaartMobiel = document.getElementById("map-mobile");
var kaartDesktop = document.getElementById("map-desktop");

function toonAdresOpKaart() {
  var straat = document.getElementById("inputStraat").value;
  var gemeente = document.getElementById("inputGemeente").value;
  var postcode = document.getElementById("inputPostcode").value;
  var volledigAdres = straat + " " + postcode + " " + gemeente + " Brussel";

  var kaartUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(volledigAdres) +
    "&output=embed";

  if (kaartMobiel) kaartMobiel.src = kaartUrl;
  if (kaartDesktop) kaartDesktop.src = kaartUrl;
}

// Telkens je iets typt in een locatie-invoerveld, wordt de kaart bijgewerkt
var locatieInvoervelden = document.querySelectorAll(".location-form input");
if (locatieInvoervelden.length > 0) {
  locatieInvoervelden.forEach(function (veld) {
    veld.addEventListener("input", toonAdresOpKaart);
  });
}

/* ===== FOTO UPLOADEN EN VOORBEELD TONEN ===== */

var fotoInvoer = document.getElementById("inputFoto");

if (fotoInvoer) {
  var fotoVoorbeeld = document.getElementById("photo-preview");
  var fotoTekst = document.getElementById("photo-label-text");

  fotoInvoer.addEventListener("change", function () {
    var gekozenBestand = this.files[0];

    if (gekozenBestand) {
      var lezer = new FileReader();

      lezer.onload = function (resultaat) {
        fotoVoorbeeld.src = resultaat.target.result;
        fotoVoorbeeld.style.display = "block";
        fotoTekst.style.display = "none";
      };

      lezer.readAsDataURL(gekozenBestand);
    }
  });
}

/* ===== LOCATIE OPHALEN VIA GPS ===== */

var deelLocatieKnoppen = document.querySelectorAll(".share-location-button");

deelLocatieKnoppen.forEach(function (knop) {
  knop.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (positie) {
      var breedtegraad = positie.coords.latitude;
      var lengtegraad = positie.coords.longitude;

      var apiUrl =
        "https://nominatim.openstreetmap.org/reverse?lat=" +
        breedtegraad +
        "&lon=" +
        lengtegraad +
        "&format=json";

      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var adres = data.address;
          var straat = (adres.road || "") + " " + (adres.house_number || "");
          var gemeente = adres.city || adres.town || adres.municipality || "";
          var postcode = adres.postcode || "";

          // Mobile invoervelden invullen
          document.getElementById("inputStraat").value = straat;
          document.getElementById("inputGemeente").value = gemeente;
          document.getElementById("inputPostcode").value = postcode;

          // Desktop invoervelden ook invullen, als ze bestaan
          var straatDesktop = document.getElementById("inputStraatDesktop");
          if (straatDesktop) {
            straatDesktop.value = straat;
            document.getElementById("inputGemeenteDesktop").value = gemeente;
            document.getElementById("inputPostcodeDesktop").value = postcode;
          }

          toonAdresOpKaart();
        });
    });
  });
});

/* ===== ANONIEM BLIJVEN ===== */

var anoniemKnop = document.getElementById("anonymButton");

if (anoniemKnop) {
  anoniemKnop.addEventListener("click", function () {
    if (huidigeBestandsnaam() === "gegevensFR.html") {
      window.location.href = "verzondenFR.html";
    } else {
      window.location.href = "verzonden.html";
    }
  });
}
