import {Elastic, TweenMax, TimelineLite, Back, Bounce, Power3} from "gsap";


declare let ScrollMagic: any;

export class ScrollManager {


    init() {

        let controller = new ScrollMagic.Controller({
            globalSceneOptions: {
                triggerHook: 'onLeave'
            }
        });

        $("section").each(function () {

            let id = $(this).attr("id");

            let scene = new ScrollMagic.Scene({
                triggerElement: this // $("#" + id + " h1")[0]
                , duration: '60%'
            });
            if (id !== "home") {
                scene.setPin(this);
                scene.setClassToggle("header", id + "-active");
                scene.setClassToggle("body", id + "-active");
            }
/*
            if (id === "expertise") {
                scene.setClassToggle("article", "scroll-article");
            }
*/

            scene.addTo(controller);

        });

        /*       new ScrollMagic.Scene({

               });*/
/*
        let scene1 = new ScrollMagic.Scene({
            triggerElement: "#trigger1"
        });
        scene1.setTween(TweenMax.to('body', 1, {backgroundColor: "#9cb1b6", ease: Power3.easeOut}));
        let scene2 = new ScrollMagic.Scene({
            triggerElement: "#trigger2"
        });
        scene2.setTween(TweenMax.to('body', 1, {backgroundColor: "#3d4547", ease: Power3.easeOut}));
        controller.addScene(scene1);
        controller.addScene(scene2);
*/


// build tween
        //let tween = TweenMax.from("#animate", 0.5, {autoAlpha: 0, scale: 0.7});
/*
// build scene
        let scene = new ScrollMagic.Scene({triggerElement: "a#top", duration: 200, triggerHook: "onLeave"})
           // .setTween(tween)
            .addTo(controller);

// change behaviour of controller to animate scroll instead of jump
        controller.scrollTo(function (newpos) {
            TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
        });

//  bind scroll to anchor links
        $(document).on("click", "a[href^='#']", function (e) {
            let id = $(this).attr("href");
            if ($(id).length > 0) {
                e.preventDefault();

                // trigger scroll
                controller.scrollTo(id);

                // if supported by the browser we can even update the URL.
                if (window.history && window.history.pushState) {
                    history.pushState("", document.title, id);
                }
            }
        });*/
    }


}