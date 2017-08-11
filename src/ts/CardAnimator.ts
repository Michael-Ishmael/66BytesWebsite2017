import {TweenLite} from "gsap";

const jQueryMargin: number = 5;

export class CardAnimator {

  private tileClass: string = ".exp-tile";
  private _dupes: AnimTile[] = [];

  constructor() {

  }

  init() {

    $(this.tileClass).click(e => {
      this.createDupes(e.currentTarget);
    })

  }

  private createDupes(item: any) {

    let that = this;
    let targ: JQuery = null;
    $(this.tileClass).each(function (index) {

      let el = $(this);
      let offset = el.offset();
      let dupe = el.clone();


      dupe.css({
        position: 'absolute',
        left: offset.left - jQueryMargin,
        top: offset.top - jQueryMargin,
        width: el.width(),
        height: el.height(),
        zIndex: 50
      });
      $('body').append(dupe);
      that._dupes.push(new AnimTile(dupe));

      if (this === item) {
        targ = dupe;
      } else {

      }
      setTimeout(function () {
        el.hide();
      }, 10);
//el.hide();

    });

    if (targ) {
      let dims = that.getBoxDims();
      let center = dims.center();

      //let targX = center.x - (targ.width() / 2) - jQueryMargin;
      let targY = center.y - (targ.height() / 2) - jQueryMargin;
      let margin = 5;
      let targetWidth = 60;
      let totalWidth = (that._dupes.length * (targetWidth + margin)) - margin;
      let startLeft = center.x - (totalWidth / 2);
      let i = 0;
      for (let dupe of that._dupes) {
        let targX = startLeft + (dupe.positionIndex * (targetWidth + margin));
        TweenLite.to(dupe.el, 3, {left: targX , top: targY, width: targetWidth, height: targetWidth});
        TweenLite.to(dupe.el, 1, {backgroundColor: 'transparent'});
        TweenLite.to(dupe.el.find('.exp-icon'), 3, {yPercent: 60});
        TweenLite.to(dupe.el.find('h2'), .5, {opacity: 0});
        i++;
      }

      //TweenLite.to(targ, 3, { left: targX, top: targY});
    }

  }

  private getBoxDims(): BoxDims {

    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    let boxHeight: number = 0;
    let boxWidth: number = 0;
    this._dupes.forEach(dup => {
      if (dup.dims.left < x1 || x1 === 0) x1 = dup.dims.left;
      if (dup.dims.top < x1 || y1 === 0) y1 = dup.dims.top;
      if (dup.dims.right > x2 || x1 === 0) x2 = dup.dims.right;
      if (dup.dims.bottom > y2 || x1 === 0) y2 = dup.dims.bottom;
      if (dup.dims.width > boxWidth) boxWidth = dup.dims.width;
      if (dup.dims.height > boxHeight) boxHeight = dup.dims.height;
    });

    let dims = new BoxDims(x1, y1, x2 - x1, y2 - y1);
    let rowCount = 0;
    let colCount = 0;


    this._dupes.forEach(dup =>{
      dup.col = Math.floor(((dup.dims.left - dims.left) / boxWidth) + 1);
      dup.row = Math.floor(((dup.dims.top - dims.top) / boxHeight) + 1);

      if (dup.col > colCount) colCount = dup.col;
      if (dup.row > rowCount) rowCount = dup.row;
    });

    let positionIndex = 0;

    for (let c = 1; c <= colCount; c++) {
      for (let r = 1; r <= rowCount; r++) {

          let tile = this._dupes.find(d => d.row === r && d.col === c);
          if(tile){
            tile.positionIndex = positionIndex;
            positionIndex++;
          }
      }
    }

    return dims;
  }

}

class AnimTile {

  public row: number = -1;
  public col: number = -1;
  public positionIndex: number = -1;
  public dims: BoxDims = null;


  constructor(public el: JQuery) {
    this.initFromEl();
  }

  private initFromEl() {
    const off = this.el.offset();
    this.dims = new BoxDims(off.left, off.top, this.el.width(), this.el.height());

  }
}

interface Point {
  x: number
  y: number
}

class BoxDims {

  public right: number;
  public bottom: number;

  constructor(public left: number,
              public top: number,
              public  width: number,
              public height: number) {
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

  }


  center(): Point {

    return {
      x: this.left + (this.width / 2),
      y: this.top + (this.height / 2)
    };

  }


}

