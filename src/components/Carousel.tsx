import React, { useEffect, useRef, useState } from 'react';
import CarouselHeader from './CarouselHeader';
import CarouselTrack from './CarouselTrack';
import { Item, CardInfo } from './CarouselCard';

type CarouselProps = {
  title: string;
  items: Item[];
  maxCarouselCardNum: number;
};

type CarouselState = {
  carouselWidth: number;
  cardInfo: CardInfo | null;
  // renderItems: Item[],
  // translateX: 0,
  // direction: null,
};

type CarouselRange = {
  first: number;
  last: number;
};

const testCardInfo: CardInfo = {
  width: 100,
  imageHeight: 100,
  gap: 10,
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

function Carousel({ title, items, maxCarouselCardNum }: CarouselProps) {
  const handlePrevClick = () => {
    console.log("prev");
  };

  const handleNextClick = () => {
    console.log("next");
  };

  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CarouselState>({
    carouselWidth: 0,
    cardInfo: null,
    // renderItems: [...props.items],
    // translateX: 0,
    // direction: null,
  });

  const realItems: Item[] = [...items];
  const range: CarouselRange = {  // For checking if the prev/next item exists
    first: 0,
    last: maxCarouselCardNum - 1,
  };
  //TODO: Use padding 30px of discoverWrapper in css for automation
  // console.log("window.innerWidth:", window.innerWidth);

  console.log(state.carouselWidth);
  useEffect(() => {
    console.log("[Carousel.useEffect]");

    //TODO: Render 3 times when first loading 
    //  1. for getting carouselWidth - trackContainerRef.current!.clientWidth
    //  2. for rendering loading screen
    //  3. for rendering with actual data
    if (!trackContainerRef.current) return;

    const carouselWidth = trackContainerRef.current!.clientWidth;
    const cardInfo: CardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);

    console.log("[Carousel.useEffect] carouselWidth:", carouselWidth);

    setState({
      ...state,
      carouselWidth,
      cardInfo,
    });
  }, []);

  console.log("-- [Carousel.render]!!!!");
  return (
    <div className="carouselContainer">
      <CarouselHeader title={title} prev={handlePrevClick} next={handleNextClick} />
      <CarouselTrack
        trackContainerRef={trackContainerRef}
        cardInfo={state.cardInfo}
        items={items} />
    </div>
  );
}

export default Carousel;
