import React, { useEffect, useRef, useState } from 'react';
import CarouselHeader from './CarouselHeader';
import CarouselTrack, { Direction } from './CarouselTrack';
import { Item, CardInfo } from './CarouselCard';
import { getElementTranslateX } from '../utils/Util';

type CarouselProps = {
  title: string;
  propsItems: Item[];
  maxCarouselCardNum: number;
};

type CarouselState = {
  carouselWidth: number;
  cardInfo: CardInfo;
  carouselRange: CarouselRange;
  items: Item[];
  renderItems: Item[];
  translateX: number;
  direction: Direction;
};

type CarouselRange = {
  first: number;
  last: number;
};

//TODO: EMPTY_ITEM can be changed to copiedItem except the real image URL
const EMPTY_ITEM: Item = {
  blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
  launch_date: "",
  location: [],
  name: "emptyCard",
  online: false,
  popularity: 0,
};

const reloadCardInfo = (carouselWidth: number, maxCarouselCardNum: number): CardInfo => {
  //TODO: This depends on this.state.carouselWidth에 depend on. 
  //      cardInfo should be reset if the width is changed.
  //      Think about good structure when resizing the window
  const cardGap: number = 10;
  const hvRatio: number = 9 / 16;
  const cardWidth: number = (carouselWidth - (cardGap * (maxCarouselCardNum - 1))) / maxCarouselCardNum;
  const cardHeight: number = cardWidth * hvRatio;

  return {
    width: cardWidth,
    imageHeight: cardHeight,
    gap: cardGap,
  };
};

const isPrevCardEmpty = (rangeFirst: number) => {
  if (rangeFirst === 0)
    return true;
  return false;
}

const isNextCardEmpty = (rangeLast: number, itemsLength: number) => {
  if (rangeLast >= itemsLength - 1)
    return true;
  return false;
}

function Carousel({ title, propsItems, maxCarouselCardNum }: CarouselProps) {
  const handlePrevClick = () => {
    console.log("[Carousel.prev]");
    console.log(state.direction);

    if (state.direction === "next") return;

    const items: Item[] = [...state.items];
    const carouselRange: CarouselRange = { ...state.carouselRange };
    const translateXUnit: number = state.cardInfo.width + state.cardInfo.gap;
    let renderItems: Item[] = [];
    let newDirection: Direction = "prev";
    let newTranslateX: number = state.translateX + translateXUnit;

    if (isPrevCardEmpty(carouselRange.first)) {
      console.log("isPrevCardEmpty:", true);

      //TODO: Find a better way for the performance of manipulating an array
      //Re-organize items / renderItems
      const lastItem: Item | undefined = items.pop();
      if (lastItem) {
        items.unshift(lastItem);
      } else {
        //TODO: Error handling - It means there is no items.
        return;
      }

      //TODO: "emptyCard" should be compared to id
      const emptyItems = state.renderItems.filter(item => item.name === "emptyCard");
      renderItems = [...items, ...emptyItems];
      renderItems.push(EMPTY_ITEM);

      if (!cardTrackRef.current) {
        //TODO: Error handling - It means something is changed
        return;
      }

      //NOTE: With new direction, transition would be none in a while for repositioning.
      const currentTranslateX = getElementTranslateX(cardTrackRef.current);
      newTranslateX = currentTranslateX - translateXUnit;
      newDirection = "none";

      setTimeout(() => {
        const state = stateRef.current;
        console.log("Restart animation!!! state:", state);
        setState({
          ...state,
          translateX: 0,
          direction: "prev"
        });
      }, 50);

    } else {
      console.log("isPrevCardEmpty:", false);
      renderItems = [...items];

      carouselRange.first--;
      carouselRange.last--;
    }
    console.log("[CarouselContainer.prev] items:", items);
    console.log("[CarouselContainer.prev] carouselRange:", carouselRange);
    console.log("[CarouselContainer.prev] renderItems:", renderItems);

    setState({
      ...state,
      items: items,
      renderItems: renderItems,
      carouselRange: carouselRange,
      translateX: newTranslateX,
      direction: newDirection,
    });

  };

  const handleNextClick = () => {
    console.log("[Carousel.next]");
    console.log(state.direction);

    if (state.direction === "prev") return;

    const items: Item[] = [...state.items];
    const carouselRange: CarouselRange = { ...state.carouselRange };
    const translateXUnit: number = state.cardInfo.width + state.cardInfo.gap;
    const translateX: number = state.translateX - translateXUnit;
    let renderItems: Item[] = [];

    if (isNextCardEmpty(carouselRange.last, items.length)) {
      console.log("isNextCardEmpty:", true);

      //TODO: Find a better way for the performance of manipulating an array
      //Re-organize items / renderItems
      const firstItem: Item | undefined = items.shift();
      if (firstItem) {
        items.push(firstItem);
      } else {
        //TODO: Error handling - It means there is no items.
      }

      //TODO: "emptyCard" should be compared to id
      const emptyItems: Item[] = state.renderItems.filter(item => item.name === "emptyCard");
      renderItems = [...emptyItems, ...items];
      renderItems.unshift(EMPTY_ITEM);

    } else {
      console.log("isNextCardEmpty:", false);
      renderItems = [...items];

      carouselRange.first++;
      carouselRange.last++;
    }
    console.log("[Carousel.next] items:", items);
    console.log("[Carousel.next] carouselRange:", carouselRange);
    console.log("[Carousel.next] renderItems:", renderItems);
    console.log("[Carousel.next] state:", state);

    setState({
      ...state,
      carouselRange: carouselRange,
      items: items,
      renderItems: renderItems,
      translateX: translateX,
      direction: "next",
    });
  };

  const transitionEnd = () => {
    const state = stateRef.current;
    // console.log("[Carousel.transitionEnd] items:", state.items);
    // console.log("[Carousel.transitionEnd] carouselRange:", state.carouselRange);
    // console.log("[Carousel.transitionEnd] renderItems:", state.renderItems);
    console.log("[Carousel.transitionEnd] state:", state);

    let emptyCardsCount: number = 0;
    const newRenderItems: Item[] = state.renderItems.filter(item => {
      //TODO: "emptyCard" should be compared to id
      if (item.name === "emptyCard") {
        emptyCardsCount++;
        return false;
      }
      return true;
    });
    const newState: CarouselState = {
      ...state,
      renderItems: newRenderItems,
      direction: "none",
    };

    if (state.direction === "next") {
      const translateXUnit = state.cardInfo.width + state.cardInfo.gap;
      const newTranslateX = state.translateX + translateXUnit * emptyCardsCount;
      newState.translateX = newTranslateX;
    }
    // console.log("[Carousel.transitionEnd] newRenderItems:", newState.renderItems);
    // console.log("[Carousel.transitionEnd] translateX:", newState.translateX);
    console.log("[Carousel.transitionEnd] newState:", newState);

    setState(newState);
  };

  const trackContainerRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const cardTrackRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [state, _setState] = useState<CarouselState>({
    carouselWidth: 0,
    cardInfo: { //TODO: it depends on carouselWidth, so it could be removed from state
      width: 0,
      imageHeight: 0,
      gap: 0,
    },
    carouselRange: {  // For checking if the prev/next item exists
      first: 0,
      last: maxCarouselCardNum - 1,
    },
    items: [...propsItems],
    renderItems: [...propsItems],
    translateX: 0,
    direction: 'none',
  });

  //NOTE: stateRef is needed for using state in eventlisenter - Use it in transitionEnd
  const stateRef: React.MutableRefObject<CarouselState> = React.useRef(state);
  const setState = (newState: CarouselState) => {
    stateRef.current = newState;
    _setState(newState);
  };

  //TODO: Use padding 30px of discoverWrapper in css for automation
  // console.log("window.innerWidth:", window.innerWidth);

  console.log("\n[Carousel] state:", state);
  useEffect(() => {
    console.log("[Carousel.useEffect]");

    //TODO: Render 3 times when first loading 
    //  1. for getting carouselWidth - trackContainerRef.current!.clientWidth
    //  2. for rendering loading screen
    //  3. for rendering with actual data
    if (!trackContainerRef.current) return;

    const carouselWidth: number = trackContainerRef.current!.clientWidth;
    const cardInfo: CardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);

    console.log("[Carousel.useEffect] carouselWidth:", carouselWidth);

    setState({
      ...state,
      carouselWidth,
      cardInfo,
    });

    console.log("[Carousel.useEffect] cardTrackRef.current:", cardTrackRef.current);
    cardTrackRef.current?.addEventListener("transitionend", transitionEnd);
    return () => {
      console.log("removeEventListener");
      cardTrackRef.current?.removeEventListener("transitionend", transitionEnd);
    };
  }, []);

  console.log("-- [Carousel.render]!!!!");
  return (
    <div className="carouselContainer">
      <CarouselHeader title={title} prev={handlePrevClick} next={handleNextClick} />
      <CarouselTrack
        trackContainerRef={trackContainerRef}
        cardTrackRef={cardTrackRef}
        cardInfo={state.cardInfo}
        direction={state.direction}
        translateX={state.translateX}
        renderItems={state.renderItems}
      />
    </div>
  );
}

export default Carousel;