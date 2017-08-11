/// <reference path ="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path ="../node_modules/@types/gsap/index.d.ts"/>

class CardAnimator {

  private tileClass:string = ".exp-tile";
  private _dupes = [];

  constructor(){

  }

  init(){

    $(this.tileClass).click(e => {
      this.createDupes(e);
    })

  }

  private createDupes(item:any){


    $(this.tileClass).each(i => {

      let el = $(this);
      let offset = el.offset();
      let dupe = el.clone();

      this._dupes.push(dupe);
      dupe.css({position:'absolute', left: offset.left-5, top: offset.top -5, width: el.width(), height: el.height()});
      $('body').append(dupe);

      //TweenMax.to(dupe, 3, {backgroundColor:'red'});

    })
  }

}




