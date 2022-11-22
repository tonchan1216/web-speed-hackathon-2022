import React from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

import { Container } from "../../../components/layouts/Container";
import { Section } from "../../../components/layouts/Section";
import { Spacer } from "../../../components/layouts/Spacer";
import { TrimmedImage } from "../../../components/media/TrimmedImage";
import { TabNav } from "../../../components/navs/TabNav";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
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

/** @type {React.VFC} */
export const RaceCommon = () => {
  const { raceId } = useParams();
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);
  const path = useLocation().pathname.split("/")[3];

  return (
    <Container>
      <Spacer mt={Space * 2} />
      <Heading as="h1">{data ? data.name : "Now Loading"}</Heading>
      <p>
        開始 {data && formatTime(data.startAt)} 締切{" "}
        {data && formatTime(data.closeAt)}
      </p>

      <Spacer mt={Space * 2} />

      <Section dark shrink>
        <LiveBadge>Live</LiveBadge>
        <Spacer mt={Space * 2} />
        <TrimmedImage
          height={225}
          src={data ? data.image : "/assets/images/races/gray.jpg"}
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
