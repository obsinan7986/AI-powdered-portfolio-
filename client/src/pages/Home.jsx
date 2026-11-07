/**
 * Home Page — single-page portfolio layout.
 * All sections imported from components/sections/.
 */
import { Helmet } from 'react-helmet-async';
import Hero         from '../components/sections/Hero';
import About        from '../components/sections/About';
import Experience   from '../components/sections/Experience';
import Certifications from '../components/sections/Certifications';
import Skills       from '../components/sections/Skills';
import Projects     from '../components/sections/Projects';
import Services     from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Contact      from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Obsa Tesfaye Demesa | Full-Stack Developer (MERN)</title>
        <meta
          name="description"
          content="Full-Stack Developer (MERN) and 4th-year Computer Science student at Haramaya University. Building scalable web applications with React, Node.js, Express, and MongoDB."
        />
        <meta property="og:title"       content="Obsa Tesfaye Demesa | Full-Stack Developer" />
        <meta property="og:description" content="Personal portfolio of Obsa Tesfaye — MERN stack developer and CS student at Haramaya University." />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={import.meta.env.VITE_SITE_URL || 'https://obsa-portfolio.vercel.app'} />
        <meta property="og:image"       content="/images/og-image.jpg" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content="Obsa Tesfaye Demesa | Full-Stack Developer" />
        <meta name="twitter:description" content="Personal portfolio of Obsa Tesfaye — MERN stack developer." />
      </Helmet>

      <Hero />
      <About />
      <Experience />
      <Certifications />
      <Skills />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
