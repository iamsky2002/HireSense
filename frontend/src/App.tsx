import { Divider, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import HomePage from "./Pages/HomePage";
import FindJobsPage from "./Pages/FindJobsPage";
import FindTalentPage from "./Pages/FindTalentPage";
import TalentProfilePage from "./Pages/TalentProfilePage";
import PostJobPage from "./Pages/PostJobPage";
import JobDescPage from "./Pages/JobDescPage";
import JobHistoryPage from "./Pages/JobHistoryPage";
import PostedJobsPage from "./Pages/PostedJobsPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";


function AppLayout() {
  const location = useLocation();
  const hideChrome =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 font-[Poppins] flex flex-col relative">
      {!hideChrome && <Header />}
      {!hideChrome && <Divider size="xs" mx="md" />}

      <div className="flex-grow">
        <Routes>
          <Route path="/find-jobs" element={<FindJobsPage />} />
          <Route path="/find-talent" element={<FindTalentPage />} />
          <Route path="/talent-profile" element={<TalentProfilePage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/jobs/:id" element={<JobDescPage />} />
          <Route path="/job-history" element={<JobHistoryPage />} />
          <Route path="/posted-jobs" element={<PostedJobsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  const theme = createTheme({
    focusRing: "never",
    fontFamily: "'Poppins', sans-serif",
    primaryColor: "brightSun",
    primaryShade: 4,
    colors: {
      
      brightSun: [
        "#fffbeb",
        "#fff3c6",
        "#ffe588",
        "#ffd149",
        "#ffbd20",
        "#f99b07",
        "#dd7302",
        "#b75006",
        "#943d0c",
        "#7a320d",
      ],
      mineShaft: [
        "#f6f6f6",
        "#e7e7e7",
        "#d1d1d1",
        "#b0b0b0",
        "#888888",
        "#6d6d6d",
        "#5d5d5d",
        "#4f4f4f",
        "#454545",
        "#3d3d3d",
      ],
      
      "bright-sun": [
        "#fffbeb",
        "#fff3c6",
        "#ffe588",
        "#ffd149",
        "#ffbd20",
        "#f99b07",
        "#dd7302",
        "#b75006",
        "#943d0c",
        "#7a320d",
      ],
      "mine-shaft": [
        "#f6f6f6",
        "#e7e7e7",
        "#d1d1d1",
        "#b0b0b0",
        "#888888",
        "#6d6d6d",
        "#5d5d5d",
        "#4f4f4f",
        "#454545",
        "#3d3d3d",
      ],
    },
  });

  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
