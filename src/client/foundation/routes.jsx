import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";

const CommonLayout = lazy(() => import("./layouts/CommonLayout"));
const Top = lazy(() => import("./pages/Top"));
const RaceCommon = lazy(() => import("./pages/races/RaceCommon"));
const Odds = lazy(() => import("./pages/races/Odds"));
const RaceCard = lazy(() => import("./pages/races/RaceCard"));
const RaceResult = lazy(() => import("./pages/races/RaceResult"));

/** @type {React.VFC} */
export const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div></div>}>
        <RouterRoutes>
          <Route element={<CommonLayout />} path="/">
            <Route index element={<Top />} />
            <Route element={<Top />} path=":date" />
            <Route element={<RaceCommon />} path="races/:raceId">
              <Route element={<RaceCard />} path="race-card" />
              <Route element={<Odds />} path="odds" />
              <Route element={<RaceResult />} path="result" />
            </Route>
          </Route>
        </RouterRoutes>
      </Suspense>
    </BrowserRouter>
  );
};
