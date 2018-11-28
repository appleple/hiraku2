declare module "hiraku" {

  interface HirakuOption {
    direction: 'right' | 'left',
    breakpoint: number,
    btn: string,
    btnLabel: string,
    closeLabel: string,
    fixedHeader: string,
    closeBtn: string,
    width: string | number,
    focusableElements: string
  }

  type EventType = 'open' | 'close';

  export default class Hiraku {
    constructor(selector: (string | HTMLElement), option: HirakuOption);
    on(event: EventType, callback: EventListener):void;
    open():void;
    close(callback:() => void)
  }
}