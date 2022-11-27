import { useEffect, useReducer } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

import { Container } from "../../../components/layouts/Container";
import { Section } from "../../../components/layouts/Section";
import { Spacer } from "../../../components/layouts/Spacer";
import { TrimmedImage } from "../../../components/media/TrimmedImage";
import { TabNav } from "../../../components/navs/TabNav";
import { Heading } from "../../../components/typographies/Heading";
import { Color, Radius, Space } from "../../../styles/variables";
import { formatTime } from "../../../utils/DateUtils";
import { jsonFetcher } from "../../../utils/HttpUtils";

const LiveBadge = styled.span`
  background: ${Color.red};
  border-radius: ${Radius.SMALL};
  color: ${Color.mono[0]};
  font-weight: bold;
  padding: ${Space * 1}px;
  text-transform: uppercase;
`;

const reducerFunc = (raceState, action) => {
  switch (action.type) {
    case "race":
      return { ...raceState, race: action.race };
    case "odds":
      return { ...raceState, trifectaOdds: action.trifectaOdds };
    case "entries":
      return { ...raceState, entries: action.entries };
    case "raceEntries":
      return { ...raceState, entries: action.entries, race: action.race };
    case "oddsEntries":
      return {
        ...raceState,
        entries: action.entries,
        trifectaOdds: action.trifectaOdds,
      };
    case "full":
      return {
        ...raceState,
        entries: action.entries,
        race: action.race,
        trifectaOdds: action.trifectaOdds,
      };
    default:
      return raceState;
  }
};

const extractRace = (data) => {
  return {
    closeAt: data.closeAt,
    id: data.id,
    image: data.image,
    name: data.name,
    startAt: data.startAt,
  };
};

/** @type {React.VFC} */
export const RaceCommon = () => {
  const { raceId } = useParams();
  const [data, dispatch] = useReducer(reducerFunc, {
    entries: null,
    race: null,
    trifectaOdds: null,
  });

  const path = useLocation().pathname.split("/")[3];

  useEffect(() => {
    const url = `/api/races/${raceId}`;
    switch (path) {
      case "race-card":
        if (data.entries == null) {
          jsonFetcher(url + "?type=entries").then((data) => {
            if (data.race == null) {
              dispatch({
                entries: data.entries,
                race: extractRace(data),
                type: "raceEntries",
              });
            } else {
              dispatch({ entries: data.entries, type: "entries" });
            }
          });
        }
        break;
      case "odds":
        if (data.entries == null) {
          jsonFetcher(url + "?type=full").then((data) => {
            if (data.race == null) {
              dispatch({
                entries: data.entries,
                race: extractRace(data),
                trifectaOdds: data.trifectaOdds,
                type: "full",
              });
            } else {
              dispatch({
                entries: data.entries,
                trifectaOdds: data.trifectaOdds,
                type: "oddsEntries",
              });
            }
          });
        } else if (data.trifectaOdds == null) {
          jsonFetcher(url + "?type=odds").then((data) => {
            dispatch({ trifectaOdds: data.trifectaOdds, type: "odds" });
          });
        }
        break;
      case "result":
        if (data.race == null) {
          jsonFetcher(url + "?type=simple").then((data) => {
            dispatch({ race: extractRace(data), type: "race" });
          });
        }
        break;
    }
  }, [path, data, raceId]);

  return (
    <Container>
      <Spacer mt={Space * 2} />
      <Heading as="h1">{data.race ? data.race.name : "Now Loading"}</Heading>
      <p>
        開始 {data.race ? formatTime(data.race.startAt) : "xx:xx"} 締切{" "}
        {data.race ? formatTime(data.race.closeAt) : "xx:xx"}
      </p>

      <Spacer mt={Space * 2} />

      <Section dark shrink>
        <LiveBadge>Live</LiveBadge>
        <Spacer mt={Space * 2} />
        <TrimmedImage
          height={225}
          src={data.race ? data.race.image : "/assets/images/races/gray.jpg"}
          type="live"
          width={400}
        />
      </Section>

      <Spacer mt={Space * 2} />

      <Section>
        <TabNav>
          <TabNav.Item
            aria-current={path == "race-card" ? "true" : undefined}
            to={`/races/${raceId}/race-card`}
          >
            出走表
          </TabNav.Item>
          <TabNav.Item
            aria-current={path == "odds" ? "true" : undefined}
            to={`/races/${raceId}/odds`}
          >
            オッズ
          </TabNav.Item>
          <TabNav.Item
            aria-current={path == "result" ? "true" : undefined}
            to={`/races/${raceId}/result`}
          >
            結果
          </TabNav.Item>
        </TabNav>

        <Outlet context={[data]} />
      </Section>
    </Container>
  );
};
