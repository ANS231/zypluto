import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./about.css";

import heroImg from "../assets/global-network.jpg";
import dataImg from "../assets/datacenter.jpg";
import teamImg from "../assets/office-team.jpg";

const AboutPage = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const elements =
      document.querySelectorAll(".fade-up");

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {
              entry.target.classList.add("show");
            }

          });

        },
        { threshold: 0.2 }
      );

    elements.forEach((el) =>
      observer.observe(el)
    );

    return () =>
      observer.disconnect();

  }, []);

  return (
    <>

      <Header />

      <div className="about-page">

        {/* HERO */}

        <section className="about-hero fade-up">

          <div className="about-hero-text">

            <h1>
              Building Intelligent Data
              Solutions for Modern
              Businesses
            </h1>

            <p>
              Capture.Expert helps
              organizations collect,
              enhance, structure, and
              utilize high-quality
              datasets for AI,
              automation, analytics,
              and enterprise workflows.
            </p>

          </div>

          <img
            src={heroImg}
            alt="Global Data"
          />

        </section>

        {/* ABOUT */}

        <section className="about-split fade-up">

          <img
            src={dataImg}
            alt="Data Platform"
          />

          <div>

            <h2>
              About Capture.Expert
            </h2>

            <p>
              Capture.Expert is a modern
              data intelligence and AI
              solutions company focused
              on helping businesses
              transform raw data into
              meaningful business value.
            </p>

            <p>
              We work with organizations
              across industries to
              provide custom datasets,
              intelligent data
              processing, AI-ready
              structuring, automation
              workflows, and scalable
              enterprise solutions.
            </p>

            <p>
              From data collection to
              AI-powered integration,
              our goal is to simplify
              how businesses leverage
              data for innovation,
              decision-making, and
              growth.
            </p>

            <div className="about-highlights">

              <div>
                ✔ Enterprise Data
                Solutions
              </div>

              <div>
                ✔ AI & Automation
                Ready
              </div>

              <div>
                ✔ Multi-Industry
                Support
              </div>

              <div>
                ✔ Custom Development
              </div>

            </div>

          </div>

        </section>

        {/* WHAT WE DO */}

        <section className="about-split reverse fade-up">

          <div>

            <h2>
              What We Do
            </h2>

            <ul>

              <li>
                Custom dataset
                collection and delivery
              </li>

              <li>
                AI-ready data
                enhancement and
                processing
              </li>

              <li>
                Business automation and
                workflow integration
              </li>

              <li>
                Enterprise AI and
                analytics solutions
              </li>

              <li>
                Custom software and
                intelligent platform
                development
              </li>

            </ul>

          </div>

          <img
            src={teamImg}
            alt="Team"
          />

        </section>

        {/* PROCESS */}

        <section className="about-process fade-up">

          <h2>
            How Capture.Expert Works
          </h2>

          <div className="process-grid">

            <div className="process-card">

              <h4>
                1. Share Requirements
              </h4>

              <p>
                Businesses raise a
                capture request based on
                their exact dataset or
                solution requirements.
              </p>

            </div>

            <div className="process-card">

              <h4>
                2. Data Collection
              </h4>

              <p>
                Our team collects,
                structures, validates,
                and prepares the data
                according to business
                needs.
              </p>

            </div>

            <div className="process-card">

              <h4>
                3. AI Enhancement
              </h4>

              <p>
                Datasets can be enhanced
                for AI, automation,
                analytics, and
                enterprise workflows.
              </p>

            </div>

            <div className="process-card">

              <h4>
                4. Delivery &
                Integration
              </h4>

              <p>
                Final solutions and
                datasets are securely
                delivered and integrated
                into business systems.
              </p>

            </div>

          </div>

        </section>

        {/* WHY */}

        <section className="about-why fade-up">

          <h2>
            Why Capture.Expert
          </h2>

          <div className="why-grid">

            <div className="why-card">

              <h4>
                Enterprise Focused
              </h4>

              <p>
                Built to support modern
                business requirements
                across industries.
              </p>

            </div>

            <div className="why-card">

              <h4>
                AI Driven
              </h4>

              <p>
                Designed for AI
                workflows, automation,
                analytics, and
                intelligent systems.
              </p>

            </div>

            <div className="why-card">

              <h4>
                Custom Solutions
              </h4>

              <p>
                Every dataset and
                workflow can be
                customized according to
                business needs.
              </p>

            </div>

            <div className="why-card">

              <h4>
                Secure Infrastructure
              </h4>

              <p>
                Enterprise-grade
                security and controlled
                delivery processes for
                data protection.
              </p>

            </div>

          </div>

        </section>

        {/* MISSION / VISION */}

        <section className="about-mv fade-up">

          <div className="mv-card">

            <h3>
              Our Mission
            </h3>

            <p>
              To help businesses unlock
              the full power of data
              through intelligent
              AI-driven solutions,
              automation, and scalable
              enterprise technologies.
            </p>

          </div>

          <div className="mv-card">

            <h3>
              Our Vision
            </h3>

            <p>
              To become a global leader
              in enterprise data
              intelligence, AI-powered
              automation, and modern
              business transformation
              solutions.
            </p>

          </div>

        </section>

        {/* CTA */}

        <section className="about-cta fade-up">

          <h2>
            Transform Your Business
            with Intelligent Data
            Solutions
          </h2>

          <p>
            Raise your capture request
            and build AI-powered
            business workflows with
            Capture.Expert.
          </p>

          <div className="cta-buttons">

            <button
              onClick={() =>
                navigate("/signup")
              }
              className="about-btn-primary"
            >
              Get Started
            </button>

            

          </div>

        </section>

      </div>

      <Footer />

    </>
  );
};

export default AboutPage;