
import "slideout"

declare let Slideout:any;

export class PhoneMenu {

  private _slideout:any;

  init(){

    this.initSlideout();

    $("#menuButton").click(e =>{
      this._slideout.toggle();
      $(e.currentTarget).toggleClass("change")
    });

    $("#phoneMenu a").click(e =>{
      this._slideout.close();
      $("#menuButton").toggleClass("change");
    });

  }

  private initSlideout(){
    this._slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('phoneMenu'),
      'padding': 200,
      'tolerance': 70,
      'side': 'right'
    });
  }

}