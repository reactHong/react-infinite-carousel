import React from 'react';
import { Blurhash } from 'react-blurhash';
import { CardInfo, Item } from '../utils/CarouselUtil';

type CarouselCardProps = {
  cardInfo: CardInfo;
  item: Item;
};

function CarouselCard({ cardInfo, item }: CarouselCardProps) {
  const cardWidth = cardInfo.width;
  const cardStyle: React.CSSProperties = {
    width: cardWidth,
    minWidth: cardWidth,
    marginRight: cardInfo.gap,
  };
  const topStyle: React.CSSProperties = {
    height: cardInfo.imageHeight,
  };

  return (
    <div className="card" style={cardStyle}>
      <div className="top" style={topStyle}>
        <div className="imageContainer">
          {item.blurhash &&
            (<Blurhash
              hash={item.blurhash}
              width={'100%'}
              height={'100%'}
            />)
          }
        </div>
        <div className="online">
          <div>{item.online ? "online" : "offline"}</div>
        </div>
      </div >
      <div className="bottom">
        <div data-testid="item-name">{item.name}</div>
      </div>
    </div >
  );
}

function areEqual(prevProps: CarouselCardProps, nextProps: CarouselCardProps) {
  return (prevProps.item.id === nextProps.item.id
    && prevProps.cardInfo.width === nextProps.cardInfo.width);
}

export default React.memo(CarouselCard, areEqual);

