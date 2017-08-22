
import "slideout"

declare let Slideout:any;

export class PhoneMenu {

    private _showing:boolean;

  init(){


    $("#menuButton").click(e =>{
      this.toggleMenu();
      $(e.currentTarget).toggleClass("change")
    });

    $("#phoneMenu").find("a").click(e =>{
      this.hideMenu();
      $("#menuButton").toggleClass("change");
    });

  }

  private toggleMenu(){
      if(this._showing) {
          this.hideMenu();
          return
      }
      this.showMenu();
  }

  private showMenu(){
      $("section").addClass("slide-for-menu");
      $("nav.narrow").addClass("show");
      this._showing = true;
  }

  private hideMenu(){
      $("section").removeClass("slide-for-menu");
      $("nav.narrow").removeClass("show");
      this._showing = false;
  }

}