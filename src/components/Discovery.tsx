import React from 'react';
import Carousel from './Carousel';
import { Item } from './CarouselCard';
import { data } from '../testData';

type Section = {
  title: string;
  restaurants: Item[];
};

function Discovery() {

  const MAX_NUM = 5;
  const sections: Section[] = data.sections;
  const continuousClick = [true, false, false];

  return (
    <div className="discoveryWrapper">
      {
        sections.map((section: Section, index: number) => {
          const maxCarouselCardNum = section.restaurants.length > MAX_NUM
            ? MAX_NUM : section.restaurants.length - 1;
          return <Carousel
            key={index}
            title={section.title}
            propsItems={section.restaurants}
            maxCarouselCardNum={maxCarouselCardNum}
            enableContinuousClick={continuousClick[index]}
          />
        })
      }

    </div>
  );
}

export default Discovery;
