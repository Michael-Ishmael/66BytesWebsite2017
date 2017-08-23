
class ScreenQueries {
    static PortraitPhone:string = "(max-width: 420px)";
}

export class ScreenSizeManager {

    private static _instance:ScreenSizeManager;

    private _mql:MediaQueryList;

    private constructor(){
        this._mql = window.matchMedia(ScreenQueries.PortraitPhone);
        this._mql.addListener(this.handleMediaChange)
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    public static get IsSmallPortrait():boolean {
        return ScreenSizeManager.Instance._mql.matches;
    }

    private handleMediaChange(mql:MediaQueryList){

        console.log(mql);

    }

}