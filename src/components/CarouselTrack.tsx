import React from 'react';
import CarouselCard, { Item, CardInfo } from './CarouselCard';

type CarouselTrackProps = {
  cardInfo: CardInfo;
  items: Item[];
  // translateX: number;
  // direction: 'prev' | 'next' | 'none';
};

function CarouselTrack({ cardInfo, items }: CarouselTrackProps) {
  // const animationDuration: number = 0.3;
  // const cardTrackStyle: React.CSSProperties = {
  //   transform: `translate3d(${translateX}px, 0px, 0px)`,
  //   transition: `transform ${animationDuration}s`,
  // };
  // console.log("   [CarouselTrack.render] direction:", direction);

  // if (direction !== "next" && direction !== "prev") {
  //   cardTrackStyle.transition = "none";
  // }

  return (
    <div className="trackContainer">
      <div className="cardTrack">
        {items.map((item, index) => (
          <CarouselCard
            key={index}  //TODO: Should be changed to id
            item={item}
            cardInfo={cardInfo}
          />))
        }
      </div>
    </div>
  );
}

export default CarouselTrack;



