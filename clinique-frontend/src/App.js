import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ❌ plus besoin de BrowserRouter ici
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import Layout from './components/layout/Layout'; // Ajuste le chemin selon ton projet
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import EmergencyPage from './pages/EmergencyPage';
import DoctorDetail from './components/DoctorDetail';
import DashboardM from "./pages/medecin/MedecinDashboard";
import Rendezvous from "./pages/medecin/RendezvousM";
import Patients from "./pages/medecin/PatientsM";
import DashboardS from "./pages/secreitaire/SecretaireDashboard";
import PatientsListS from "./pages/secreitaire/patients/PatientsListS";
import AddPatientS from "./pages/secreitaire/patients/AddPatientS";
import EditPatientS from "./pages/secreitaire/patients/EditPatientS";
import AppointmentsListS from "./pages/secreitaire/appointments/AppointmentsListS";
import AddAppointmentS from "./pages/secreitaire/appointments/AddAppointmentS";
import EditAppointmentS from "./pages/secreitaire/appointments/EditAppointmentS";
import PatientAdminS from "./pages/secreitaire/PatientAdminS";
import DashboardA from './pages/admin/AdminDashboard';
import './styles/globals.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/medecins" element={<DoctorsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medecins/:doctorId" element={<DoctorDetail />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/urgences" element={<EmergencyPage />} />
           <Route path="/medecin/dashboard" element={<DashboardM />} />
        <Route path="/medecin/rendezvous" element={<Rendezvous />} />
        <Route path="/medecin/patients" element={<Patients />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/admin/dashboard" element={<DashboardA />} />
         <Route path="/secretaire/dashboard" element={<DashboardS />}>
        {/* Patients */}
        <Route path="patients" element={<PatientsListS />} />
        <Route path="patients/add" element={<AddPatientS />} />
        <Route path="patients/edit/:id" element={<EditPatientS />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentsListS />} />
        <Route path="appointments/add" element={<AddAppointmentS />} />
        <Route path="appointments/edit/:id" element={<EditAppointmentS />} />

        {/* Dossier administratif */}
        <Route path="patient-admin/:id" element={<PatientAdminS />} />
      </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
