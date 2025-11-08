import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import {
  Heart,
  Eye,
  Brain,
  Stethoscope,
  Baby,
  Microscope,
  Calendar,
  ArrowRight
} from 'lucide-react';

// Mapping des icônes : clé = iconName (venant de la BDD), valeur = composant Lucide
const iconMap = {
  Heart: <Heart size={32} />,
  Eye: <Eye size={32} />,
  Brain: <Brain size={32} />,
  Stethoscope: <Stethoscope size={32} />,
  Baby: <Baby size={32} />,
  Microscope: <Microscope size={32} />,
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/specialities');
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();

        const transformed = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          // Si details est une chaîne, on la transforme en tableau séparé par virgules
          details: typeof item.details === 'string'
            ? item.details.split(',').map(d => d.trim())
            : item.details || [],
          iconName: item.iconName || 'Stethoscope', // fallback
        }));

        setServices(transformed);
      } catch (err) {
        console.error('Erreur lors du chargement des spécialités:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des services médicaux...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>Erreur : {error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/" style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '500'
          }}>
            ← Retour à l'accueil
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Nos Services Médicaux</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Des Soins Complets pour Toute la Famille
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Découvrez notre gamme complète de services médicaux prodigués par des professionnels expérimentés.
          </p>
        </motion.div>

        {/* Grille des services */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{
                background: '#dbeafe',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                marginBottom: '1.5rem',
              }}>
                {iconMap[service.iconName] || iconMap.Stethoscope}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                {service.title}
              </h3>

              <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {service.description}
              </p>

              <ul style={{ color: '#6b7280', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                {service.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{detail}</li>
                ))}
              </ul>

              <button style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                Prendre RDV <Calendar size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Section CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            padding: '3rem 2rem',
            borderRadius: '1rem',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Besoin d'un Service Spécifique ?</h3>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: '0.9' }}>
            Notre équipe est à votre écoute pour répondre à tous vos besoins médicaux.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{
              background: '#fbbf24',
              color: '#1f2937',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Nous Contacter <ArrowRight size={16} />
            </button>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              0536-50-06-01
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
