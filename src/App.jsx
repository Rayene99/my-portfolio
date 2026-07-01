import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Ebooks from "./components/Ebooks";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import CvPage from "./components/Cv";
import ArticlesPage from "./components/Blogs";
import AdvertiseBlogs from "./components/AdvertiseBlogs";
import EbooksPage from "./components/EbooksPage"; // ← add
import ProjectPage from "./components/projectPage";

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Experience />
            <Testimonials />
            <Projects />
            <AdvertiseBlogs onNavigate={() => navigate("/Blogs")} />
            <Ebooks />
            <Contact />
          </main>
        } />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/Blogs" element={<ArticlesPage />} />
        <Route path="/EbooksPage" element={<EbooksPage />} />
        <Route path="/projectPage" element={<ProjectPage />} />
      </Routes>
    </>
  );
}