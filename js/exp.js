/*

 var controller = new ScrollMagic.Controller({
 globalSceneOptions: {
 triggerHook: 'onLeave'
 }});

 $("section").each(function() {

 var id = $(this).attr("id");

 var scene = new ScrollMagic.Scene({
 triggerElement: this // $("#" + id + " h1")[0]
 // , duration: '50%'
 });
 if(id !== "home") {
 scene.setPin(this);
 scene.setClassToggle("header", id + "-active");
 }
 if(id === "expertise") {
 scene.setClassToggle("article", "scroll-article");
 }

 scene.addTo(controller);

 });

 */

$('#trigger1').click(function(){

    var t1 = new TimelineMax();


    for (var i = 0; i < 6; i++) {
        var c = i < 3 ? i : i - 3;
        var label = "exp" + i.toString();
        var delay = i * 0.08;
        t1.add(label, delay);
        t1.from($(".exp-tile").eq(i), .5, {
            //left: -200 * c,
            width: 50
        }, label);
        t1.from($(".exp-tile").eq(i), 1, {
            rotationX: 89,
            rotationY: 89,
            height: 0,
            ease: "Expo.easeInOut"
        }, label);
        t1.fromTo($(".exp-tile").eq(i).children("h2"), .75,
            {
                opacity: 0
            },
            {
            //delay: .07 * i,
            opacity: 1
        }, label);

    }

    t1.play();


        /*,
        TweenMax.to(a.find("li").eq($i).children(".after"), .35, {
            delay: .15 * $i,
            opacity: 0
        });*/

});


$('.exp-tile').click(function(){

    for (var i = 0; i < 6; i++) {

        TweenMax.to($(".exp-tile").eq(i), 4, {
            width: 60,
            height: 60
        });
        TweenMax.to($(".exp-tile").eq(i).children("h2"), 3, {
            opacity: 0,
            fontSize: 0
        });
        TweenMax.to($(".exp-tile").eq(i).children(".exp-icon"), 3, {
            translateY: 0
        })

    }

});