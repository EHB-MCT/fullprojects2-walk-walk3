/* TAAL WISSELEN (NL/FR) */

var taalKnop = document.getElementById("languageToggle");
var nlTekst = document.querySelector(".language-nl");
var frTekst = document.querySelector(".language-fr");

var huidigeBestandsnaam = window.location.pathname.split("/").pop();
var ditIsEenFransePagina = huidigeBestandsnaam.endsWith("FR.html");

if (ditIsEenFransePagina) {
  taalKnop.checked = true;
  nlTekst.classList.remove("active");
  frTekst.classList.add("active");
}

taalKnop.addEventListener("change", function () {
  if (taalKnop.checked) {
    nlTekst.classList.remove("active");
    frTekst.classList.add("active");
  } else {
    nlTekst.classList.add("active");
    frTekst.classList.remove("active");
  }

  var bestandsnaam = window.location.pathname.split("/").pop();

  if (bestandsnaam === "index.html") {
    window.location.href = "paginas/indexFR.html";
  } else if (bestandsnaam === "indexFR.html") {
    window.location.href = "../index.html";
  } else if (bestandsnaam === "welkObstakel.html") {
    window.location.href = "welkObstakelFR.html";
  } else if (bestandsnaam === "welkObstakelFR.html") {
    window.location.href = "welkObstakel.html";
  } else if (bestandsnaam === "gegevens.html") {
    window.location.href = "gegevensFR.html";
  } else if (bestandsnaam === "gegevensFR.html") {
    window.location.href = "gegevens.html";
  } else if (bestandsnaam === "verzonden.html") {
    window.location.href = "verzondenFR.html";
  } else if (bestandsnaam === "verzondenFR.html") {
    window.location.href = "verzonden.html";
  }
});

/* KAART BIJWERKEN MET ADRES */

var kaartMobiel = document.getElementById("map-mobile");
var kaartDesktop = document.getElementById("map-desktop");

function toonAdresOpKaart() {
  var isDesktop = window.innerWidth >= 768;

  var straat;
  var gemeente;
  var postcode;

  if (isDesktop) {
    straat = document.getElementById("inputStraatDesktop").value;
    gemeente = document.getElementById("inputGemeenteDesktop").value;
    postcode = document.getElementById("inputPostcodeDesktop").value;
  } else {
    straat = document.getElementById("inputStraat").value;
    gemeente = document.getElementById("inputGemeente").value;
    postcode = document.getElementById("inputPostcode").value;
  }

  var volledigAdres = straat + " " + postcode + " " + gemeente + " Brussel";
  var kaartUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(volledigAdres) +
    "&output=embed";

  if (kaartMobiel) {
    kaartMobiel.src = kaartUrl;
  }
  if (kaartDesktop) {
    kaartDesktop.src = kaartUrl;
  }

  localStorage.setItem("straat", straat);
  localStorage.setItem("gemeente", gemeente);
  localStorage.setItem("postcode", postcode);
}

var locatieInvoervelden = document.querySelectorAll(".location-form input");

for (var i = 0; i < locatieInvoervelden.length; i++) {
  var veld = locatieInvoervelden[i];
  veld.addEventListener("input", toonAdresOpKaart);
}

/* LOCATIE OPHALEN VIA GPS */

var deelLocatieKnoppen = document.querySelectorAll(".share-location-button");

for (var i = 0; i < deelLocatieKnoppen.length; i++) {
  var knop = deelLocatieKnoppen[i];

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
          var straat = "";
          if (data.address.road) {
            straat = data.address.road;
          }
          if (data.address.house_number) {
            straat = straat + " " + data.address.house_number;
          }

          var gemeente = "";
          if (data.address.city) {
            gemeente = data.address.city;
          } else if (data.address.town) {
            gemeente = data.address.town;
          } else if (data.address.municipality) {
            gemeente = data.address.municipality;
          }

          var postcode = "";
          if (data.address.postcode) {
            postcode = data.address.postcode;
          }

          if (window.innerWidth >= 768) {
            document.getElementById("inputStraatDesktop").value = straat;
            document.getElementById("inputGemeenteDesktop").value = gemeente;
            document.getElementById("inputPostcodeDesktop").value = postcode;
          } else {
            document.getElementById("inputStraat").value = straat;
            document.getElementById("inputGemeente").value = gemeente;
            document.getElementById("inputPostcode").value = postcode;
          }

          toonAdresOpKaart();
        });
    });
  });
}

/* FOTO UPLOADEN EN VOORBEELD TONEN */

var fotoInvoer = document.getElementById("inputFoto");

if (fotoInvoer) {
  var fotoVoorbeeld = document.getElementById("photo-preview");
  var fotoTekst = document.getElementById("photo-label-text");

  fotoInvoer.addEventListener("change", function () {
    var bestand = this.files[0];

    if (bestand) {
      var lezer = new FileReader();

      lezer.onload = function (resultaat) {
        var afbeelding = new Image();

        afbeelding.onload = function () {
          var canvas = document.createElement("canvas");
          var maxBreedte = 600;
          var schaal = maxBreedte / afbeelding.width;

          canvas.width = maxBreedte;
          canvas.height = afbeelding.height * schaal;

          var canvasContext = canvas.getContext("2d");
          canvasContext.drawImage(
            afbeelding,
            0,
            0,
            canvas.width,
            canvas.height,
          );

          var verkleindeFoto = canvas.toDataURL("image/jpeg", 0.6);

          fotoVoorbeeld.src = verkleindeFoto;
          fotoVoorbeeld.style.display = "block";
          fotoTekst.style.display = "none";

          localStorage.setItem("foto", verkleindeFoto);
        };

        afbeelding.src = resultaat.target.result;
      };

      lezer.readAsDataURL(bestand);
    }
  });
}

/* OBSTAKELS ONTHOUDEN */

var obstakelCheckboxes = document.querySelectorAll("input[name='obstacle']");

for (var i = 0; i < obstakelCheckboxes.length; i++) {
  var checkbox = obstakelCheckboxes[i];

  checkbox.addEventListener("change", function () {
    var aangevinkteCheckboxes = document.querySelectorAll(
      "input[name='obstacle']:checked",
    );
    var geselecteerdeObstakels = "";

    for (var j = 0; j < aangevinkteCheckboxes.length; j++) {
      geselecteerdeObstakels =
        geselecteerdeObstakels + aangevinkteCheckboxes[j].value + ", ";
    }

    localStorage.setItem("obstakels", geselecteerdeObstakels);
  });
}

/* ANONIEM BLIJVEN */

var anoniemKnop = document.getElementById("anonymButton");

if (anoniemKnop) {
  anoniemKnop.addEventListener("click", function (event) {
    event.preventDefault();
    toonAlleOpgeslagenInfo();
    stuurMailNaarGemeente();

    var bestandsnaam = window.location.pathname.split("/").pop();

    if (bestandsnaam === "gegevensFR.html") {
      window.location.href = "verzondenFR.html";
    } else {
      window.location.href = "verzonden.html";
    }
  });
}

/* GEGEVENS OPSLAAN EN VERSTUREN */

var verzendKnop = document.getElementById("submit-button");

if (verzendKnop) {
  verzendKnop.addEventListener("click", function (event) {
    event.preventDefault();

    var naam = document.getElementById("inputNaam").value;
    var voornaam = document.getElementById("inputVoornaam").value;
    var email = document.getElementById("inputMail").value;
    var magOpslaan = document.getElementById("inputDatabase").checked;
    var krijgtNieuwsbrief = document.getElementById("inputNieuwsbrief").checked;

    localStorage.setItem("naam", naam);
    localStorage.setItem("voornaam", voornaam);
    localStorage.setItem("email", email);
    localStorage.setItem("magOpslaan", magOpslaan);
    localStorage.setItem("nieuwsbrief", krijgtNieuwsbrief);

    toonAlleOpgeslagenInfo();
    stuurMailNaarGemeente();

    var bestandsnaam = window.location.pathname.split("/").pop();

    if (bestandsnaam === "gegevensFR.html") {
      window.location.href = "verzondenFR.html";
    } else {
      window.location.href = "verzonden.html";
    }
  });
}

/* ALLE OPGESLAGEN INFO TONEN IN DE CONSOLE */

function toonAlleOpgeslagenInfo() {
  console.log("Straat:", localStorage.getItem("straat"));
  console.log("Gemeente:", localStorage.getItem("gemeente"));
  console.log("Postcode:", localStorage.getItem("postcode"));
  console.log("Obstakels:", localStorage.getItem("obstakels"));
  console.log("Foto:", localStorage.getItem("foto"));
  console.log("Naam:", localStorage.getItem("naam"));
  console.log("Voornaam:", localStorage.getItem("voornaam"));
  console.log("Email:", localStorage.getItem("email"));
  console.log("Mag opslaan:", localStorage.getItem("magOpslaan"));
  console.log("Nieuwsbrief:", localStorage.getItem("nieuwsbrief"));
}

/* MAIL VERSTUREN NAAR DE GEMEENTE */

function stuurMailNaarGemeente() {
  var straat = localStorage.getItem("straat");
  var gemeente = localStorage.getItem("gemeente");
  var postcode = localStorage.getItem("postcode");
  var obstakels = localStorage.getItem("obstakels");
  var naam = localStorage.getItem("naam");
  var voornaam = localStorage.getItem("voornaam");
  var email = localStorage.getItem("email");
  var foto = localStorage.getItem("foto");

  var gemeenteEmails = {
    1000: "cabinet.a.maes@brucity.be",
    1030: "cabinet.harze@1030.be",
    1040: "andre.dubus@etterbeek.brussels",
    1050: "valerie.libert@elsene.brussels",
    1060: "cmorenville@stgilles.brussels",
    1070: "hbenmrah@anderlecht.brussels",
    1080: "sraiss@molenbeek.irisnet.be",
    1081: "dlagast@koekelberg.brussels",
    1082: "schibani@berchem.brussels",
    1083: "qpaelinck@ganshoren.brussels",
    1090: "jgesquiere@jette.brussels",
    1140: "dcordonnier@evere.brussels",
    1150: "gdallemagne@woluwe1150.be",
    1160: "mmaelschalck@oudergem.brussels",
    1170: "mstassart@wb1170.brussels",
    1180: "jbiermann@ukkel.brussels",
    1190: "fflamme@vorst.brussels",
    1200: "g.matgen@woluwe1200.be",
    1210: "mjabour@sjtn.brussels",
  };

  var emailGemeente = gemeenteEmails[postcode];
  emailGemeente = "lars.chokier@gmail.com";

  var mailGegevens = {
    naar_email: emailGemeente,
    straat: straat,
    gemeente: gemeente,
    postcode: postcode,
    obstakels: obstakels,
    naam: naam,
    voornaam: voornaam,
    email: email,
    foto: foto,
  };

  emailjs.send("service_ofcrsb2", "template_i36xuke", mailGegevens);
}
