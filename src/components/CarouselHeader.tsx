import React from 'react';

type CarouselHeaderProps = {
  title: string;
  prev: () => void;
  next: () => void;
}

function CarouselHeader({ title, prev, next }: CarouselHeaderProps) {
  return (
    <div className="headerContainer">
      <h2 className="header">{title}</h2>
      <div className="buttonsContainer">
        <button type="button" data-testid="prevButton" onClick={prev}>
          <svg className="ic_m_caret_left_svg__rtlIcon" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M15.477 3.977a.503.503 0 01.365.841l-6.68 7.159 6.679 7.159a.502.502 0 01.159.366.5.5 0 01-.888.315l-7-7.5a.498.498 0 010-.682l7-7.5a.496.496 0 01.365-.16"></path></svg>
        </button>
        <button type="button" data-testid="nextButton" onClick={next}>
          <svg className="ic_m_caret_right_svg__rtlIcon" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M8.5 20a.5.5 0 01-.365-.841L14.815 12 8.136 4.841a.5.5 0 11.729-.681l7 7.5c.18.192.18.49 0 .682l-7 7.5a.494.494 0 01-.365.16"></path></svg>
        </button>
      </div>
    </div>
  );
}

function areEqual(prevProps: CarouselHeaderProps, nextProps: CarouselHeaderProps) {
  return prevProps.title === nextProps.title;
}

// export default CarouselHeader;
export default React.memo(CarouselHeader, areEqual);
