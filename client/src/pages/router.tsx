import { createBrowserRouter } from "react-router";
import LandingPage from "./LandingPage/LandingPage";
import ProjectPage from "./ProjectPage/ProjectPage";

const routes = [
  {
    path: "/",
    element: <LandingPage/>
  },
  {
    path: "/project",
    element: <ProjectPage/>
  }
]

export const router = createBrowserRouter(routes);