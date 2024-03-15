/*
    map.ts
    Defines game locations and the logic required to move around.
*/

import torni from '@/assets/torni.jpg';
import kaivo from '@/assets/kaivo.jpg';
import aukio from '@/assets/aukio.jpg';
import dragon from '@/assets/dragon.jpg';
import polku from '@/assets/polku.jpg';
import portti from '@/assets/portti.jpg';
import joki from '@/assets/joki.jpg';
import penkki from '@/assets/penkki.jpg';
import mokki from '@/assets/mokki.jpg';
import kilta from '@/assets/kilta.jpg'
import mordor from '@/assets/mordor.jpg';
import gameMessage from '@/game/gameMessage';

// Refactoring the original arrays as location objects
export type MapLocation = {
  name: string;
  blockMessage: string;
  image: string;
  directions: Directions;
  isLocked?: boolean;
};

// Refactoring the original travel logic to accomodate any number of locations without relying on a 3x3 grid
export type Directions = {
  north?: number;
  east?: number;
  south?: number;
  west?: number;
};

// Defining locations
export const map: MapLocation[] = [
  {
    name: 'Vanha linnantorni',
    blockMessage: 'Haluamasi reitti on liian vaarallinen!',
    image: torni,
    directions: {east: 1, south: 3},
  },
  {
    name: 'Syvä kaivo',
    blockMessage: 'Salaperäinen voima estää liikkumiesen tuohon suuntaan.',
    image: kaivo,
    directions: {east: 2, south: 4, west: 0},
  },
  {
    name: 'Aurinkoinen metsäaukio',
    blockMessage: 'Vaikekulkuinen pusikko estää etenemisen.',
    image: aukio,
    directions: {south: 5, west: 1},
  },
  {
    name: 'Nukkuva lohikäärme',
    blockMessage: 'Et pääse siitä suunnasta ohittamaan lohikäärmettä.',
    image: dragon,
    directions: {north: 0, east: 4, south: 6},
  },
  {
    name: 'Kapea metsäpolku',
    blockMessage: '',
    image: polku,
    directions: {north: 1, east: 5, south: 7, west: 3},
  },
  {
    name: 'Vanha portti',
    blockMessage: 'Portti sulkeutui.',
    image: portti,
    directions: {north: 2, east: 9, south: 8, west: 4},
  },
  {
    name: 'Joen ranta',
    blockMessage: 'Joki on liian syvä ylitettäväksi sieltä.',
    image: joki,
    directions: {north: 3, east: 7},
  },
  {
    name: 'Tyhjä puupenkki',
    blockMessage: 'Metsä on liian tiheä läpäistäväksi.',
    image: penkki,
    directions: {north: 4, east: 8, west: 6},
  },
  {
    name: 'Vanha mökki, sisältä kuuluu musiikkia',
    blockMessage: 'Olet liian peloissasi mennäksesi tuohon suuntaan.',
    image: mokki,
    directions: {north: 5, west: 7},
  },
  {
    name: 'Lohikäärmeensurmaajien kilta',
    blockMessage: 'Olet vihdoinkin vertaistesi joukossa, eikä tee mieli lähteä vielä.',
    image: kilta,
    directions: {west: 5, east: 10},
    isLocked: true,
  },
  {
    name: 'Mordor',
    blockMessage: 'Ei Mordorista noin vain kävellä pois.',
    image: mordor,
    directions: {west: 9},
    isLocked: true,
  },
];

// Returns the intended destination number based on direction.
// Invalid direction returns -1 and results in blockMessage in 'move'.
export const getDestination = (
  direction: string,
  currentLocation: MapLocation
): number => {
  switch (direction) {
    case 'pohjoinen':
      return currentLocation.directions?.north ?? -1;

    case 'itä':
      return currentLocation.directions?.east ?? -1;

    case 'etelä':
      return currentLocation.directions?.south ?? -1;

    case 'länsi':
      return currentLocation.directions?.west ?? -1;
  }
  return -1;
};

// Changes the location if the destination is included in the current location's 'directions' array, and the destination is not locked.
// Otherwise displays the current location's block message.
export const move = (
  destination: number,
  currentLocation: MapLocation,
  locations: MapLocation[],
  setLocation: React.Dispatch<React.SetStateAction<MapLocation>>
): void => {
  if (
    Object.values(currentLocation.directions).includes(destination) &&
    !locations[destination].isLocked
  ) {
    setLocation(locations[destination]);
  } else {
    gameMessage(currentLocation.blockMessage);
  }
};
