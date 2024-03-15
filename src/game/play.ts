/*
    play.ts
    This function handles the gameplay actions depending on user input.
    Validates input and calls the appropriate functions.
*/

import gameMessage from './gameMessage';
import type {Item} from './items';
import {dropItem, takeItem} from './items';
import type {MapLocation} from './map';
import {getDestination, move} from './map';

// Defining acceptable commands.
export const DIRECTIONS: string[] = ['pohjoinen', 'itä', 'etelä', 'länsi'];
export const ITEM_COMMANDS: string[] = ['poimi', 'käytä', 'pudota'];

export const play = (
  input: string,
  currentLocation: MapLocation,
  setLocation: React.Dispatch<React.SetStateAction<MapLocation>>,
  locations: MapLocation[],
  setLocations: React.Dispatch<React.SetStateAction<MapLocation[]>>,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  itemsInGame: Item[],
  setItemsInGame: React.Dispatch<React.SetStateAction<Item[]>>,
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const action = input.trim().toLowerCase();

  // Handle move actions.
  if (DIRECTIONS.includes(action)) {
    const destination = getDestination(action, currentLocation);
    move(destination, currentLocation, locations, setLocation);
    // Handle item actions.
  } else if (ITEM_COMMANDS.some(prefix => action.startsWith(prefix))) {
    // Picking up an item requires that there is an item in itemsInGame whose location matches the current location.
    // If the user does not specify the item, the game will pick up the first item in that matches.
    if (action.startsWith('poimi')) {
      let index = -1;
      const itemName = action.split(' ')[1] ?? '';
      if (itemName) {
        index = itemsInGame.findIndex(
          item =>
            item.name === itemName &&
            item.location ===
              locations.findIndex(
                location => location.name === currentLocation.name
              )
        );
      } else {
        index = itemsInGame.findIndex(
          item =>
            item.location ===
            locations.findIndex(
              location => location.name === currentLocation.name
            )
        );
      }
      if (index > -1) {
        takeItem(
          itemsInGame[index],
          inventory,
          setInventory,
          itemsInGame,
          setItemsInGame
        );
      } else if (index === -1 && itemName) {
        gameMessage(`Esinettä ${itemName} ei löydy täältä.`);
      } else {
        gameMessage('Täällä ei ole mitään poimittavaa.');
      }
      // Dropping or using an item requires that the desired item exists in inventory.
    } else if (action.startsWith('käytä') || action.startsWith('pudota')) {
      try {
        const [itemAction, itemName] = action.split(' ');
        const index = inventory.findIndex(item => item.name === itemName);
        if (!itemName) {
          if (itemAction === 'käytä') {
            gameMessage('Käytä mitä?');
          } else {
            gameMessage('Pudota mikä?');
          }

        } else if (index > -1) {
          itemAction === 'käytä' &&
            inventory[index].useFunction({
              inventory,
              setInventory,
              itemsInGame,
              setItemsInGame,
              currentLocation,
              locations,
              setLocations,
              setGameOver
            });
          itemAction === 'pudota' &&
            dropItem(
              inventory[index],
              inventory,
              setInventory,
              itemsInGame,
              setItemsInGame,
              currentLocation,
              locations
            );
        } else {
          gameMessage('Sinulla ei ole kyseistä esinettä.');
        }
        // Fallback in case the user manages to break something with unexpected input.
      } catch (error) {
        gameMessage('Et voi tehdä toimintoa.');
      }
    }
  }
};
