import React from 'react';

export type Item = {
  blurhash: string;
  online: boolean;
  name: string | "emptyCard";
};

export type CardInfo = {
  width: number;
  imageHeight: number;
  gap: number;
};

type CarouselCardProps = {
  cardInfo: CardInfo;
  item: Item;
};

function CarouselCard({ cardInfo, item }: CarouselCardProps) {

  //TODO: Need placeholder before loading data
  if (!item) return <div>Loading Placeholder</div>;

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
          {/* <Blurhash
            hash={item.blurhash}
            width={'100%'}
            height={'100%'}
          /> */}
        </div>
        <div className="online">
          <div>{item.online ? "online" : "offline"}</div>
        </div>
      </div >
      <div className="bottom">
        <div>{item.name}</div>
      </div>
    </div >
  );
}

export default CarouselCard;
