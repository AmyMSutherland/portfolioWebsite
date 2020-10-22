function on() {
  document.getElementById("overlay").style.display = "block";
  console.log("on");
}

function off() {
  document.getElementById("overlay").style.display = "none";
  console.log("off");
}
function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
} //Attempting for dark mode//