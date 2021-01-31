import React from 'react';
import CarouselCard from './CarouselCard';
import { Item, CardInfo, Direction, ANIMATION_DURATION } from '../utils/CarouselUtil';

type CarouselTrackProps = {
  trackContainerRef: React.RefObject<HTMLDivElement>;
  cardTrackRef: React.RefObject<HTMLDivElement>;
  cardInfo: CardInfo;
  translateX: number;
  direction: Direction;
  renderItems: Item[];
};

function CarouselTrack({
  trackContainerRef,
  cardTrackRef,
  cardInfo,
  translateX,
  direction,
  renderItems,
}: CarouselTrackProps) {

  const cardTrackStyle: React.CSSProperties = {
    transform: `translate3d(${translateX}px, 0px, 0px)`,
    transition: `transform ${ANIMATION_DURATION}s`,
  };

  if (direction !== "next" && direction !== "prev") {
    cardTrackStyle.transition = "none";
  }

  return (
    <div className="trackContainer" ref={trackContainerRef}>
      <div className="cardTrack" ref={cardTrackRef} style={cardTrackStyle}>
        {
          renderItems.map((item) => (
            <CarouselCard
              key={item.id}
              item={item}
              cardInfo={cardInfo}
            />))
        }
      </div>
    </div>
  );
}

export default CarouselTrack;



