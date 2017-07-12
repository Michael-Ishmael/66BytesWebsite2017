
TweenMax.to("#big-cog", 6, {
    rotation:360,
    transformOrigin:"50% 50%",
    repeat: -1,
    ease: Power0.easeNone
});

TweenMax.to("#med-cog", 4, {
    rotation:-360,
    transformOrigin:"50% 50%",
    repeat: -1,
    ease: Power0.easeNone
});

TweenMax.to("#little-cog", 3, {
    rotation:360,
    transformOrigin:"50% 50%",
    repeat: -1,
    ease: Power0.easeNone
});

$("#little-cog").hover(
    function(e){
        TweenMax.to('body', 1, {backgroundColor:"red", ease:Power3.easeOut});
    },
    function(e){
        TweenMax.to('body', 1, {backgroundColor:"black", ease:Power3.easeOut});
    }
);

var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    triggerHook: 'onLeave'
}});

$("section").each(function() {

  var id = $(this).attr("id");

  var scene = new ScrollMagic.Scene({
    triggerElement: this // $("#" + id + " h1")[0]
  });
   if(id !== "home") {
    scene.setPin(this);
      scene.setClassToggle("header", id + "-active")
   }

   scene.addTo(controller);

});

new ScrollMagic.Scene({

});
// var scene1 = new ScrollMagic.Scene({
//   triggerElement: "#trigger1"
// });
// scene1.setTween(TweenMax.to('body', 1, {backgroundColor:"#9cb1b6", ease:Power3.easeOut}));
// var scene2 = new ScrollMagic.Scene({
//   triggerElement: "#trigger2"
// });
// scene2.setTween(TweenMax.to('body', 1, {backgroundColor:"#3d4547", ease:Power3.easeOut}));
//controller.addScene(scene1);
//controller.addScene(scene2);


// build tween
var tween = TweenMax.from("#animate", 0.5, {autoAlpha: 0, scale: 0.7});

// build scene
var scene = new ScrollMagic.Scene({triggerElement: "a#top", duration: 200, triggerHook: "onLeave"})
  .setTween(tween)
  .addTo(controller);

// change behaviour of controller to animate scroll instead of jump
controller.scrollTo(function (newpos) {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
});

//  bind scroll to anchor links
$(document).on("click", "a[href^='#']", function (e) {
  var id = $(this).attr("href");
  if ($(id).length > 0) {
    e.preventDefault();

    // trigger scroll
    controller.scrollTo(id);

    // if supported by the browser we can even update the URL.
    if (window.history && window.history.pushState) {
      history.pushState("", document.title, id);
    }
  }
});

