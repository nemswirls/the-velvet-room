import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState({ level: 1, yen: 20000 });

  const updatePlayer = (newData) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, ...newData }));
  };

  return (
    <PlayerContext.Provider value={{ player, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);