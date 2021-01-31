import React from 'react';
import Carousel from './Carousel';
import { Item } from '../utils/CarouselUtil';
import { generateID } from '../utils/util';

type DiscoveryProps = {
  data: object | null;
};

type Section = {
  title: string;
  restaurants: Item[];
};

function Discovery({ data }: DiscoveryProps) {
  const MAX_NUM = 5;
  const continuousClick = [true, false, false];
  const sections: Section[] = data ? Object.values(data)[0] : [];

  return (
    <div className="discoveryWrapper">
      {
        sections.map((section: Section, index: number) => {
          section.restaurants.forEach((restaurant) => {
            restaurant.id = generateID();
          });

          const maxCarouselCardNum = section.restaurants.length > MAX_NUM
            ? MAX_NUM
            : section.restaurants.length - 1;

          return <Carousel
            key={index}
            title={section.title}
            propsItems={section.restaurants}
            maxCarouselCardNum={maxCarouselCardNum}
            enableContinuousClick={continuousClick[index]}
          />
        })
      }
    </div >
  );
}

export default Discovery;
