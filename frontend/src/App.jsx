import { Box } from "@chakra-ui/react";
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import Navbar from './components/Navbar.jsx';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import CourseDetail from './pages/courses/CourseDetail.jsx';
import CreateCourse from './pages/courses/CreateCourse.jsx';

function App() {

  return (
    <Box minH={"100vh"} bg={"gray.900"}>
      <Navbar />
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course/:id" element={<CourseDetail />} />

        <Route
          path="/course/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        >
        </Route>

      </Routes>
    </Box>
  )
}

export default App
