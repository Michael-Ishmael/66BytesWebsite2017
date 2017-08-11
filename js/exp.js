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


$('.logo').click(function () {

    $('#expertiseCarousel').toggle();
    $('#expertiseCards').toggle();

});

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

var cardAnim = new CardAnimator();
cardAnim.init();



/*
$('.exp-tile').click(function(){

    var clicked = $(this);
    var el = clicked.find(".exp-tile");
    if(el.length === 0){
        el = clicked.closest(".exp-tile");
    }


    var dups = [];

    $('.exp-tile').each(function(i){
        var el = $(this);
        var off = el.offset();
        var dup = el.clone();
        dups.push(dup);
        dup.css({position:'absolute', left: off.left-5, top: off.top -5, width: el.width(), height: el.height()});
        $('body').append(dup);
    });

    var x1=0, y1=0, x2=0, y2=0;
    for (var i = 0; i < dups.length; i++) {
        var dup = dups[i];
        if(dup.left() < x1 || x1 === 0) x1 = dup.left();
        if(dup.top() < x1 || y1 === 0) y1 = dup.top();
        if(dup.left() + dup.width() > x2 || x1 === 0) x2 = dup.left() + dup.width();
        if(dup.top() + dup.height() > y2 || x1 === 0) y2 = dup.top() + dup.height();
        
        TweenMax.to(dup, 3, {backgroundColor:'red'});
    }




/*

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


})

*/