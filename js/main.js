
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

var controller = new ScrollMagic.Controller();
var scene1 = new ScrollMagic.Scene({
  triggerElement: "#trigger1",
    duration: $(window).height() + 100,
    triggerHook: 0,
    reverse: true
})
    .setPin("#expertise-content")
;
//scene1.setTween(TweenMax.to('body', 1, {backgroundColor:"#9cb1b6", ease:Power3.easeOut}));
var scene2 = new ScrollMagic.Scene({
  triggerElement: "#trigger2"
});
scene2.setTween(TweenMax.to('body', 1, {backgroundColor:"#3d4547", ease:Power3.easeOut}));


controller.addScene(scene1);
controller.addScene(scene2);