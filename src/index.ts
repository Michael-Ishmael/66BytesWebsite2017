import {CardAnimator } from "./ts/cardAnimator"
import "bootstrap"
import {PhoneMenu} from "./ts/phoneMenu";



let anim = new CardAnimator();
anim.init();

let menu = new PhoneMenu();
menu.init();

//document.write("Testing 3");
//console.log("Hello World");