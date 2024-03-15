import type {ChangeEvent, FormEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import React from 'react';

import type {Item} from '@/game/items';
import {STARTING_ITEMS} from '@/game/items';
import type {MapLocation} from '@/game/map';
import {map} from '@/game/map';
import {DIRECTIONS, ITEM_COMMANDS, play} from '@/game/play';
import gameMessage from '@/game/gameMessage';

const Game: React.FC = () => {
  // Initializing states
  const [action, setAction] = useState<string>('');
  const [itemsInGame, setItemsInGame] = useState<Item[]>(STARTING_ITEMS);
  const [location, setLocation] = useState<MapLocation>(map[0]);
  const [locations, setLocations] = useState<MapLocation[]>(map);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  let itemInLocationIndex: number = itemsInGame.findIndex(
    item =>
      item.location === locations.findIndex(loc => loc.name === location.name)
  );

  // References the input field
  const ref = useRef<HTMLInputElement>(null);

  // Using useEffect to focus on the input field whenever enter is pressed.
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && document.activeElement !== ref.current) {
        ref.current?.focus();
        // This prevents the default key action.
        event.preventDefault();
      }
    };

    // Adds an event listener.
    document.addEventListener('keypress', handleKeyPress);

    // Removes the event listener when the component unmounts to prevent memory leaks.
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  // Updates the action variable whenever the user types something.
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAction(e.target.value);
  };

  // When the user presses the action button or enter.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Making sure the command is valid.
    if (
      !DIRECTIONS.includes(action) &&
      !ITEM_COMMANDS.some(prefix => action.startsWith(prefix))
    ) {
      gameMessage(
        "Tuntematon komento. Kokeile jotain ilmansuuntaa. Muita hyväksyttäviä komentoja ovat 'poimi', 'käytä' ja 'pudota' - esimerkiksi 'käytä miekka'."
      );
      // Calling the play function to process the user's command.
    } else {
      play(
        action,
        location,
        setLocation,
        locations,
        setLocations,
        inventory,
        setInventory,
        itemsInGame,
        setItemsInGame,
        setGameOver
      );
    }
    // Submitting always clears the input field.
    setAction('');
  };

  // The render part
  return (
    <>
      <div className="wrapper">
        {/* Showing the current location's name and image, along with the form for interacting with the game. */}
        <div className="header">
          <h1>{location.name}</h1>
          <p>
            {itemInLocationIndex > -1
              ? `Näet esineen ${itemsInGame[itemInLocationIndex].name}.`
              : ''}
            {gameOver && 'Voitit pelin!'}
          </p>
        </div>{' '}
        {/* End of header */}
        <div className="locationImage">
          <img src={location.image} />
        </div>{' '}
        {/* End of locationImage */}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              ref={ref}
              value={action}
              onChange={handleChange}
              placeholder="Mitä haluat tehdä?"
              required
            />
          </div>
          <button>Vastaa</button>
        </form>
        {/* Showing inventory items here. */}
        <div className="inventory">
          <h2>
            {inventory.length === 0
              ? 'Sinulla ei ole esineitä'
              : inventory.length === 1
                ? 'Sinulla on yksi esine'
                : 'Sinulla on ' + inventory.length + ' esinettä'}
          </h2>
          <div className="items">
            {inventory.map((item, index) => (
              <React.Fragment key={index}>
                  <div className="itemImage">
                    <img src={item.image} />
                  </div>
              </React.Fragment>
            ))}
          </div>
          {/* End of items */}
        </div>
        {/* End of inventory */}
      </div>
      {/* End of wrapper */}
    </>
  );
};

export default Game;
