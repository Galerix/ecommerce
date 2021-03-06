import React from "react";
import ReactPlayer from "react-player/lazy";
import CarouselScreenshots from "../CarouselScreenshots";

export default function InfoGame(props) {
  const { game } = props;

  return (
    <div className="info-game">
      <ReactPlayer
        className="info-game__video"
        url={game.video}
        controls={true}
      />
      <CarouselScreenshots title={game.title} screenshots={game.screenshots} />
      <div className="info-game__content">
        <div dangerouslySetInnerHTML={{ __html: game.summary }} />
      </div>
    </div>
  );
}
