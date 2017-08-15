import {Elastic, TweenLite, TimelineLite, Back, Bounce} from "gsap";

const jQueryMargin: number = 5;
const tileClassName: string = ".exp-tile";

enum ExpertiseViewState {
    Tiles,
    Carousel,
    Transitioning
}

export class CardAnimator {

    private _dupes: AnimTile[] = [];
    private _originals: JQuery[] = [];
    private _containerDims: BoxDims;
    private _boxHeight: number = -1;
    private _boxWidth: number = -1;
    private _viewState: ExpertiseViewState = ExpertiseViewState.Tiles;
    private _jCarousel: any;
    private _currentIndex: number = -1;

    constructor() {

    }

    init() {
        this._jCarousel = $("#expertiseCarousel");
        this._jCarousel.on("slide.bs.carousel", e => { this.handleCarouselSlide(e)});

        $(tileClassName).click( e => {
            this.handleTileClick(e);
        })

    }

    handleTileClick(e) {

        if (this._viewState == ExpertiseViewState.Tiles) {
            this.createDupes(e.currentTarget);
            this.playAnim();
            return;
        }

    }

    handleIconClick(icon:AnimTile){
        if (this._viewState == ExpertiseViewState.Carousel) {
            this.changeIndex(icon.positionIndex);
        }
    }

    private createDupes(item: any) {

        let that = this;
        let targ: JQuery = null;
        $(tileClassName).each(function (index) {

            let el = $(this);
            let offset = el.offset();
            let dupe = el.clone();
            let targetwidth=  el.width() + (jQueryMargin * 2);
            let targetHeight=  el.height() + (jQueryMargin * 2);
            dupe.css({
                position: 'absolute',
                left: offset.left,
                top: offset.top,
                width: targetwidth,
                height: targetHeight,
                zIndex: 50,
                //background: "blue"
            });
            dupe.attr("class", "exp-tile");
            $('body').append(dupe);
            const tile = new AnimTile(dupe, that);
            tile.chosenItem = this === item;
            that._dupes.push(tile);
            that._originals.push(el);
            setTimeout(function () {
                //el.css({background: "red"});
                el.hide();
            }, 10);
        });
    }

    private playAnim(): void {

        this.setBoxDims();


        const margin = jQueryMargin, targetWidth = 60, targetHeight = 60;
        let center = this._containerDims.center();
        let targY = center.y - (this._boxHeight / 2) - jQueryMargin;
        let totalWidth = (this._dupes.length * (targetWidth + margin)) - margin;
        let startLeft = center.x - (totalWidth / 2);

        let clickTarget: AnimTile;

        this._dupes.forEach(dupe => {

            dupe.targetLeft = startLeft + (dupe.positionIndex * (targetWidth + margin));
            dupe.targetTop = targY;
            if (dupe.chosenItem) clickTarget = dupe;
        });

        const that = this;
        const tl = new TimelineLite({ onComplete: function(){
            that._viewState = ExpertiseViewState.Carousel;

        }});

        tl.add("start");
        //targY = clickTarget.dims.top - 20;
        //tl.to(clickTarget.el, .8, {top:"-=50", ease: Elastic.easeOut.config(2, 1)}, "start");
        //tl.to(clickTarget.el.find('.exp-tile-content'), .8, {top:"-=20", ease: Elastic.easeOut.config(2, 1)}, "start");
        tl.to(clickTarget.el.find('h2'), .5, {color: "#c7202a"}, "start");
        tl.to(clickTarget.el.find('.cls-1'), .5, {className: "cls-2"}, "start");
        tl.to($(tileClassName).find(tileClassName + "-background"), .3, {backgroundColor: "rgba(61, 69, 71, 0)"}, "-=.2");
        tl.add("move", "-=0.1");

        this._dupes.forEach(dupe => {
            //tl.to(clickTarget.el.find('.exp-tile-content'), .8, {top:"50%"}, "move");
            tl.to(dupe.el, .5, {
                left: dupe.targetLeft,
                top: dupe.targetTop,
                width: targetWidth,
                height: targetHeight
            }, "move");
            //tl.to(dupe.el, .6, {backgroundColor: "rgba(61, 69, 71, 0)"}, "move");
            // tl.to(dupe.el.find('.exp-icon'), .5, {yPercent: 80}, "move");
            tl.to(dupe.el.find('h2'), .3, {opacity: 0, fontSize: ".02rem"}, "move");
        });

        tl.add("drop");
        tl.to($(tileClassName), .4, {top: "+=170", ease: Back.easeIn.config(1)}, "drop");
        tl.to($(tileClassName), .6, {top: "+=170", ease: Bounce.easeOut});
        tl.add("carousel", "-=0.3");
        tl.to(clickTarget.el.find('.exp-tile-content'), .3, {top: "-=10"});

        tl.to(this._jCarousel, 1, {autoAlpha: 1, display: 'block'}, "carousel");
        if(clickTarget) {
            this._currentIndex = clickTarget.positionIndex;
            this.changeIndex(clickTarget.positionIndex);
        }

        this._viewState = ExpertiseViewState.Transitioning;

        tl.play()
    }

    private changeIndex(newIndex:number){

        this._jCarousel.carousel(newIndex);
    }

    private handleCarouselSlide(e){
        if(e && e.to){
            if(this._currentIndex != e.to){
                this._dupes.forEach(dupe => {
                    if(dupe.positionIndex == this._currentIndex){
                        TweenLite.to(dupe.el.find('.exp-tile-content'), .3, {top: "+=10"});
                        TweenLite.to(dupe.el.find('.cls-2'), .5, {className: "cls-1"});
                    }
                    if(dupe.positionIndex == e.to){
                        TweenLite.to(dupe.el.find('.exp-tile-content'), .3, {top: "-=10"});
                        TweenLite.to(dupe.el.find('.cls-1'), .5, {className: "cls-2"});
                    }
                });
                this._currentIndex = e.to;
            }
        }
    }

    private setBoxDims(): void {

        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        this._dupes.forEach(dup => {
            if (dup.dims.left < x1 || x1 === 0) x1 = dup.dims.left;
            if (dup.dims.top < x1 || y1 === 0) y1 = dup.dims.top;
            if (dup.dims.right > x2 || x1 === 0) x2 = dup.dims.right;
            if (dup.dims.bottom > y2 || x1 === 0) y2 = dup.dims.bottom;
            if (dup.dims.width > this._boxWidth) this._boxWidth = dup.dims.width;
            if (dup.dims.height > this._boxHeight) this._boxHeight = dup.dims.height;
        });

        this._containerDims = new BoxDims(x1, y1, x2 - x1, y2 - y1);
        let rowCount = 0;
        let colCount = 0;


        this._dupes.forEach(dup => {
            dup.col = Math.floor(((dup.dims.left - this._containerDims.left) / this._boxWidth) + 1);
            dup.row = Math.floor(((dup.dims.top - this._containerDims.top) / this._boxHeight) + 1);

            if (dup.col > colCount) colCount = dup.col;
            if (dup.row > rowCount) rowCount = dup.row;
        });

        let positionIndex = 0;

        for (let c = 1; c <= colCount; c++) {
            for (let r = 1; r <= rowCount; r++) {

                let tile = this._dupes.find(d => d.row === r && d.col === c);
                if (tile) {
                    tile.positionIndex = positionIndex;
                    positionIndex++;
                }
            }
        }

    }

}

class AnimTile {

    private _positionIndex: number;

    public row: number = -1;
    public col: number = -1;
    public dims: BoxDims = null;
    public chosenItem: boolean = false;

    public targetLeft: number;
    public targetTop: number;


    constructor(public el: JQuery, public animator:CardAnimator) {
        this.initFromEl();
    }

    get positionIndex(): number {
        return this._positionIndex;
    }

    set positionIndex(value:number){
        this._positionIndex = value;
        this.el.data("index", value);
        this.el.click(e => { this.handleClick();})
    }

    private initFromEl() {
        const off = this.el.offset();
        this.dims = new BoxDims(off.left, off.top, this.el.width(), this.el.height());
    }

    private handleClick():void {
        this.animator.handleIconClick(this);
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

