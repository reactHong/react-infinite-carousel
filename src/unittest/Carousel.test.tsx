import React from 'react';
import { render, screen, fireEvent, cleanup, RenderResult } from '@testing-library/react';
import { Section } from '../components/Discovery';
import Carousel from '../components/Carousel';
import { EMPTY_ITEM } from '../CarouselUtil';
import { testDiscoveryData } from './testData';

//**************************************************************
//TODO: Modify this test with CarouselRange
//TODO: Figure out how to test DOM after the transition
//TODO: Add a test when continuousClick = false 
//      after figuring out how to test DOM after the transition
//**************************************************************

//NOTE: Testing cases are should be changed if MAX_NUM value is not 5
const MAX_NUM: number = 5;
const continuousClick: boolean = true;
const section: Section = testDiscoveryData.sections[0];

function getItemNames(): (string | null)[] {
  const divs: HTMLElement[] = screen.getAllByTestId('item-name');
  const itemNames: (string | null)[] = divs.map((div: HTMLElement): string | null => div.textContent).filter((name: string | null) => name !== EMPTY_ITEM.name);
  return [...itemNames];
}

describe('<Carousel />', () => {

  describe('[Test initialization]', () => {
    it('matches snapshot', () => {
      cleanup();

      const carousel: RenderResult = render(<Carousel
        key={0}
        title={section.title}
        propsItems={section.restaurants}
        maxCarouselCardNum={MAX_NUM}
        enableContinuousClick={continuousClick}
      />);
      expect(carousel.container).toMatchSnapshot();
    });

    it('has two buttons', () => {
      screen.getByTestId('prevButton');
      screen.getByTestId('nextButton');
    });

    it('initially has cards in order of 0,1,2,3,4,5', () => {
      const expected: string[] = ["0", "1", "2", "3", "4", "5"];
      const itemNames: (string | null)[] = getItemNames();
      expect(itemNames).toEqual(expected);
    });
  });

  describe('[Test moving next]', () => {
    it('moves next 7 times - from [0,1,2,3,4,5] to [0,1,2,3,4,5]', () => {
      cleanup();

      render(<Carousel
        key={0}
        title={section.title}
        propsItems={section.restaurants}
        maxCarouselCardNum={MAX_NUM}
        enableContinuousClick={true}
      />);

      const nextButton = screen.getByTestId('nextButton');

      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["1", "2", "3", "4", "5", "0"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["2", "3", "4", "5", "0", "1"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["3", "4", "5", "0", "1", "2"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["4", "5", "0", "1", "2", "3"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["5", "0", "1", "2", "3", "4"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
    });
  });

  describe('[Test moving prev]', () => {
    it('moves prev 6 times - from [0,1,2,3,4,5] to [0,1,2,3,4,5]', () => {
      cleanup();

      render(<Carousel
        key={0}
        title={section.title}
        propsItems={section.restaurants}
        maxCarouselCardNum={MAX_NUM}
        enableContinuousClick={true}
      />);

      const prevButton = screen.getByTestId('prevButton');

      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["5", "0", "1", "2", "3", "4"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["4", "5", "0", "1", "2", "3"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["3", "4", "5", "0", "1", "2"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["2", "3", "4", "5", "0", "1"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["1", "2", "3", "4", "5", "0"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
    });
  });

  //TODO: Figure out how to test DOM after the transition
  //      Carousel.transitionEnd function is not invoked.
  /*
  describe('[Test moving prev after next] - from [0,1,2,3,4,5] to [0,1,2,3,4,5]', () => {
    it('moves next 3 times, then prev 3 times', () => {
      cleanup();

      render(<Carousel
        key={0}
        title={section.title}
        propsItems={section.restaurants}
        maxCarouselCardNum={MAX_NUM}
        enableContinuousClick={continuousClick}
      />);

      const nextButton = screen.getByTestId('nextButton');

      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["1", "2", "3", "4", "5", "0"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["2", "3", "4", "5", "0", "1"]);

      const prevButton = screen.getByTestId('prevButton');

      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["2", "3", "4", "5", "0", "1"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["1", "2", "3", "4", "5", "0"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
    });
  });

  describe('[Test moving next after prev] - from [0,1,2,3,4,5] to [0,1,2,3,4,5]', () => {
    it('moves prev 3 times, then next 3 times', () => {
      cleanup();

      render(<Carousel
        key={0}
        title={section.title}
        propsItems={section.restaurants}
        maxCarouselCardNum={MAX_NUM}
        enableContinuousClick={true}
      />);

      const prevButton = screen.getByTestId('prevButton');

      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["5", "0", "1", "2", "3", "4"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["4", "5", "0", "1", "2", "3"]);
      fireEvent.click(prevButton);
      expect(getItemNames()).toEqual(["3", "4", "5", "0", "1", "2"]);

      const nextButton = screen.getByTestId('nextButton');

      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["4", "5", "0", "1", "2", "3"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["5", "0", "1", "2", "3", "4"]);
      fireEvent.click(nextButton);
      expect(getItemNames()).toEqual(["0", "1", "2", "3", "4", "5"]);
    });
  });
  */
});