import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import BasicLayout from "../layouts/BasicLayout";
import { searchGamesApi } from "../api/game";
import { useRouter } from "next/router";
import { size } from "lodash";
import ListGames from "../components/ListGames";

export default function search() {
  const [games, setGames] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    document.getElementById("search-game").focus();
  });

  useEffect(() => {
    (async () => {
      if (size(query.query) > 0) {
        const response = await searchGamesApi(query.query);
        if (size(response) > 0) {
          setGames(response);
        } else {
          setGames([]);
        }
      } else {
        setGames([]);
      }
    })();
  }, [query]);

  return (
    <BasicLayout className="search">
      {!games && <Loader active>Buscando juegos..</Loader>}
      {games && size(games) === 0 && (
        <div>
          <h3>No se han encontrado juegos</h3>
        </div>
      )}
      {size(games) > 0 && <ListGames games={games} />}
    </BasicLayout>
  );
}
