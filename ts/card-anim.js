/// <reference path ="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path ="../node_modules/@types/gsap/index.d.ts"/>
var CardAnimator = (function () {
    function CardAnimator() {
        this.tileClass = ".exp-tile";
        this._dupes = [];
    }
    CardAnimator.prototype.init = function () {
        var _this = this;
        $(this.tileClass).click(function (e) {
            _this.createDupes(e);
        });
    };
    CardAnimator.prototype.createDupes = function (item) {
        var _this = this;
        $(this.tileClass).each(function (i) {
            var el = $(_this);
            var offset = el.offset();
            var dupe = el.clone();
            _this._dupes.push(dupe);
            dupe.css({ position: 'absolute', left: offset.left - 5, top: offset.top - 5, width: el.width(), height: el.height() });
            $('body').append(dupe);
            //TweenMax.to(dupe, 3, {backgroundColor:'red'});
        });
    };
    return CardAnimator;
}());
//# sourceMappingURL=card-anim.js.map