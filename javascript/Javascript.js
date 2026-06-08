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
