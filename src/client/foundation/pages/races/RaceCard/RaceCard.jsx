import { useOutletContext } from "react-router-dom";

import { Spacer } from "../../../components/layouts/Spacer";
import { Space } from "../../../styles/variables";

import { EntryTable } from "./internal/EntryTable";
import { PlayerPictureList } from "./internal/PlayerPictureList";

/** @type {React.VFC} */
export const RaceCard = () => {
  const [data] = useOutletContext();

  return (
    <>
      <Spacer mt={Space * 2} />

      <PlayerPictureList>
        {data.entries
          ? data.entries.map((entry) => (
              <PlayerPictureList.Item
                key={entry.id}
                image={entry.player.image}
                name={entry.player.name}
                number={entry.number}
              />
            ))
          : [...Array(10)].map((_, k) => (
              <PlayerPictureList.Item
                key={k}
                image="/assets/images/races/gray.jpg"
                name=""
                number={k + 1}
              />
            ))}
      </PlayerPictureList>

      <Spacer mt={Space * 4} />

      {data.entries ? <EntryTable entries={data.entries} /> : <></>}
    </>
  );
};
