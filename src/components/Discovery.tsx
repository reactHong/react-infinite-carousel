import React from 'react';
import Carousel from './Carousel';
import { Item } from './CarouselCard';

const title: string = "New Restaurants";
const items1: Item[] = [
  {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "0",
    online: true,
  }, {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "1",
    online: true,
  }, {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "2",
    online: true,
  }, {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "3",
    online: true,
  }, {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "4",
    online: true,
  }, {
    blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
    name: "5",
    online: true,
  },
];

function Discovery() {
  return (
    <Carousel title={title} items={items1} />
  );
}

export default Discovery;
