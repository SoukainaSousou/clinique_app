import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './layout/Navbar';
import { 
  Stethoscope, Users, ClipboardList, Phone, 
  Calendar, Clock, MapPin, ArrowRight,
  Heart, Eye, Brain, Star, ChevronDown, Menu, X
} from 'lucide-react';
import styles from './CliniqueInfo.module.css';
import { Link } from 'react-router-dom';
// Créer des icônes personnalisées avec des emojis
const CustomIcons = {
  Dentisterie: () => <span style={{ fontSize: '24px' }}>🦷</span>,
  Pediatrie: () => <span style={{ fontSize: '24px' }}>👶</span>,
  Analyses: () => <span style={{ fontSize: '24px' }}>🔬</span>
};

export default function CliniqueInfo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  const doctors = [
    { name: "Dr. Ahmed Khan", specialty: "Cardiologie", experience: "15 ans", image: "👨‍⚕️" },
    { name: "Dr. Sophie Martin", specialty: "Pédiatrie", experience: "12 ans", image: "👩‍⚕️" },
    { name: "Dr. Pierre Dubois", specialty: "Dentisterie", experience: "10 ans", image: "👨‍⚕️" },
    { name: "Dr. Fatima Alami", specialty: "Ophtalmologie", experience: "8 ans", image: "👩‍⚕️" }
  ];

  const services = [
    { icon: <Heart size={24} />, title: "Cardiologie", description: "Soins cardiaques complets" },
    { icon: <CustomIcons.Pediatrie />, title: "Pédiatrie", description: "Soins spécialisés enfants" },
    { icon: <CustomIcons.Dentisterie />, title: "Dentisterie", description: "Soins dentaires avancés" },
    { icon: <Eye size={24} />, title: "Ophtalmologie", description: "Vision et santé oculaire" },
    { icon: <Brain size={24} />, title: "Neurologie", description: "Système nerveux et cerveau" },
    { icon: <CustomIcons.Analyses />, title: "Analyses", description: "Laboratoire moderne" }
  ];

  const stats = [
    { number: "50+", label: "Médecins experts" },
    { number: "10k+", label: "Patients satisfaits" },
    { number: "24/7", label: "Urgences" },
    { number: "15", label: "Spécialités" }
  ];

  return (
    <div className={styles.container}>
  <Navbar />

      {/* ---- Hero Section avec CTA ---- */}
      <section id="accueil" className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={styles.heroContent}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={styles.heroBadge}
          >
            🏆 Meilleure clinique 2024
          </motion.div>
          
          <h1 className={styles.heroTitle}>
            Votre Santé, 
            <span className={styles.highlight}> Notre Priorité</span>
          </h1>
          
          <p className={styles.heroText}>
            Des soins médicaux d'excellence dans un environnement moderne et chaleureux. 
            Notre équipe de professionnels dévoués est à votre service 24h/24.
          </p>
          
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>
              Prendre Rendez-vous <ArrowRight size={16} />
            </button>
            <button className={styles.secondaryButton}>
              Urgence <Phone size={16} />
            </button>
          </div>

          {/* Stats en bas du hero */}
          <div className={styles.heroStats}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.statItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ---- Section Services ---- */}
      <section id="services" className={styles.services}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nos Services Médicaux</h2>
          <p className={styles.sectionSubtitle}>
            Des soins complets pour toute la famille
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={styles.serviceIcon}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <button className={styles.serviceButton}>
                En savoir plus <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Section Médecins ---- */}
      <section id="doctors" className={styles.doctors}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Notre Équipe Médicale</h2>
          <p className={styles.sectionSubtitle}>
            Des professionnels expérimentés à votre service
          </p>
        </div>

        <div className={styles.doctorsGrid}>
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              className={styles.doctorCard}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.doctorImage}>
                {doctor.image}
              </div>
              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                <p className={styles.doctorExperience}>{doctor.experience} d'expérience</p>
                <div className={styles.doctorRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <Link 
  to={`/medecins/${doctor.id}`} 
  className={styles.doctorButton}
>
  Voir Profil <ArrowRight size={14} />
</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Section Urgences ---- */}
      <section id="urgence" className={styles.emergency}>
        <div className={styles.emergencyContent}>
          <motion.div
            className={styles.emergencyText}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className={styles.emergencyTitle}>
              Service d'Urgence 24h/24
            </h2>
            <p className={styles.emergencyDescription}>
              Notre service d'urgence est disponible jour et nuit pour prendre 
              en charge toutes les situations médicales critiques.
            </p>
            <div className={styles.emergencyInfo}>
              <div className={styles.emergencyItem}>
                <Clock size={20} />
                <span>Ouvert 24h/24, 7j/7</span>
              </div>
              <div className={styles.emergencyItem}>
                <Phone size={20} />
                <span>0536-50-06-01</span>
              </div>
              <div className={styles.emergencyItem}>
                <MapPin size={20} />
                <span>12 Rue de la Santé, Oujda</span>
              </div>
            </div>
            <button className={styles.emergencyButton}>
              Appeler Urgence <Phone size={16} />
            </button>
          </motion.div>
          
          <motion.div
            className={styles.emergencyVisual}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className={styles.emergencyBadge}>🚨 URGENCE</div>
          </motion.div>
        </div>
      </section>

      {/* ---- Section Contact ---- */}
      <section id="contact" className={styles.contact}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2 className={styles.contactTitle}>Prendre Contact</h2>
            <p className={styles.contactDescription}>
              N'hésitez pas à nous contacter pour toute question ou prise de rendez-vous.
            </p>
            
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <Phone size={24} />
                <div>
                  <h4>Téléphone</h4>
                  <p>0536-50-06-01</p>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <MapPin size={24} />
                <div>
                  <h4>Adresse</h4>
                  <p>12 Rue de la Santé, Oujda</p>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <Clock size={24} />
                <div>
                  <h4>Horaires</h4>
                  <p>Lun - Ven: 8h-20h<br/>Sam: 8h-14h</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h3>Formulaire de Contact</h3>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Votre nom" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Votre email" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="tel" placeholder="Votre téléphone" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Votre message" rows="4" className={styles.formTextarea}></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                Envoyer Message <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>🏥 SantéPlus</div>
            <p className={styles.footerDescription}>
              Votre partenaire santé de confiance à Oujda.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Liens Rapides</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#doctors">Médecins</a></li>
              <li><a href="#urgence">Urgences</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>📞 0536-50-06-01</p>
            <p>📍 12 Rue de la Santé, Oujda</p>
            <p>✉️ contact@clinique-santeplus.ma</p>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Clinique SantéPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}