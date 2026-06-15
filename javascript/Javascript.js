var toggle = document.getElementById("languageToggle");
var nl = document.querySelector(".language-nl");
var fr = document.querySelector(".language-fr");

nl.classList.add("active");

toggle.addEventListener("change", function () {
  if (toggle.checked) {
    nl.classList.remove("active");
    fr.classList.add("active");
  } else {
    nl.classList.add("active");
    fr.classList.remove("active");
  }
});

var mapMobile = document.getElementById("map-mobile");
var mapDesktop = document.getElementById("map-desktop");

function updateMap() {
  var straat = document.getElementById("inputStraat").value;
  var gemeente = document.getElementById("inputGemeente").value;
  var postcode = document.getElementById("inputPostcode").value;
  var adres = straat + " " + postcode + " " + gemeente + " Brussel";
  var embedUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(adres) +
    "&output=embed";

  if (mapMobile) mapMobile.src = embedUrl;
  if (mapDesktop) mapDesktop.src = embedUrl;
}

var inputs = document.querySelectorAll(".location-form input");
if (inputs.length > 0) {
  inputs.forEach(function (input) {
    input.addEventListener("input", updateMap);
  });
}

var inputFoto = document.getElementById("inputFoto");
if (inputFoto) {
  var photoPreview = document.getElementById("photo-preview");
  var photoLabelText = document.getElementById("photo-label-text");
  inputFoto.addEventListener("change", function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
        photoLabelText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}

document.querySelectorAll(".share-location-button").forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
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
          var address = data.address;
          var street =
            (address.road || "") + " " + (address.house_number || "");
          var municipality =
            address.city || address.town || address.municipality || "";
          var postcode = address.postcode || "";

          document.getElementById("inputStraat").value = street;
          document.getElementById("inputGemeente").value = municipality;
          document.getElementById("inputPostcode").value = postcode;

          if (document.getElementById("inputStraatDesktop")) {
            document.getElementById("inputStraatDesktop").value = street;
            document.getElementById("inputGemeenteDesktop").value =
              municipality;
            document.getElementById("inputPostcodeDesktop").value = postcode;
          }

          var fullAddress =
            street + " " + postcode + " " + municipality + " Brussel";
          var embedUrl =
            "https://maps.google.com/maps?q=" +
            encodeURIComponent(fullAddress) +
            "&output=embed";
          if (mapMobile) mapMobile.src = embedUrl;
          if (mapDesktop) mapDesktop.src = embedUrl;
        });
    });
  });
});
