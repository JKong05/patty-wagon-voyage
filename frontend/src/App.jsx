import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as React from "react";
import Root from "./routes/root";
import ErrorPage from "./routes/error";
import Trivia from "./routes/trivia";
import SelectBlitz from "./routes/selectblitz";
import Leaderboard from "./routes/leaderboard";
import Story from "./routes/story";
import Blitz from "./routes/blitz";

/**
 * Routes all the different pages of the web application
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/story",
        element: <Story />,
      },
      {
        path: "/selectblitz",
        element: <SelectBlitz />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
    ],
  },
  {
    path: "/trivia",
    element: <Trivia />,
  },
  {
    path: "/blitz",
    element: <Blitz />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
