import React, { useEffect, useRef, useState } from 'react';
import CarouselHeader from './CarouselHeader';
import CarouselTrack, { Direction } from './CarouselTrack';
import { Item, CardInfo } from './CarouselCard';

type CarouselProps = {
  title: string;
  propsItems: Item[];
  maxCarouselCardNum: number;
  enableContinuousClick: boolean;
};

type CarouselState = {
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
export const EMPTY_ITEM: Item = {
  blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
  launch_date: "",
  location: [],
  name: "emptyCard",
  online: false,
  popularity: 0,
};

//TODO: Consider cross browsing
const getElementTranslateX = (element: HTMLDivElement): number => {
  const style: CSSStyleDeclaration = window.getComputedStyle(element);
  const values = style.transform.split(/\w+\(|\);?/);
  const transform = values[1].split(/,\s?/g).map(numStr => parseInt(numStr));
  return transform[0];
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

const carouselChecker = (items: Item[], range: CarouselRange) => {
  const cItems = [...items];
  const cRange = { ...range };

  const isPrevItemEmpty = () => ((cRange.first === 0) ? true : false);
  const isNextItemEmpty = () => ((cRange.last >= cItems.length - 1) ? true : false);

  const prev = (): boolean => {
    let shouldReorder: boolean = false;
    if (isPrevItemEmpty()) {
      cItems.unshift(cItems.pop()!);
      shouldReorder = true;
    } else {
      cRange.first--;
      cRange.last--;
    }
    return shouldReorder;
  };

  const next = (): boolean => {
    let shouldReorder: boolean = false;
    if (isNextItemEmpty()) {
      cItems.push(cItems.shift()!)
      shouldReorder = true;
    } else {
      cRange.first++;
      cRange.last++;
    }
    return shouldReorder;
  };

  return {
    items: cItems,
    range: cRange,
    prev: prev,
    next: next,
  }
};

function Carousel({
  title,
  propsItems,
  maxCarouselCardNum,
  enableContinuousClick,
}: CarouselProps) {

  //TODO: It should be guaranted that propsItems is always not empty
  // if (propsItems.length <= 0) {
  //   //TODO: Error Handling
  //   return <div></div>;
  // }

  const [cardInfo, _setCardInfo] = useState<CardInfo>({
    width: 0,
    imageHeight: 0,
    gap: 0,
  });
  const [state, _setState] = useState<CarouselState>({
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
  const cardInfoRef = React.useRef<CardInfo>(cardInfo);
  const stateRef = React.useRef<CarouselState>(state);
  const setCardInfo = (newCardInfo: CardInfo) => {
    cardInfoRef.current = newCardInfo;
    _setCardInfo(newCardInfo);
  };
  const setState = (newState: CarouselState) => {
    stateRef.current = newState;
    _setState(newState);
  };

  const trackContainerRef = useRef<HTMLDivElement>(null);
  const cardTrackRef = useRef<HTMLDivElement>(null);

  const handlePrevClick = () => {
    if (enableContinuousClick && state.direction === "next") return;
    if (!enableContinuousClick && state.direction !== "none") return;

    const checker = carouselChecker(state.items, state.carouselRange);
    const shouldReorder = checker.prev();
    const renderItems: Item[] = [...checker.items];

    const translateXUnit: number = cardInfo.width + cardInfo.gap;
    console.log("prev: translateXUnit:", translateXUnit);
    let newDirection: Direction = "prev";
    let newTranslateX: number = state.translateX + translateXUnit;

    if (shouldReorder) {
      if (!cardTrackRef.current) {
        //TODO: Error handling - It means something UI could be changed
        return;
      }

      //TODO: "emptyCard" should be compared to id
      const emptyItems = state.renderItems.filter(item => item.name === EMPTY_ITEM.name);
      emptyItems.push(EMPTY_ITEM);
      renderItems.push(...emptyItems);

      //NOTE: With new direction, transition would be none in a while for repositioning.
      const currentTranslateX = getElementTranslateX(cardTrackRef.current);
      newTranslateX = currentTranslateX - translateXUnit;
      newDirection = "none";

      setTimeout(() => {
        const state = stateRef.current;
        setState({
          ...state,
          translateX: 0,
          direction: "prev",
        });
      }, 20);
    }

    setState({
      ...state,
      carouselRange: { ...checker.range },
      items: [...checker.items],
      renderItems: renderItems,
      translateX: newTranslateX,
      direction: newDirection,
    });
  };

  const handleNextClick = () => {
    if (enableContinuousClick && state.direction === "prev") return;
    if (!enableContinuousClick && state.direction !== "none") return;

    const checker = carouselChecker(state.items, state.carouselRange);
    const shouldReorder = checker.next();
    const translateXUnit: number = cardInfo.width + cardInfo.gap;
    console.log("next: translateXUnit:", translateXUnit);
    const translateX: number = state.translateX - translateXUnit;
    const renderItems: Item[] = [...checker.items];

    if (shouldReorder) {
      //TODO: "emptyCard" should be compared to id
      const emptyItems: Item[] = state.renderItems.filter(item => item.name === EMPTY_ITEM.name);
      emptyItems.unshift(EMPTY_ITEM);
      renderItems.unshift(...emptyItems);
    }

    setState({
      ...state,
      items: [...checker.items],
      carouselRange: { ...checker.range },
      renderItems: renderItems,
      translateX: translateX,
      direction: "next",
    });
  };

  const transitionEnd = () => {
    const state = stateRef.current;
    const cardInfo = cardInfoRef.current;

    let emptyCardsCount: number = 0;
    const newRenderItems: Item[] = state.renderItems.filter(item => {
      //TODO: "emptyCard" should be compared to id
      if (item.name === EMPTY_ITEM.name) {
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
      const translateXUnit = cardInfo.width + cardInfo.gap;
      const newTranslateX = state.translateX + translateXUnit * emptyCardsCount;
      newState.translateX = newTranslateX;
    }
    setState(newState);
  };

  const handleResize = () => {
    if (!trackContainerRef.current) return;

    const carouselWidth: number = trackContainerRef.current!.clientWidth;
    const cardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);
    setCardInfo(cardInfo);
  };

  // console.log("\n[Carousel] state:", state);
  useEffect(() => {
    // console.log("[Carousel.useEffect]");

    //TODO: Render 3 times when first loading 
    //  1. for getting carouselWidth - trackContainerRef.current!.clientWidth
    //  2. for rendering loading screen
    //  3. for rendering with actual data
    if (!trackContainerRef.current) return;

    const carouselWidth: number = trackContainerRef.current!.clientWidth;
    const cardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);
    setCardInfo(cardInfo);

    // console.log("[Carousel.useEffect] cardTrackRef.current:", cardTrackRef.current);
    window.addEventListener("resize", handleResize);
    cardTrackRef.current?.addEventListener("transitionend", transitionEnd);
    return () => {
      console.log("removeEventListener");
      cardTrackRef.current?.removeEventListener("transitionend", transitionEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log("-- [Carousel.render]!!!!");
  return (
    <div className="carouselContainer">
      <CarouselHeader title={title} prev={handlePrevClick} next={handleNextClick} />
      <CarouselTrack
        trackContainerRef={trackContainerRef}
        cardTrackRef={cardTrackRef}
        cardInfo={cardInfo}
        direction={state.direction}
        translateX={state.translateX}
        renderItems={state.renderItems}
      />
    </div>
  );
}

export default Carousel;