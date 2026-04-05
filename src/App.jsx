// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster }        from 'react-hot-toast';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/common/ProtectedRoute';

// Auth
import Login              from './pages/auth/Login';
import Register           from './pages/auth/Register';
import ForgotPassword     from './pages/auth/ForgotPassword';

// Student
import StudentDashboard   from './pages/student/Dashboard';
import Courses            from './pages/student/Courses';
import CourseDetail       from './pages/student/CourseDetail';
import Recommended        from './pages/student/Recommended';
import Wishlist           from './pages/student/Wishlist';
import MyEnrollments      from './pages/student/MyEnrollments';

// Teacher
import TeacherDashboard   from './pages/teacher/Dashboard';
import MyCourses          from './pages/teacher/MyCourses';
import CourseForm         from './pages/teacher/CourseForm';
import CourseStudents     from './pages/teacher/CourseStudents';
import Groups             from './pages/teacher/Groups';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', fontFamily: 'inherit' },
          }}
        />
        <Routes>

          {/* Public */}
          <Route path="/"                element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute role="student"><Courses /></ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute role="student"><CourseDetail /></ProtectedRoute>
          } />
          <Route path="/recommended" element={
            <ProtectedRoute role="student"><Recommended /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute role="student"><Wishlist /></ProtectedRoute>
          } />
          <Route path="/my-enrollments" element={
            <ProtectedRoute role="student"><MyEnrollments /></ProtectedRoute>
          } />

          {/* Teacher */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/courses" element={
            <ProtectedRoute role="teacher"><MyCourses /></ProtectedRoute>
          } />
          <Route path="/teacher/courses/new" element={
            <ProtectedRoute role="teacher"><CourseForm /></ProtectedRoute>
          } />
          <Route path="/teacher/courses/:id/edit" element={
            <ProtectedRoute role="teacher"><CourseForm /></ProtectedRoute>
          } />
          <Route path="/teacher/courses/:id/students" element={
            <ProtectedRoute role="teacher"><CourseStudents /></ProtectedRoute>
          } />
          <Route path="/teacher/courses/:id/groups" element={
            <ProtectedRoute role="teacher"><Groups /></ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}