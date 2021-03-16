# Infinite Carousel

## Overview
This is the frontend assignment for [Wolt Summer 2021 Internships](https://github.com/woltapp/summer2021-internship). The project was bootstrapped by [Create React App](https://github.com/facebook/create-react-app) project with [TypeScript](https://create-react-app.dev/docs/adding-typescript/).

## Goal
Render a simple discovery page with the Infinite Carousel.

## Page Preview
<img src='http://drive.google.com/uc?export=view&id=1yiGH9hdYuhLjVfkoncai3TUNs1iWkf4Q' />

## Install / Start / Test
To start the project right away:

- Install all project dependencies with `npm install` or `yarn install`.
- Start the development server with `npm start` or `yarn start`.
- Test the carousel with `npm test` or `yarn test`.

## Additional Dependencies

#### [React Testing LIbrary](https://testing-library.com/docs/react-testing-library/intro)
*React Testing Library* is installed with [Create React App](https://github.com/facebook/create-react-app).

#### [react-blurhash](https://github.com/woltapp/react-blurhash)
To represent images with a few chars instead of real images.
```
npm install --save blurhash react-blurhash
```

#### [canvas](https://www.npmjs.com/package/canvas)
To fix errors when unit testing with `react-blurhash`.
```
npm install --save-dev canvas
```

###### Fixed error messages:
```
Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
...
Error: Uncaught [TypeError: Cannot read property 'createImageData' of null]
...
The above error occurred in the <canvas> component:
      at canvas
      at BlurhashCanvas (.../node_modules/react-blurhash/src/BlurhashCanvas.tsx:11:1)
      at div
      at Blurhash (.../node_modules/react-blurhash/lib/Blurhash.js:74:42)
      at div
      at div
      at div
      at CarouselCard (.../src/components/CarouselCard.tsx:24:25)
      at div
      at div
      at CarouselTrack (.../src/components/CarouselTrack.tsx:16:3)
      at div
      at Carousel (.../src/components/Carousel.tsx:68:3)
```


## Rules
- Each section (title + restaurants-list fields) must be shown as a horizontal carousel (with the title visible). The user needs to be able to scroll the carousel to both directions.
- Each carousel can have max. 5 elements visible on screen (at the same time).
- Each restaurant object is rendered with a title, blurhash and online fields.
- Carousels scroll infinitely, so when the user reaches the last element, it starts from the beginning (or vice versa).
- Otherwise, free decisions of everything can be accepted from the layout to image sizes.

## Data of Discovery Page

#### Discovery
The data that will be fetched has the following structure.

```TypeScript
{
   "sections": [
      {
           "title": "Popular Restaurants",
           "restaurants": [...10 restaurant objects...]
      },
      {
           "title": "New Restaurants",
           "restaurants": [...10 restaurant objects...]
      },
 	{
           "title": "Nearby Restaurants",
           "restaurants": [...10 restaurant objects...]
      }

   ]
}
```
* `NOTE`: In the above structure, the second section says there would be 10 restaurant objects, but [discovery_page.json](https://github.com/woltapp/summer2021-internship/blob/main/discovery_page.json) has 3 restaurant objects, so the second carousel set the maximum number of elements to 2.

#### Restaurant Object
```TypeScript
{
   "blurhash":"UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG",
   "location":[
      24.933257,
      60.171263
   ],
   "name":"Charming Cherry House",
   "online": true,
   "launch_date":"2020-09-20",
   "popularity":0.665082352909038
}
```
##### [Fields:](https://github.com/woltapp/summer2021-internship#restaurant-object)
- blurhash: image representation (type: string)
- location: Restaurant's location as latitude and longitude coordinates. First element in the list is the longitude (type: a list containing two decimal elements)
- name: The name of the restaurant (type: string)
- launch_date: the date when the restaurant was added to Wolt app (type: string, ISO 8601 date)
- online: if true, the restaurant is accepting orders. If false, the restaurant is closed (type: boolean)
- popularity: the higher the number, the more popular the restaurant is in Wolt app (type: a float between 0-1, where 1 is the - most popular restaurant)


## Description of Carousel Component

#### Props
| name                              | description |  
|:---                               | :--- |
| `title` (*string*)                  | The carousel title string. |
| `propsItems` (*Item[]*)             | The array of carousel items. |
| `maxCarouselCardNum` (*int*)        | The maximum number of the carousel items visible on screen. |
| `enableContinuousClick` (*boolean*) | If `true`, continuous clicking is enabled. If `false`, continuous clicking is blocked. |

* `NOTE`: `propsItems` is an array of `Item`. [Restaurant Object](#Restaurant-Object) matches the type, `Item`, defined as following. (Only `id` is added to prevent the same item from re-rendering.)

```TypeScript
type Item = {
  id: string;
  blurhash: string;
  launch_date: string;
  location: number[];
  name: string;
  online: boolean;
  popularity: number;
};
```
#### Example
```TypeScript
let restaurantObjects: Item[] = [{
  "title": "New Restaurants",
  "restaurants": [
    {
      "id": "nsk2ik0itnckkl530sj",
      "blurhash": "UEL:h[|8I-OkYxTsn9r_ExOlo{s:M1eCxvkV",
      "launch_date": "2020-12-08",
      "location": [
        24.938667,
        60.155196
      ],
      "name": "Corn Place",
      "online": false,
      "popularity": 0.5436221040194886
    },
    {
      "id": "z29odhi9rerkkl530sj",
      "blurhash": "UDSoswyZVqm.p%cRjLaKUgZ+k.kWrFZ%a$kX",
      "launch_date": "2020-11-26",
      "location": [
        24.938908,
        60.160413
      ],
      "name": "Salt",
      "online": true,
      "popularity": 0.8954324472876662
    },
    {
      "id": "zqziym1744kkl530sj",
      "blurhash": "U9O[r*?hI_VN*8yNniVx5^NhxTknY]MmX+tx",
      "launch_date": "2020-11-23",
      "location": [
        24.935659,
        60.161989
      ],
      "name": "Chili powder",
      "online": true,
      "popularity": 0.7353250033621942
    }
  ]
}];
```
```TypeScript
<Carousel
  title={"New Restaurants"}
  propsItems={restaurantObjects}
  maxCarouselCardNum={2}
  enableContinuousClick={true}
/>
```

## Futher TO DO LIST
* Improve the performance with useCallback and useMemo with profiling
* Implement loading screen.
* Implement the page with real images.
* Implement each of carousels with different type of cards.
* Resize the size of window with debouncing.
* Error handling with throw.
* Improve unit testing `<Carousel>` component.
  * Figure out how to test after animating transition with `testing-libary`.
* Package `<Carousel>` component for distribution via `npm`.
