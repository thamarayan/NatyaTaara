// anime.timeline({loop: true})
//   .add({
//     targets: '.au-h1 .word',
//     scale: [14,1],
//     opacity: [0,1],
//     easing: "easeOutCirc",
//     duration: 1600,
//     delay: (el, i) => 800 * i
//   }).add({
//     targets: '.au-h1',
//     opacity: 0,
//     duration: 1000,
//     easing: "easeOutExpo",
//     delay: 1000
//   });

  
// var textWrapper = document.querySelector('.elem2');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");


// anime.timeline({loop: true})
// .add({
//   targets: '.elem2 .letter',
//   scale: [4,1],
//   opacity: [0,1],
//   translateZ: 0,
//   easing: "easeOutExpo",
//   duration: 950,
//   delay: (el, i) => 70*i
// }).add({
//   targets: '.elem2',
//   opacity: 0,
//   duration: 1000,
//   easing: "easeOutExpo",
//   delay: 1000
// });


//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}



