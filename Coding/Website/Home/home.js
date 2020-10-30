function on() {
  document.getElementById("overlay").style.display = "block";
  console.log("on");
}

function off() {
  document.getElementById("overlay").style.display = "none";
  console.log("off");
}
function myFunction() {
  var element = document.getElementsByClassName("homepageBanner")[0];
  console.log(element.classList);

  if (element.classList.contains("dark-mode-wrapper")) {
    element.classList.remove("dark-mode-wrapper");
    element.classList.add("light-mode-wrapper");
  } else if (element.classList.contains("light-mode-wrapper")) {
    element.classList.remove("light-mode-wrapper");
    element.classList.add("dark-mode-wrapper");
  } else if (
    !element.classList.contains("light-mode-wrapper") &&
    !element.classList.contains("dark-mode-wrapper")
  ) {
    element.classList.add("dark-mode-wrapper");
  } //darkmode for  homepage banner//

  console.log (element.classList);

  var element = document.getElementsByClassName("container")[0];
  console.log(element.classList);

  
   if (element.classList.contains("dark-mode-wrapper")) {
    element.classList.remove("dark-mode-wrapper");
    element.classList.add("light-mode-wrapper");
  } else if (element.classList.contains("light-mode-wrapper")) {
    element.classList.remove("light-mode-wrapper");
    element.classList.add("dark-mode-wrapper");
  } else if (
    !element.classList.contains("light-mode-wrapper") &&
    !element.classList.contains("dark-mode-wrapper")
  ) {
    element.classList.add("dark-mode-wrapper");
  }
  console.log (element.classList);

} //dark mode for nav bar//
