var textWrapper = document.querySelector('.elem');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");


anime.timeline({loop: true})
.add({
  targets: '.elem .letter',
  scale: [4,1],
  opacity: [0,1],
  translateZ: 0,
  easing: "easeOutExpo",
  duration: 950,
  delay: (el, i) => 70*i
}).add({
  targets: '.elem',
  opacity: 0,
  duration: 1000,
  easing: "easeOutExpo",
  delay: 1000
});

var textWrapper = document.querySelector('.elem1');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");


anime.timeline({loop: true})
.add({
  targets: '.elem1 .letter',
  scale: [4,1],
  opacity: [0,1],
  translateZ: 0,
  easing: "easeOutExpo",
  duration: 950,
  delay: (el, i) => 70*i
}).add({
  targets: '.elem1',
  opacity: 0,
  duration: 1000,
  easing: "easeOutExpo",
  delay: 1000
});

anime({
  targets: '.elem2',
  width: '100%', // -> from '28px' to '100%',
  easing: 'easeInOutQuad',
  direction: 'alternate',
  loop: true,
  delay:6000
});


//   $(document).ready(function() {    
//     /* Every time the window is scrolled ... */
//     $(window).scroll( function(){    
//         /* Check the location of each desired element */
//         $('.elem').each( function(i){            
//             var bottom_of_object = $(this).position().top + $(this).outerHeight();
//             var bottom_of_window = $(window).scrollTop() + $(window).height();

//             /* If the object is completely visible in the window, fade it it */
//             if( bottom_of_window > bottom_of_object ){

//             }            
//         });     
//     });    
// });

