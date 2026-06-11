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
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Layout decides when to show the Header/Footer (auth pages stay clean)
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
          <Route path="/post-job" element={<ProtectedRoute><PostJobPage /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<JobDescPage />} />
          <Route path="/job-history" element={<ProtectedRoute><JobHistoryPage /></ProtectedRoute>} />
          <Route path="/posted-jobs" element={<ProtectedRoute><PostedJobsPage /></ProtectedRoute>} />
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
      // camelCase keys (used by Tailwind classes like text-bright-sun-400)
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
      // kebab-case aliases — Mantine color props in components use these (e.g. color="bright-sun.4")
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
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
