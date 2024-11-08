import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import PattyWagon from '../components/PattyWagon';
import HomeButtonMenu from '../components/buttons/HomeButtonMenu';

export default function Root() {
  const navigate = useNavigate();
  const [keepHomeButtons, setHomeButtons] = useState(true);
  
  const handleSetGame = () => {
    setHomeButtons(false);
    navigate('/story');
  };

  const handleBlitz = () => {
    setHomeButtons(false);
    navigate('/selectblitz');
  }

  const handleGetLeaderboard = () => {
    setHomeButtons(false);
    navigate('/leaderboard');
  };

  return (
    <div className="home-container mx-auto flex flex-row h-screen">
      <div className="basis-1/2">
        <div className="title p-2 justify-center items-center flex">
          <img src="/logo.png" className="w-full h-84" draggable={false}></img>
        </div>
        <div className="patty-container pb-6 h-[38rem] flex justify-center items-center">
          <PattyWagon />
        </div>
      </div>
      <div className="basis-1/2">
        {keepHomeButtons ? (
          <HomeButtonMenu
            handleGetLeaderboard={handleGetLeaderboard}
            handleBlitz={handleBlitz}
            handleSetGame={handleSetGame}
          />
        ) : (
          <Outlet context={{ setHomeButtons }} />
        )}
      </div>
    </div>
  );

}