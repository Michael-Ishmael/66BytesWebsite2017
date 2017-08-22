import {Elastic, TweenLite, TimelineLite, Back, Bounce} from "gsap";

const jQueryMargin: number = 5;
const tileClassName: string = "#expertiseCards > .exp-tile";
const tileContainer = "#cardContainer";

enum ExpertiseViewState {
    Tiles,
    Carousel,
    Transitioning
}

enum Orientation {
    Landscape,
    Portrait
}

class TileElementSelector {
    static ExpertiseSectionContainer = "section#expertise";
    static SectionHeader = "";
    static TileContainer = "#expertiseCards";
    static OriginalTiles = "#expertiseCards > .exp-tile";
    static DupeTileClass = "";
    static CarouselIconBox = "carouselIconBox";  //Don't need hash for this one
    static CarouselContainer = "#carouselContainer";
    static Carousel = "#expertiseCarousel";
}

class TileMeasurements {

    margin:number = 10;
    maxAllowedCarouselAreaHeight:number = 620;
    landscape: boolean;
    widthOfAvailableSpace: number;
    heightOfAvailableSpace: number;
    tileContainerTop:number;

    get targetIconWidth(): number{
        return Math.min(60, Math.floor((document.body.clientWidth - (this.margin * 2)) / 6));

        //return Math.min(Math.max(Math.floor(this.maxDimensionLength / 12), 30), 60);
    }
    get targetIconHeight(): number{
        return Math.min(60, Math.floor((document.body.clientWidth - (this.margin * 2)) / 6));
    }
    get maxDimensionLength():number {
        if(this.heightOfAvailableSpace > this.widthOfAvailableSpace)
            return this.heightOfAvailableSpace;
        return this.widthOfAvailableSpace;
    }
    totalIconSetLength: number;
    tilesCenterX: number;
    tilesCenterY: number;
    iconContainerLeft:number;
    iconContainerTop:number;
    iconContainerOffsetLeft:number;
    iconContainerOffsetTop:number;
    interimIconPositionStartLeft:number;
    interimIconPositionStartTop:number;
    carouselAreaTop: number;

    get carouselContainerLeft():number{
        return this.landscape ?  this.margin : this.targetIconWidth;
    }

/*
    get carouselContainerTop():number{
        return this.margin; // this.landscape ? this.widthOfAvailableSpace: this.widthOfAvailableSpace - (this.targetIconWidth) ;
    }
*/

    get carouselContainerRight():number{
        return this.margin; // this.landscape ? this.widthOfAvailableSpace: this.widthOfAvailableSpace - (this.targetIconWidth) ;
    }

    get carouselContainerBottom():number{
        let v = this.landscape ? this.targetCarouselAreaBottom + (this.targetIconHeight + this.margin)  : this.targetCarouselAreaBottom ;
        return v;
    }

    get targetCarouselAreaBottom(): number{
        return this.heightOfAvailableSpace - (Math.min(this.heightOfAvailableSpace, this.maxAllowedCarouselAreaHeight) - this.margin)
    }

}

export class TileAnimator {

    private _animatedTiles: AnimTile[] = [];
    private _jSectionContainer: JQuery;
    private _jTileContainer: JQuery;
    private _jOriginals: JQuery;
    private _jCarouselContainer: JQuery;
    private _jCarousel: any;
    private _boxHeight: number = -1;
    private _boxWidth: number = -1;
    private _viewState: ExpertiseViewState = ExpertiseViewState.Tiles;

    private _currentIndex: number = -1;
    private _timeline:TimelineLite;

    constructor() {

    }

    init() {
        this.initJElements();
        this._jCarousel.on("slide.bs.carousel", e => {
            this.handleCarouselSlide(e)
        });

        $(tileClassName).click(e => {
            this.handleTileClick(e);
        })

    }


    handleTileClick(e) {

        if (this._viewState == ExpertiseViewState.Tiles) {
            this.createDupes(e.currentTarget);
            return;
        }

    }

    handleIconClick(icon: AnimTile) {
        if (this._viewState == ExpertiseViewState.Carousel) {
            this.changeIndex(icon.positionIndex);
        }
    }

    private initJElements(): void {
        this._jSectionContainer = $(TileElementSelector.ExpertiseSectionContainer);
        this._jTileContainer = $(TileElementSelector.TileContainer);
        this._jOriginals = $(TileElementSelector.OriginalTiles);
        this._jCarouselContainer = $(TileElementSelector.CarouselContainer);
        this._jCarousel = $(TileElementSelector.Carousel);
    }

    private createDupes(item: any) {

        let m = this.calculateInitialMeasurements();

        // -- control box --
        let controlBox = this.addIconControlContainer(m);

        // -- interim position --
        //this.showGuideBox(controlBox, m);

        // -- start tiles --
        this.makeDupes(m, controlBox, item);

        this.setPositions(m.landscape);

        let clickTarget: AnimTile;

        this._animatedTiles.forEach(dupe => {

            dupe.targetLeft = m.landscape ? m.interimIconPositionStartLeft + (dupe.positionIndex * m.targetIconWidth) : m.interimIconPositionStartLeft;
            dupe.targetTop = m.landscape ? m.interimIconPositionStartTop : m.interimIconPositionStartTop + (dupe.positionIndex * m.targetIconHeight);
            if (dupe.chosenItem) clickTarget = dupe;
        });

        this.positionCarouselContainer(m);

        this.createTimeline(m, clickTarget);
        this._timeline.play();
    }

    private showGuideBox(controlBox: JQuery, m: TileMeasurements) {
        let positionBox = TileAnimator.createJElement("div", "testInterimPositionBox", null, controlBox)
        positionBox.css({
            position: "absolute",
            top: m.interimIconPositionStartTop,
            left: m.interimIconPositionStartLeft,
            width: m.landscape ? m.totalIconSetLength : m.targetIconWidth,
            height: m.landscape ? m.targetIconHeight : m.totalIconSetLength,
            backgroundColor: "blue",
            zIndex: 10,
            opacity: .5
        });
    }

    private createTimeline(m:TileMeasurements, clickTarget:AnimTile):void {

        let that = this;
        const tl = new TimelineLite({
            onComplete: function () {
                that._viewState = ExpertiseViewState.Carousel;

            }
        });
        tl.add("start");

        let tiles = $('.exp-tile-icon');
        if(clickTarget){
            tl.to(clickTarget.el.find('h2'), .5, {color: "#c7202a"}, "start");
            tl.to(clickTarget.el.find('.cls-1'), .5, {className: "cls-2"}, "start");
        }
        tl.to(tiles.find(".exp-tile-background"), .3, {backgroundColor: "rgba(61, 69, 71, 0)"}, "-=.2");
        tl.add("move", "-=0.1");
        this._animatedTiles.forEach(dupe => {
            tl.to(dupe.el, .5, {
                left: dupe.targetLeft,
                top: dupe.targetTop,
                width: m.targetIconWidth,
                height: m.targetIconHeight,

            }, "move");
            tl.to(dupe.el.find('h2'), .3, {opacity: 0, fontSize: ".02rem"}, "move");
        });

        tl.add("drop");
        //let halfDistance = landscape ? startTop / 2 : startLeft / 2;

        if (m.landscape) {
            //tl.staggerTo(tiles, .4, {"top": "-=" + halfDistance.toString(), ease: Back.easeIn.config(1)}, 0.1,"drop");
            tl.staggerTo(tiles, .6, {"top": "0", ease: Bounce.easeOut}, 0.04, "drop");
        } else {
            //   tl.to(tiles, .4, {"left": "-=" + halfDistance.toString(), ease: Back.easeIn.config(1)}, "drop");
            tl.staggerTo(tiles, .6, {"left": "0", ease: Bounce.easeOut}, 0.04, "drop");
        }
        tl.add("carousel", "-=0.3");
        if(clickTarget){
            if (m.landscape) {
                tl.to(clickTarget.el.find('.exp-tile-content'), .3, {top: "-=10"});
            } else {
                tl.to(clickTarget.el.find('.exp-tile-content'), .3, {left: "+=10"});
            }
        }

        tl.to(this._jCarouselContainer, 1, {autoAlpha: 1, display: 'block'}, "carousel");
        if (clickTarget) {
            this._currentIndex = clickTarget.positionIndex;
            this.changeIndex(clickTarget.positionIndex);
        }

        this._viewState = ExpertiseViewState.Transitioning;

        this._timeline = tl;
    }

    private makeDupes(m: TileMeasurements, controlBox: JQuery, item: any) {
        let that = this;
        this._jOriginals.each(function () {
            that.createAnimatedTile(m, $(this), controlBox, item === this);
        });
        setTimeout(function () {
            that._jTileContainer.hide();
        }, 10);
        return that;
    }

    private createAnimatedTile(m:TileMeasurements, original:JQuery, newParent:JQuery, isSelectedTile:boolean){

        let offset = original.offset();
        let dupe = original.clone(); //$("<div class='tiley' style='padding: 5px'><div style='height: 100%; background-color: green'></div></div>"); //
        let dupeLeft = offset.left - m.iconContainerOffsetLeft;
        let dupeTop = offset.top - m.iconContainerOffsetTop;
        let dupeWidth = original.outerWidth();
        let dupeHeight = original.outerHeight();
        dupe.css({
            position: 'absolute',
            left: dupeLeft,
            top: dupeTop,
            width: dupeWidth,
            height: dupeHeight,
            zIndex: 50,
        });
        dupe.attr("class", "exp-tile exp-tile-icon");
        newParent.append(dupe);

        const tile = new AnimTile(dupe, this);
        tile.chosenItem = isSelectedTile;
        this._animatedTiles.push(tile);
    }

    private addIconControlContainer(m:TileMeasurements, showGuide:boolean = false):JQuery{

        // -- control box --
        let controlBox = TileAnimator.createJElement("div", TileElementSelector.CarouselIconBox, null, this._jSectionContainer);

        controlBox.css({
            position: "absolute",
            width: m.landscape ? m.totalIconSetLength : m.targetIconWidth,
            height: m.landscape ? m.targetIconHeight : m.totalIconSetLength,
            zIndex: 100,
        });

        if(showGuide){
            controlBox.css("backgroundColor", "red")
        }

        if (m.landscape) {
            controlBox.css({
                bottom: m.targetCarouselAreaBottom,
                left: "50%",
                marginLeft: m.totalIconSetLength / 2 * -1,
            });
        } else {
            controlBox.css({
                top: m.tileContainerTop,
                left: 0,
            });
        }

        let controlBoxPosition = controlBox.position();
        m.iconContainerLeft = controlBoxPosition.left;
        m.iconContainerTop = controlBoxPosition.top;

        let controlBoxOffset = controlBox.offset();
        m.iconContainerOffsetLeft = controlBoxOffset.left;
        m.iconContainerOffsetTop = controlBoxOffset.top;

        m.interimIconPositionStartLeft = m.landscape ? 0 : (m.tilesCenterX - ( m.targetIconWidth / 2) ) - m.iconContainerLeft;
        m.interimIconPositionStartTop = m.landscape ? (m.tilesCenterY - ( m.targetIconHeight / 2)) - m.iconContainerTop : 0;

        return controlBox;
    }

    private positionCarouselContainer(m:TileMeasurements){

        this._jCarouselContainer.css({
            top: m.carouselAreaTop,
            left: m.carouselContainerLeft,
            right: m.carouselContainerRight,
            bottom: m.carouselContainerBottom
        });


    }

    private calculateInitialMeasurements():TileMeasurements{

        let tileBoxDims = this.calculateIconContainer();

        let m = new TileMeasurements();
        m.carouselAreaTop = this._jTileContainer.position().top + m.margin;
        m.heightOfAvailableSpace = this._jSectionContainer.innerHeight() - m.carouselAreaTop;
        m.widthOfAvailableSpace = this._jSectionContainer.width();
        m.landscape = true; //tileBoxDims.orientation == Orientation.Landscape;
        m.totalIconSetLength = this._jOriginals.length * (m.landscape ? m.targetIconWidth : m.targetIconHeight);
        m.tilesCenterX = tileBoxDims.center.x;
        m.tilesCenterY = tileBoxDims.center.y;
        m.tileContainerTop = tileBoxDims.top;

        return m;

    }

    private static createJElement(type:string, id:string = null, cssClass:string = null, parent:JQuery = null):JQuery{

        let htmlString = `<${type}`;
        if(id) htmlString += ` id="${id}"`;
        if(cssClass) htmlString += ` class="${cssClass}"`;
        htmlString += `></${type}>`;

        let jEl = $(htmlString);
        if(parent) parent.append(jEl);

        return jEl;

    }

    private calculateIconContainer(): BoxDims {

        let contOffset = this._jSectionContainer.offset();
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        let that = this;
        this._jOriginals.each(function (index) {

            let el = $(this);
            let offset = el.offset();

            let tileLeft = offset.left - contOffset.left;
            let tileTop = offset.top - contOffset.top;
            let tileWidth = el.outerWidth(true);
            let tileHeight = el.outerHeight(true);
            let tileRight = tileLeft + tileWidth;
            let tileBottom = tileTop + tileHeight;

            if (tileLeft < x1 || x1 === 0) x1 = tileLeft;
            if (tileTop < x1 || y1 === 0) y1 = tileTop;
            if (tileRight > x2 || x1 === 0) x2 = tileRight;
            if (tileBottom > y2 || x1 === 0) y2 = tileBottom;
            if (tileWidth > that._boxWidth) that._boxWidth = tileWidth;
            if (tileHeight > that._boxHeight) that._boxHeight = tileHeight;
        });

        return new BoxDims(x1, y1, x2 - x1, y2 - y1);

    }

    private changeIndex(newIndex: number) {
        if(this._jCarousel && this._jCarousel.carousel)
            this._jCarousel.carousel(newIndex);
    }

    private handleCarouselSlide(e) {
        if (e && (e.to || e.to === 0)) {
            if (this._currentIndex != e.to) {
                this._animatedTiles.forEach(dupe => {
                    if (dupe.positionIndex == this._currentIndex) {
                        TweenLite.to(dupe.el.find('.exp-tile-content'), .3, {top: "+=10"});
                        TweenLite.to(dupe.el.find('.cls-2'), .5, {className: "cls-1"});
                    }
                    if (dupe.positionIndex == e.to) {
                        TweenLite.to(dupe.el.find('.exp-tile-content'), .3, {top: "-=10"});
                        TweenLite.to(dupe.el.find('.cls-1'), .5, {className: "cls-2"});
                    }
                });
                this._currentIndex = e.to;
            }
        }
    }


    private setPositions(landscape:boolean): void {
        let seedValue = -10000;
        let x1 = seedValue, x2 = seedValue, y1 = seedValue, y2 = seedValue, tileWidth = seedValue, tileHeight = seedValue;

        this._animatedTiles.forEach(dup => {
            if (dup.dims.left < x1 || x1 === seedValue) x1 = dup.dims.left;
            if (dup.dims.top < y1 || y1 === seedValue) y1 = dup.dims.top;
            if (dup.dims.right > x2 || x2 === seedValue) x2 = dup.dims.right;
            if (dup.dims.bottom > y2 || y2 === seedValue) y2 = dup.dims.bottom;
            if (dup.dims.width > tileWidth) tileWidth = dup.dims.width;
            if (dup.dims.height > tileHeight) tileHeight = dup.dims.height;
        });

        let boxDims = new BoxDims(x1, y1, x2 - x1, y2 - y1);
        let rowCount = 0;
        let colCount = 0;




        this._animatedTiles.forEach(dup => {
            dup.col = Math.round(((dup.dims.left - boxDims.left) / tileWidth) + 1);
            dup.row = Math.round(((dup.dims.top - boxDims.top) / tileHeight) + 1);

            if (dup.col > colCount) colCount = dup.col;
            if (dup.row > rowCount) rowCount = dup.row;
        });

        let positionIndex = 0;

        //let landscape = rowCount >= colCount;

        let outerCount = landscape ? colCount : rowCount;
        let innerCount = landscape ? rowCount : colCount;

        for (let o = 1; o <= outerCount; o++) {
            for (let i = 1; i <= innerCount; i++) {

                let r = landscape ? i : o;
                let c = landscape ? o : i;

                let tile = this._animatedTiles.find(d => d.row === r && d.col === c);
                if (tile) {
                    //tile.positionIndex = positionIndex;
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


    constructor(public el: JQuery, public animator: TileAnimator) {
        this.initFromEl();
    }

    get positionIndex(): number {
        return this._positionIndex;
    }

    set positionIndex(value: number) {
        this._positionIndex = value;
        this.el.data("index", value);
        this.el.click(e => {
            this.handleClick();
        })
    }

    private initFromEl() {
        const off = this.el.position();
        this.dims = new BoxDims(off.left, off.top, this.el.outerWidth(), this.el.outerHeight());
        this.positionIndex = parseInt(this.el.data("index")) - 1;
    }

    private handleClick(): void {
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


    public get center(): Point {

        return {
            x: this.left + (this.width / 2),
            y: this.top + (this.height / 2)
        };

    }

    public get orientation(): Orientation {
        if (this.width >= this.height)
            return Orientation.Landscape;
        return Orientation.Portrait
    }


}

