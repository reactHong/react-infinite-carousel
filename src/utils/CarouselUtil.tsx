/**
 * The direction that the carousel moves
 */
export type Direction = 'prev' | 'next' | 'none';

/**
 * The type of each of carousel items. 
 * An item has the data of what can be shown when the carousel has been displayed. 
 * The count of items can be more than the maximum card count of carousel.
 * TODO: This type matches Restaurant object currently, but it should be changed to be general.
 * @property {string} id
 * @property {string} blurhash Image representation
 * @property {string} launch_date The date when the restaurant was added to Wolt app (ISO 8601 date)
 * @property {number[]} location Restaurant's location as latitude and longitude coordinates. First element in the list is the longitude (a list containing two decimal elements)
 * @property {string | "emptyCard"} name The name of the restaurant. The empty item should have 'emptyCard'.
 * @property {boolean} online If true, the restaurant is accepting orders. If false, the restaurant is closed
 * @property {number} popularity the higher the number, the more popular the restaurant is in Wolt app (type: a float between 0 - 1, where 1 is the - most popular restaurant)
 */
export type Item = {
  id: string;
  blurhash: string;
  launch_date: string;
  location: number[];
  name: string | "emptyCard";
  online: boolean;
  popularity: number;
};

/**
 * A carousel uses CardInfo for layouting each of cards of carousel. 
 * The count of cards is same as the maximum card count of carousel.
 * @property {number} width The width of each of cards
 * @property {number} imageHeight The height of an image in a carousel card. It is decided by the width and image height/width ratio
 * @property {number} gap The gap between two cards. It would set to margin-right.
 */
export type CardInfo = {
  width: number;
  imageHeight: number;
  gap: number;
};

/**
 * The range indicates index of items array. 
 * With the range, the carousel knows there is no previous or next item to move on.
 * For example,
 * If the carousel has 10 items, and the maximum count of cards to be shown is 5,
 * Items:               [a, b, c, d, e, f, g, h, i, j]
 * Displayed carousel:        [c, d, e, f, g]
 * Range(index):               ↑           ↑
 *                          first(=2)    last(=6) 
 * @property The first index of a carousel in items
 * @property The last index of a carousel in items
 */
export type CarouselRange = {
  first: number;
  last: number;
};

/**
 * The animation duration when carousel transitioning
 */
export const ANIMATION_DURATION: number = 0.3;

/**
 * The empty card name for recognizing this card is empty card.
 */
export const EMPTY_ITEM_NAME: string = "emptyCard";

/**
 * Get 'translateX' value of transform CSS property. 
 * TODO: Consider cross browsing.
 * TODO: Test if this function is perfect for all cases. Then, it can move to common util for general purpose.
 * @param element <div> element
 */
export const getElementTranslateX = (element: HTMLDivElement): number => {
  const style: CSSStyleDeclaration = window.getComputedStyle(element);
  const values = style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map(numStr => parseInt(numStr));
  return transform[0];
};

/**
 * Get 'translateX' value of transform CSS property. 
 * NOTE: DOMMatrixReadOnly was mainly used for extracting values from transform, but DOMMatrixReadOnly is not supported with react-testing-library.
 * @param element <div> element
 */
// export const getElementTranslateX = (element: HTMLDivElement): number => {
//   const style: CSSStyleDeclaration = window.getComputedStyle(element);
//   const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
//   const translateX = matrix.m41;
//   return translateX;
// };


/**
 * Get a new CardInfo by the carousel width.
 * @param carouselWidth The width of a carousel
 * @param maxCarouselCardNum The maximum card count of carousel to be shown
 */
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

/**
 * This checker manages current items and the range of carousel. 
 * So, the checker knows that the previous or next item is empty and whether reordering.
 * @param originItems The initial items of a carousel
 * @param maxCarouselCardNum The maximum card count of carousel to be shown
 */
export const carouselChecker = (originItems: Item[], maxCarouselCardNum: number) => {
  const items: Item[] = [...originItems];
  const range: CarouselRange = {
    first: 0,
    last: maxCarouselCardNum - 1,
  };

  const getItems = () => [...items];
  const getRange = () => ({ ...range });
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
    getRange,
    prev,
    next,
  }
};
