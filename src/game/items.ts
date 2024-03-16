/*
    items.ts
    Defines the items that exist in the game and the various actions the user can make with them.
*/

import gameMessage from '@/game/gameMessage';
import kuva_miekka from '@/assets/miekka.png';
import kuva_huilu from '@/assets/huilu.png';
import kuva_kivi from '@/assets/kivi.png';
import kuva_sormus from '@/assets/sormus.png';
import kuva_olut from '@/assets/olut.png';
import kuva_rynkky from '@/assets/rynkky.png';
import kuva_tolkki from '@/assets/tölkki.png';

import type {MapLocation} from './map';

// Adds an item to inventory and removes it from itemsInGame.
export const takeItem = (
  itemToTake: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemsInGame: Item[],
  setItemsInGame: React.Dispatch<React.SetStateAction<Item[]>>
): void => {
  const index = itemsInGame.findIndex(item => item.name === itemToTake.name);
  if (index > -1) {
    itemsInGame.splice(index, 1);
    inventory.push(itemToTake);
    setItemsInGame([...itemsInGame]);
    setInventory([...inventory]);
    gameMessage(`Poimit esineen ${itemToTake.name}.`);
  }
};

// Drops an item in the current location.
export const dropItem = (
  itemToDrop: Item,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemsInGame: Item[],
  setItemsInGame: React.Dispatch<React.SetStateAction<Item[]>>,
  currentLocation: MapLocation,
  map: MapLocation[]
): void => {
  const index = inventory.findIndex(item => item.name === itemToDrop.name);
  if (index > -1) {
    inventory.splice(index, 1);
    itemToDrop.location = map.findIndex(
      location => location.name === currentLocation.name
    );
    itemsInGame.push(itemToDrop);
    setInventory([...inventory]);
    setItemsInGame([...itemsInGame]);
    gameMessage(`Pudotit esineen ${itemToDrop.name}.`);
  }
};

// Completely deletes an item from the game.
const deleteItem = (
  itemName: string,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>
): void => {
  const index = inventory.findIndex(item => item.name === itemName);
  if (index > -1) {
    inventory.splice(index, 1);
    setInventory([...inventory]);
  }
};

// Items store their name, their location, and the function to execute when the player attempts to use them.
export type Item = {
  name: string;
  location: number;
  image: string;
  useFunction: (parameters: UseFunctionParameters) => void;
};

// For passing only some (or none) of the parameters used by various items.
export type UseFunctionParameters = {
  inventory?: Item[];
  setInventory?: React.Dispatch<React.SetStateAction<Item[]>>;
  itemsInGame?: Item[];
  setItemsInGame?: React.Dispatch<React.SetStateAction<Item[]>>;
  currentLocation?: MapLocation;
  locations?: MapLocation[];
  setLocations?: React.Dispatch<React.SetStateAction<MapLocation[]>>;
  setGameOver?: React.Dispatch<React.SetStateAction<boolean>>;
};

// Defining items that exist at the start of the game.
export const STARTING_ITEMS: Item[] = [
  // The rock needs to be dropped in the well for the flute to appear.
  {
    name: 'kivi',
    location: 6,
    image: kuva_kivi,
    useFunction: ({
      inventory,
      setInventory,
      itemsInGame,
      setItemsInGame,
      currentLocation,
      locations,
    }) => {
      if (
        currentLocation !== undefined &&
        locations !== undefined &&
        inventory &&
        setInventory
      ) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 1
        ) {
          deleteItem('kivi', inventory, setInventory);
          if (itemsInGame && setItemsInGame) {
            itemsInGame.push(EXTRA_ITEMS[0]);
            setItemsInGame([...itemsInGame]);
          }
          gameMessage('Pudotat kiven kaivoon.');
        } else {
          gameMessage('Pyörittelet kiveä taskussasi...');
        }
      }
    },
  },
  // The player needs to use the rifle inside the guildhouse while there is an empty can on the floor to unlock Mordor.
  {
    name: 'rynnäkkökivääri',
    location: 9,
    image: kuva_rynkky,
    useFunction: ({
      currentLocation,
      locations,
      itemsInGame,
      setItemsInGame,
      inventory,
      setInventory,
      setLocations,
    }) => {
      if (currentLocation !== undefined && locations !== undefined) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 9 &&
          itemsInGame &&
          setItemsInGame &&
          inventory &&
          setInventory &&
          setLocations
        ) {
          const index = itemsInGame.findIndex(
            item => item.name === 'tölkki' && item.location === 9
          );
          if (index > -1) {
            itemsInGame.splice(index, 1);
            setItemsInGame([...itemsInGame]);
            inventory.splice(
              inventory.findIndex(item => item.name === 'rynnäkkökivääri'),
              1
            );
            setInventory([...inventory]);
            locations[10].isLocked = false;
            setLocations([...locations]);
            gameMessage(
              'Osut tyhjään tölkkiin, jonka jätit toiselle puolelle huonetta. Lohikäärmeensurmaajat ovat vaikuttuneita tarkkuudestasi. Parrakas mies laittaa käden isällisesti olallesi ja toteaa sinun olevan valmis viimeiseen koitokseen.'
            );
          } else {
            gameMessage(
              'Esittelet pyssyäsi kaikille, mutta et tee vaikutusta keneenkään.'
            );
          }
        } else {
          gameMessage('Silittelet kivääriäsi ja muistelet armeija-aikoja.');
        }
      }
    },
  },
  // The player needs to drink the beer to receive an empty can.
  {
    name: 'olut',
    location: 9,
    image: kuva_olut,
    useFunction: ({
      inventory,
      setInventory,
      currentLocation,
      locations,
      setLocations,
      itemsInGame,
      setItemsInGame,
    }) => {
      if (
        currentLocation !== undefined &&
        locations !== undefined &&
        inventory &&
        setInventory &&
        setLocations &&
        itemsInGame &&
        setItemsInGame
      ) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 9
        ) {
          deleteItem('olut', inventory, setInventory);
          itemsInGame.push(EXTRA_ITEMS[3]);
          setItemsInGame([...itemsInGame]);
          gameMessage('Juot oluen. Jäljelle jää tyhjä tölkki.');
        } else {
          gameMessage('Et uskalla juopotella julkisella paikalla.');
        }
      }
    },
  },
];

// These items get added to the game as the game progresses.
export const EXTRA_ITEMS: Item[] = [
  // The flute needs to be played at the cabin to receive the sword.
  {
    name: 'huilu',
    location: 1,
    image: kuva_huilu,
    useFunction: ({
      inventory,
      setInventory,
      itemsInGame,
      setItemsInGame,
      currentLocation,
      locations,
    }) => {
      if (
        currentLocation !== undefined &&
        locations !== undefined &&
        inventory &&
        setInventory
      ) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 8
        ) {
          deleteItem('huilu', inventory, setInventory);
          if (itemsInGame && setItemsInGame) {
            itemsInGame.push(EXTRA_ITEMS[1]);
            setItemsInGame([...itemsInGame]);
          }
          gameMessage(
            'Soittosi miellyttää mökin asukkaita. He antavat sinulle legendaarisen lohikäärmeensurmausmiekan.'
          );
        } else {
          gameMessage('Kaunis musiikki soi ympärilläsi.');
        }
      }
    },
  },
  // The sword is used to kill the dragon and to receive the One Ring.
  {
    name: 'miekka',
    location: 8,
    image: kuva_miekka,
    useFunction: ({
      inventory,
      setInventory,
      itemsInGame,
      setItemsInGame,
      currentLocation,
      locations,
      setLocations,
    }) => {
      if (
        currentLocation !== undefined &&
        locations !== undefined &&
        inventory &&
        setInventory &&
        itemsInGame &&
        setItemsInGame &&
        setLocations
      ) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 3
        ) {
          deleteItem('miekka', inventory, setInventory);
          itemsInGame.push(EXTRA_ITEMS[2]);
          setItemsInGame([...itemsInGame]);
          locations[9].isLocked = false;
          setLocations([...locations]);
          gameMessage(
            'Heilautat miekkaa ja tapat lohikäärmeen. Lohikäärme pudottaa jotain. Kuulet portin aukeavan jossain.'
          );
        } else {
          gameMessage('Heiluttelet miekkaasi tylsistyneenä...');
        }
      }
    },
  },
  // The One Ring must be used in Mount Doom to win the game.
  {
    name: 'sormus',
    location: 3,
    image: kuva_sormus,
    useFunction: ({
      currentLocation,
      locations,
      inventory,
      setInventory,
      setGameOver,
    }) => {
      if (
        currentLocation !== undefined &&
        locations !== undefined &&
        setGameOver
      ) {
        if (
          locations.findIndex(
            location => location.name === currentLocation.name
          ) === 10 &&
          inventory &&
          setInventory
        ) {
          deleteItem('sormus', inventory, setInventory);
          setGameOver(prev => !prev);
          gameMessage('Pudotat sormuksen tulivuoreen. Voitit pelin!');
        } else {
          gameMessage(
            'Muutut näkymättömäksi. Tunnet pahantahtoisen tietoisuuden kääntävän huomionsa sinuun.'
          );
        }
      }
    },
  },
  // The empty can must be left on the floor of the guild.
  {
    name: 'tölkki',
    location: 9,
    image: kuva_tolkki,
    useFunction: () =>
      gameMessage('Tölkki on nyt tyhjä. Mietit elämänvalintojasi.'),
  },
];
