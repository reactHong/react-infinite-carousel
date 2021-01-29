import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Carousel from './Carousel';
import { testDiscoveryData } from '../testData';

const MAX_NUM = 5;
const continuousClick = true;
const section = testDiscoveryData.sections[0];

describe('<Carousel />', () => {
  it('matches snapshot', () => {
    const utils = render(<Carousel
      key={0}
      title={section.title}
      propsItems={section.restaurants}
      maxCarouselCardNum={MAX_NUM}
      enableContinuousClick={continuousClick}
    />);
    expect(utils.container).toMatchSnapshot();
  });



});