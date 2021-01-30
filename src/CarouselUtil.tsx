export type Direction = 'prev' | 'next' | 'none';

export type Item = {
  blurhash: string;
  launch_date: string;
  location: number[];
  name: string | "emptyCard";
  online: boolean;
  popularity: number;
};

export type CardInfo = {
  width: number;
  imageHeight: number;
  gap: number;
};

export type CarouselRange = {
  first: number;
  last: number;
};

export const ANIMATION_DURATION: number = 0.3;

//TODO: EMPTY_ITEM can be changed to copiedItem except the real image URL
export const EMPTY_ITEM: Item = {
  blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
  launch_date: "",
  location: [],
  name: "emptyCard",
  online: false,
  popularity: 0,
};

//TODO: Consider cross browsing
export const getElementTranslateX = (element: HTMLDivElement): number => {
  const style: CSSStyleDeclaration = window.getComputedStyle(element);
  const values = style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map(numStr => parseInt(numStr));
  return transform[0];
};

export const reloadCardInfo = (carouselWidth: number, maxCarouselCardNum: number): CardInfo => {
  const cardGap: number = 10;
  const hvRatio: number = 9 / 16; // Image height/width ratio (16:9)
  const cardWidth: number = (carouselWidth - (cardGap * (maxCarouselCardNum - 1))) / maxCarouselCardNum;
  const imageHeight: number = cardWidth * hvRatio;

  return {
    width: cardWidth,
    imageHeight: imageHeight,
    gap: cardGap,
  };
};

export const carouselChecker = (originItems: Item[], maxCarouselCardNum: number) => {
  const items: Item[] = [...originItems];
  const range: CarouselRange = {
    first: 0,
    last: maxCarouselCardNum - 1,
  };

  const getItems = () => items;
  const isPrevItemEmpty = () => ((range.first === 0) ? true : false);
  const isNextItemEmpty = () => ((range.last >= items.length - 1) ? true : false);

  const prev = (): boolean => {
    let shouldReorder: boolean = false;
    if (isPrevItemEmpty()) {
      items.unshift(items.pop()!);
      shouldReorder = true;
    } else {
      range.first--;
      range.last--;
    }
    return shouldReorder;
  };

  const next = (): boolean => {
    let shouldReorder: boolean = false;
    if (isNextItemEmpty()) {
      items.push(items.shift()!)
      shouldReorder = true;
    } else {
      range.first++;
      range.last++;
    }
    return shouldReorder;
  };

  return {
    getItems,
    prev,
    next,
  }
};
