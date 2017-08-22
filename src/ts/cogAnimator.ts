import {Elastic, TweenMax, TimelineLite, Back, Bounce, Power0} from "gsap";

declare module "gsap" {
    export interface TweenConfig {
        [p: string]: any;
    }
}

export class CogAnimator {


    init(){
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
    }



}