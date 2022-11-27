import moment from "moment-mini";
import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { Container } from "../../components/layouts/Container";
import { Spacer } from "../../components/layouts/Spacer";
import { Stack } from "../../components/layouts/Stack";
import { Heading } from "../../components/typographies/Heading";
import { useAuthorizedFetch } from "../../hooks/useAuthorizedFetch";
import { useFetch } from "../../hooks/useFetch";
import { Color, Radius, Space } from "../../styles/variables";
import { authorizedJsonFetcher, jsonFetcher } from "../../utils/HttpUtils";
import { assets } from "../../utils/UrlUtils.js";

const ChargeDialog = lazy(() => import("./internal/ChargeDialog"));
import { HeroImage } from "./internal/HeroImage";
import { RecentRaceList } from "./internal/RecentRaceList";

const ChargeButton = styled.button`
  background: ${Color.mono[700]};
  border-radius: ${Radius.MEDIUM};
  color: ${Color.mono[0]};
  padding: ${Space * 1}px ${Space * 2}px;

  &:hover {
    background: ${Color.mono[800]};
  }
`;

/** @type {React.VFC} */
export const Top = () => {
  const { date = moment().format("YYYY-MM-DD") } = useParams();
  const since = moment(date).startOf("days").unix();
  const until = moment(date).endOf("days").unix();

  const chargeDialogRef = useRef(null);

  const { data: userData, revalidate } = useAuthorizedFetch(
    "/api/users/me",
    authorizedJsonFetcher,
  );

  const { data: raceData } = useFetch(
    `/api/races?since=${since}&until=${until}`,
    jsonFetcher,
  );

  const handleClickChargeButton = useCallback(() => {
    if (chargeDialogRef.current === null) {
      return;
    }

    chargeDialogRef.current.showModal();
  }, []);

  const handleCompleteCharge = useCallback(() => {
    revalidate();
  }, [revalidate]);

  const todayRaces = useMemo(() => {
    if (raceData == null) {
      return [];
    }

    return [...raceData.races].sort(
      (/** @type {Model.Race} */ a, /** @type {Model.Race} */ b) =>
        moment(a.startAt) - moment(b.startAt),
    );
  }, [raceData]);
  
  return (
    <Container>
      <HeroImage url={assets("/images/hero.webp")} />

      <Spacer mt={Space * 2} />
      {userData && (
        <Stack horizontal alignItems="center" justifyContent="space-between">
          <div>
            <p>ポイント残高: {userData.balance}pt</p>
            <p>払戻金: {userData.payoff}Yeen</p>
          </div>

          <ChargeButton onClick={handleClickChargeButton}>
            チャージ
          </ChargeButton>
        </Stack>
      )}

      <Spacer mt={Space * 2} />
      <section>
        <Heading as="h1">本日のレース</Heading>
        <RecentRaceList races={todayRaces} />
      </section>

      {userData && (
        <Suspense fallback={<div></div>}>
          <ChargeDialog
            ref={chargeDialogRef}
            onComplete={handleCompleteCharge}
          />
        </Suspense>
      )}
    </Container>
  );
};
