import { useEffect, useRef, useState } from 'react';
import CarouselHeader from './CarouselHeader';
import CarouselTrack from './CarouselTrack';
import { Item, CardInfo, Direction, carouselChecker, reloadCardInfo, getElementTranslateX, EMPTY_ITEM_NAME } from '../utils/CarouselUtil';
import { generateID } from '../utils/util';

type CarouselProps = {
  title: string;
  propsItems: Item[];
  maxCarouselCardNum: number;
  enableContinuousClick: boolean;
};

type CarouselState = {
  renderItems: Item[];
  translateX: number;
  direction: Direction;
};

function Carousel({
  title,
  propsItems,
  maxCarouselCardNum,
  enableContinuousClick,
}: CarouselProps) {

  const [cardInfo, _setCardInfo] = useState<CardInfo>({
    width: 0,
    imageHeight: 0,
    gap: 0,
  });
  const [state, _setState] = useState<CarouselState>({
    renderItems: [...propsItems],
    translateX: 0,
    direction: 'none',
  });
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const cardTrackRef = useRef<HTMLDivElement>(null);
  const checkerRef = useRef(carouselChecker(propsItems, maxCarouselCardNum));
  const cardInfoRef = useRef<CardInfo>(cardInfo);
  const stateRef = useRef<CarouselState>(state);
  const setCardInfo = (newCardInfo: CardInfo) => {
    cardInfoRef.current = newCardInfo;
    _setCardInfo(newCardInfo);
  };
  const setState = (newState: CarouselState) => {
    stateRef.current = newState;
    _setState(newState);
  };

  const handlePrevClick = () => {
    if (enableContinuousClick && state.direction === "next") return;
    if (!enableContinuousClick && state.direction !== "none") return;

    const checker = checkerRef.current;
    const shouldReorder: boolean = checker.prev();
    const renderItems: Item[] = [...checker.getItems()];

    const translateXUnit: number = cardInfo.width + cardInfo.gap;
    let newDirection: Direction = "prev";
    let newTranslateX: number = state.translateX + translateXUnit;

    if (shouldReorder) {
      if (!cardTrackRef.current) {
        //TODO: Error handling - It means something UI could be changed
        return;
      }
      /**
       * NOTE: EMPTY_ITEM is created when there is no previous or next item to move on when moving on previous or next item. With EMPTY_ITEM, the carousel repositions the cards container for the transition animation.
       * TODO: EMPTY_ITEM can be changed to copiedItem except the real image URL
       */
      const EMPTY_ITEM: Item = {
        id: generateID(),
        blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
        launch_date: "",
        location: [],
        name: EMPTY_ITEM_NAME,
        online: false,
        popularity: 0,
      };

      const cardTrack = cardTrackRef.current;
      const emptyItems: Item[] = state.renderItems.filter(item => item.name === EMPTY_ITEM_NAME);

      emptyItems.push(EMPTY_ITEM);
      renderItems.push(...emptyItems);

      console.log("[prev] renderItems:", renderItems);

      //NOTE: With new direction, transition would be none in a while for repositioning.
      const currentTranslateX = getElementTranslateX(cardTrack);
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
      renderItems: renderItems,
      translateX: newTranslateX,
      direction: newDirection,
    });
  };

  const handleNextClick = () => {
    if (enableContinuousClick && state.direction === "prev") return;
    if (!enableContinuousClick && state.direction !== "none") return;

    const checker = checkerRef.current;
    const shouldReorder: boolean = checker.next();
    const translateXUnit: number = cardInfo.width + cardInfo.gap;
    const translateX: number = state.translateX - translateXUnit;
    const renderItems: Item[] = [...checker.getItems()];

    if (shouldReorder) {
      /**
       * NOTE: EMPTY_ITEM is created when there is no previous or next item to move on when moving on previous or next item. With EMPTY_ITEM, the carousel repositions the cards container for the transition animation.
       * TODO: EMPTY_ITEM can be changed to copiedItem except the real image URL
       */
      const EMPTY_ITEM: Item = {
        id: generateID(),
        blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
        launch_date: "",
        location: [],
        name: EMPTY_ITEM_NAME,
        online: false,
        popularity: 0,
      };
      const emptyItems: Item[] = state.renderItems.filter(item => item.name === EMPTY_ITEM_NAME);

      emptyItems.unshift(EMPTY_ITEM);
      renderItems.unshift(...emptyItems);
    }

    setState({
      renderItems: renderItems,
      translateX: translateX,
      direction: "next",
    });
  };

  useEffect(() => {
    const transitionEnd = () => {
      const state = stateRef.current;
      const cardInfo = cardInfoRef.current;

      let emptyCardsCount: number = 0;
      const newRenderItems: Item[] = state.renderItems.filter(item => {
        if (item.name === EMPTY_ITEM_NAME) {
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
      const state = stateRef.current;
      const carouselChecker = checkerRef.current;
      const trackContainer = trackContainerRef.current;
      if (!trackContainer) return;
      if (!carouselChecker) return;

      const carouselWidth: number = trackContainer!.clientWidth;
      const cardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);
      setCardInfo(cardInfo);

      const rangeFirst: number = carouselChecker.getRange().first;
      if (rangeFirst !== 0) {
        const translateXUnit = cardInfo.width + cardInfo.gap;
        const newTranslateX = -(rangeFirst * translateXUnit);

        setState({
          ...state,
          translateX: newTranslateX,
          direction: "none",
        });
      }
    };

    const trackContainer = trackContainerRef.current;
    const cardTrack = cardTrackRef.current;
    if (!trackContainerRef) return;
    if (!cardTrackRef) return;

    const carouselWidth: number = trackContainer!.clientWidth;
    const cardInfo = reloadCardInfo(carouselWidth, maxCarouselCardNum);
    setCardInfo(cardInfo);

    window.addEventListener("resize", handleResize);
    cardTrack!.addEventListener("transitionend", transitionEnd);
    return () => {
      console.log("removeEventListener");
      cardTrack!.removeEventListener("transitionend", transitionEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxCarouselCardNum]);

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