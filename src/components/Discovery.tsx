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

  return (
    <div className="discoveryWrapper">
      {
        sections.map((section: Section) => {
          const maxCarouselCardNum = section.restaurants.length > MAX_NUM
            ? MAX_NUM : section.restaurants.length;
          return <Carousel
            title={section.title}
            propsItems={section.restaurants}
            maxCarouselCardNum={maxCarouselCardNum} />
        })
      }

    </div>
  );
}

export default Discovery;
