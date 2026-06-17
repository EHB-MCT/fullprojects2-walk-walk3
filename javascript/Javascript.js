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
  var straatMobiel = document.getElementById("inputStraat");
  var straatDesktop = document.getElementById("inputStraatDesktop");
  var gemeenteMobiel = document.getElementById("inputGemeente");
  var gemeenteDesktop = document.getElementById("inputGemeenteDesktop");
  var postcodeMobiel = document.getElementById("inputPostcode");
  var postcodeDesktop = document.getElementById("inputPostcodeDesktop");

  var straat =
    (straatMobiel && straatMobiel.value) ||
    (straatDesktop && straatDesktop.value) ||
    "";
  var gemeente =
    (gemeenteMobiel && gemeenteMobiel.value) ||
    (gemeenteDesktop && gemeenteDesktop.value) ||
    "";
  var postcode =
    (postcodeMobiel && postcodeMobiel.value) ||
    (postcodeDesktop && postcodeDesktop.value) ||
    "";

  var volledigAdres = straat + " " + postcode + " " + gemeente + " Brussel";
  var kaartUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(volledigAdres) +
    "&output=embed";

  if (kaartMobiel) kaartMobiel.src = kaartUrl;
  if (kaartDesktop) kaartDesktop.src = kaartUrl;

  localStorage.setItem("straat", straat);
  localStorage.setItem("gemeente", gemeente);
  localStorage.setItem("postcode", postcode);
}

var locatieInvoervelden = document.querySelectorAll(".location-form input");
if (locatieInvoervelden.length > 0) {
  locatieInvoervelden.forEach(function (veld) {
    veld.addEventListener("input", toonAdresOpKaart);
  });
}

/* ===== FOTO UPLOADEN NAAR STRAPI ===== */

var fotoInvoer = document.getElementById("inputFoto");

if (fotoInvoer) {
  var fotoVoorbeeld = document.getElementById("photo-preview");
  var fotoTekst = document.getElementById("photo-label-text");

  fotoInvoer.addEventListener("change", function () {
    var bestand = this.files[0];

    if (bestand) {
      // Voorbeeld tonen aan de gebruiker
      var lezer = new FileReader();
      lezer.onload = function (resultaat) {
        fotoVoorbeeld.src = resultaat.target.result;
        fotoVoorbeeld.style.display = "block";
        fotoTekst.style.display = "none";
      };
      lezer.readAsDataURL(bestand);

      // Foto meteen uploaden naar Strapi
      var fotoFormulier = new FormData();
      fotoFormulier.append("files", bestand);

      fetch("https://automatic-dogs-8279f757b9.strapiapp.com/api/upload", {
        method: "POST",
        body: fotoFormulier,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (uploadResultaat) {
          var fotoId = uploadResultaat[0].id;
          localStorage.setItem("fotoId", fotoId);
        })
        .catch(function (fout) {
          console.error("Foto uploaden mislukt:", fout);
        });
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

          document.getElementById("inputStraat").value = straat;
          document.getElementById("inputGemeente").value = gemeente;
          document.getElementById("inputPostcode").value = postcode;

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

/* ===== OBSTAKELS ONTHOUDEN ===== */

var obstakelCheckboxes = document.querySelectorAll("input[name='obstacle']");

obstakelCheckboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    var geselecteerdeObstakels = [];

    document
      .querySelectorAll("input[name='obstacle']:checked")
      .forEach(function (aangevinkt) {
        geselecteerdeObstakels.push(aangevinkt.value);
      });

    localStorage.setItem("obstakels", JSON.stringify(geselecteerdeObstakels));
  });
});

/* ===== ANONIEM BLIJVEN ===== */

var anoniemKnop = document.getElementById("anonymButton");

/* ===== MELDING VERSTUREN NAAR DATABASE ===== */

var verzendKnop = document.getElementById("submit-button");

if (verzendKnop) {
  verzendKnop.addEventListener("click", function (event) {
    event.preventDefault();
    verstuurMelding(false);
  });
}

if (anoniemKnop) {
  anoniemKnop.addEventListener("click", function (event) {
    event.preventDefault();
    verstuurMelding(true);
  });
}

function verstuurMelding(isAnoniem) {
  var straat = localStorage.getItem("straat") || "";
  var gemeente = localStorage.getItem("gemeente") || "";
  var postcode = localStorage.getItem("postcode") || "";

  if (straat === "" || gemeente === "" || postcode === "") {
    alert(
      "Gelieve eerst een locatie in te vullen voordat je een melding verstuurt.",
    );
    return;
  }

  var magOpslaan = document.getElementById("inputDatabase").checked;
  var krijgtNieuwsbrief = document.getElementById("inputNieuwsbrief").checked;
  var fotoId = localStorage.getItem("fotoId");

  var gegevens = {
    data: {
      straat: straat,
      gemeente: gemeente,
      postcode: postcode,
      obstakels: JSON.parse(localStorage.getItem("obstakels") || "[]"),
      nieuwsbrief: krijgtNieuwsbrief,
    },
  };

  if (!isAnoniem && magOpslaan) {
    gegevens.data.naam = document.getElementById("inputNaam").value;
    gegevens.data.voornaam = document.getElementById("inputVoornaam").value;
    gegevens.data.email = document.getElementById("inputMail").value;
  }

  if (fotoId) {
    gegevens.data.foto = fotoId;
  }

  fetch("https://automatic-dogs-8279f757b9.strapiapp.com/api/meldingen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gegevens),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (resultaat) {
      console.log("Melding opgeslagen:", JSON.stringify(resultaat, null, 2));

      localStorage.removeItem("straat");
      localStorage.removeItem("gemeente");
      localStorage.removeItem("postcode");
      localStorage.removeItem("obstakels");
      localStorage.removeItem("fotoId");

      if (huidigeBestandsnaam() === "gegevensFR.html") {
        window.location.href = "verzondenFR.html";
      } else {
        window.location.href = "verzonden.html";
      }
    })
    .catch(function (fout) {
      console.error("Er ging iets mis bij het opslaan:", fout);
    });
}
