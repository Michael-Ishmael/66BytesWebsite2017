import {TileAnimator } from "./ts/cardAnimator"
import "bootstrap"
import {PhoneMenu} from "./ts/phoneMenu";
import { CogAnimator } from "./ts/cogAnimator"
import { ScrollManager } from "./ts/scrollManager"

let anim = new TileAnimator();
anim.init();

let menu = new PhoneMenu();
menu.init();

let cogs = new CogAnimator();
cogs.init();

let scrolling = new ScrollManager();
scrolling.init();

//document.write("Testing 3");
//console.log("Hello World");