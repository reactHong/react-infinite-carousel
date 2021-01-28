import React from 'react';
import CarouselHeader from './CarouselHeader';
import CarouselTrack from './CarouselTrack';
import { Item } from './CarouselCard';

type CarouselProps = {
  title: string;
  items: Item[];
};

const testCardInfo = {
  width: 100,
  imageHeight: 100,
  gap: 10,
};

function Carousel({ title, items }: CarouselProps) {

  const handlePrevClick = () => {
    console.log("prev");
  };
  const handleNextClick = () => {
    console.log("next");
  };

  console.log("-- [Carousel.render]!!!!");
  return (
    <div className="carouselContainer">
      <CarouselHeader title={title} prev={handlePrevClick} next={handleNextClick} />
      <CarouselTrack cardInfo={testCardInfo} items={items} />
    </div>
  );
}

export default Carousel;
