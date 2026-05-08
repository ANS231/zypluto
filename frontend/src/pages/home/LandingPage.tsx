import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import "./landing.css";

// Images

import processImg from "../../assets/about_landing.png";


// Videos
import heroVideo from "../../assets/hero-bg.mp4";


type Currency = "INR" | "USD" | "EUR";

const LandingPage = () => {
  const navigate = useNavigate();


  const [heroIndex, setHeroIndex] = useState(0);
  
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [planError, setPlanError] = useState("");

  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const [currency, setCurrency] = useState<Currency>("INR");
  
  const location = useLocation();

  /* ================= FETCH ================= */
  
  
  useEffect(() => {
  if (location.hash) {
    const id = location.hash.replace("#", "");

    const scrollToSection = () => {
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        setTimeout(scrollToSection, 100);
      }
    };

    scrollToSection();
  }
}, [location.pathname, location.hash]);

  

  useEffect(() => {
  const interval = setInterval(() => {
    setHeroIndex((prev) => (prev + 1) % heroInsights.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const PRICING_CONFIG = {
  INR: [
    {
      id: "starter",
      name: "Starter Plan",
      dataset_category: "A",
      total_limit_mb: 1024,
      price: 991,
      currency: "INR",
    },
    {
      id: "growth",
      name: "Professional Plan",
      dataset_category: "B",
      total_limit_mb: 2048,
      price: 3999,
      currency: "INR",
    },
    {
      id: "scale",
      name: "Expert Plan",
      dataset_category: "C",
      total_limit_mb: 5120,
      price: 9999,
      currency: "INR",
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      dataset_category: "All Access",
      total_limit_mb: "Unlimited",
      price: null,
      currency: "",
      isEnterprise: true,
    },
  ],

  USD: [
    {
      id: "starter",
      name: "Starter Plan",
      dataset_category: "A",
      total_limit_mb: 1024,
      price: 19,
      currency: "USD",
    },
    {
      id: "growth",
      name: "Professional Plan",
      dataset_category: "B",
      total_limit_mb: 2048,
      price: 79,
      currency: "USD",
    },
    {
      id: "scale",
      name: "Expert Plan",
      dataset_category: "C",
      total_limit_mb: 5120,
      price: 199,
      currency: "USD",
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      dataset_category: "All Access",
      total_limit_mb: "Unlimited",
      price: null,
      currency: "",
      isEnterprise: true,
    },
  ],

  EUR: [
    {
      id: "starter",
      name: "Starter Plan",
      dataset_category: "A",
      total_limit_mb: 1024,
      price: 17,
      currency: "EUR",
    },
    {
      id: "growth",
      name: "Professional Plan",
      dataset_category: "B",
      total_limit_mb: 2048,
      price: 69,
      currency: "EUR",
    },
    {
      id: "scale",
      name: "Expert Plan",
      dataset_category: "C",
      total_limit_mb: 5120,
      price: 179,
      currency: "EUR",
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      dataset_category: "All Access",
      total_limit_mb: "Unlimited",
      price: null,
      currency: "",
      isEnterprise: true,
    },
  ],
};

/* 🔥 SET PLANS BASED ON REGION */
setPlans(PRICING_CONFIG[currency] || []);

        const subRes = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/subscription/current`,
  { credentials: "include" }
);

if (subRes.status === 401) {
  setCurrentSubscription(null);   // 🔥 RESET
} else {
  const subData = await subRes.json();
  setCurrentSubscription(subData);
}

        const entRes = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/enterprise/current`,
  { credentials: "include" }
);

if (entRes.status === 401) {
  setEnterprise(null);   // 🔥 RESET
} else if (entRes.status === 200) {
  const entData = await entRes.json();
  setEnterprise(entData);
}

      } catch {
        setPlanError("");
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchData();
  },  [currency]);


  

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
    };
    return symbols[currency] || "";
  };

  

const heroInsights = [
  {
    title: "Access global datasets across industries",
    desc: "Unlock high-quality, structured data from healthcare, finance, e-commerce, and research ecosystems all in one unified platform designed for scale."
  },
  {
    title: "Power AI, analytics, and intelligent systems",
    desc: "Fuel machine learning models and advanced analytics with reliable, real-world datasets that accelerate innovation and improve decision accuracy."
  },
  {
    title: "Make faster, data-driven business decisions",
    desc: "Transform complex data into actionable insights and gain a competitive edge with instant access to global information."
  },
  {
    title: "Eliminate data sourcing and integration overhead",
    desc: "Skip fragmented pipelines and manual collection Capture.Expert delivers ready-to-use datasets so your teams can focus on building, not gathering."
  },
  {
    title: "Scale seamlessly with continuously updated data",
    desc: "Stay ahead of market changes with dynamic datasets that evolve in real time, ensuring your strategies remain relevant and future-ready."
  },
  {
    title: "Enterprise-grade security and compliance",
    desc: "Built with zero-trust architecture, encryption, and compliance ready frameworks to ensure your data remains protected at every stage."
  },
  {
    title: "Seamless API integration for modern workflows",
    desc: "Integrate datasets directly into your applications, dashboards, and pipelines using robust APIs designed for performance and flexibility."
  },
  {
    title: "Accelerate research, innovation, and product development",
    desc: "Empower teams with immediate access to structured data that reduces time-to-market and drives breakthrough innovations."
  }
];
  return (
    <>
      <Helmet>
  <title>
    Capture.Expert | AI Datasets & Data Processing Platform
  </title>

  <meta
    name="description"
    content="Capture.Expert provides AI-ready datasets, analytics, automation, and enterprise data solutions."
  />

  <meta
    name="keywords"
    content="AI datasets, data analytics, AI automation, machine learning datasets"
  />
</Helmet>
      <Header />

      <div className="landing-container">

        {/* ================= HERO ================= */}
        <section className="hero">
          <video className="globe-video" autoPlay muted loop playsInline>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-text">
              <h1>Capture, Process & Access Data Across Industries</h1>
              {/* 1. MAIN PARAGRAPH */}
<p>
A unified platform to discover, access, and download high-quality datasets across industries.
</p>

{/* 2. MAIN BUTTONS */}
<div className="hero-buttons">
  <button
    className="btn-primary large"
    onClick={() => navigate("/signup")}
  >
    Signup
  </button>

  <button
    className="btn-outline large"
    onClick={() => navigate("/login")}
  >
    Login
  </button>
</div>

{/* 3. ROTATING INSIGHTS */}
<div key={heroIndex} className="hero-insight-block">
  <h3 className="hero-insight-title">
    {heroInsights[heroIndex].title}
  </h3>

  <p className="hero-insight-desc">
    {heroInsights[heroIndex].desc}
  </p>
</div>

{/* 4. BLINKING LINKS */}
<div className="hero-links">
  {/*<span onClick={() => navigate("/#pricing")}>Pricing</span>*/}
  <span onClick={() => navigate("/about")}>About</span>
  {/*<span onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
  Contact
</span>*/}
</div>

            </div> {/* hero-text */}
          </div> {/* hero-content */}
        </section> {/* hero */}


        {/* ================= WORKFLOW ================= */}
<section className="workflow">
  <h2>From Capture to Insights - Made Simple</h2>

  <p className="workflow-sub">
    A seamless data pipeline that lets you capture, process, and access
    global datasets without complexity.
  </p>

  <div className="workflow-steps">

    {/* STEP 1 */}

    <div className="workflow-card">
      <div className="workflow-icon">📝</div>

      <h3>Sign Up & Raise Request</h3>

      <p>
        Create your account and submit capture requests based on your
        exact dataset requirements across industries and domains.
      </p>
    </div>

    {/* STEP 2 */}

    <div className="workflow-card">
      <div className="workflow-icon">💳</div>

      <h3>Secure Payment & Processing</h3>

      <p>
        Our platform processes your request securely while validating,
        organizing, and preparing the required datasets for delivery.
      </p>
    </div>

    {/* STEP 3 */}

    <div className="workflow-card">
      <div className="workflow-icon">🚀</div>

      <h3>Access, AI Automation & Integration</h3>

      <p>
        Access high-quality datasets and get support for AI automation,
        business integrations, intelligent workflows, APIs, analytics,
        and scalable AI-powered solutions tailored to your business.
      </p>
    </div>

  </div>

  {/* CTA BUTTON */}

  <button
    className="workflow-cta"
    onClick={() => navigate("/signup")}
  >
    Sign Up
  </button>

</section>

      
{/* ================= PRICING =================

<section id="pricing" className="pricing-section">
  <h2>Subscription Plans</h2>

  <div className="region-selector">
    <label>Select Region:</label>

    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
    >
      <option value="INR">₹ INR</option>
      <option value="USD">$ USD</option>
      <option value="EUR">€ EUR</option>
    </select>
  </div>

  {loadingPlans && <p className="pricing-loading">Loading plans...</p>}
  {planError && <p className="pricing-error">{planError}</p>}

  <div className="pricing-grid">
    {plans.map((plan) => {

      const hasEnterprise = enterprise && enterprise.is_active;

      const isCurrentSubscription =
        !hasEnterprise &&
        currentSubscription &&
        currentSubscription.subscription_id === plan.id;

      const isEnterprisePlan = plan.isEnterprise;

      return (
        <div
          key={plan.id}
          className={`pricing-card
            ${isCurrentSubscription ? "current-plan" : ""}
            ${plan.isEnterprise ? "enterprise" : ""}
            ${plan.id === "growth" ? "popular" : ""}
          `}
        >

          <div className="plan-icon">
            {plan.id === "starter" && "🚀"}
            {plan.id === "growth" && "⭐"}
            {plan.id === "scale" && "👑"}
            {plan.id === "enterprise" && "🏢"}
          </div>

          <h3 className="plan-title">{plan.name}</h3>

          <p className="plan-category">
            Dataset Category: <span>{plan.dataset_category}</span>
          </p>

          <p className="data-label">Total Data Limit:</p>

          <div className="data-box">
            <div className="data-icon">💾</div>

            <div>
              <div className="data-value">
                {plan.total_limit_mb === "Unlimited"
                  ? "Unlimited"
                  : `${plan.total_limit_mb} MB`}
              </div>

              <div className="data-sub">
                {plan.total_limit_mb === "Unlimited"
                  ? "All Access"
                  : `${(Number(plan.total_limit_mb) / 1024).toFixed(1)} GB`}
              </div>
            </div>
          </div>

          <ul className="feature-list">
            <li>✔ API Access</li>
            <li>✔ Secure Data</li>
            <li>✔ Real-time Updates</li>
            <li>✔ Multi-industry datasets</li>
          </ul>

          <p className="price">
            {isEnterprisePlan ? (
              "Custom Pricing"
            ) : (
              <>
                {getCurrencySymbol(plan.currency)}
                {plan.price}
                <span style={{ marginLeft: "6px" }}>/month</span>
              </>
            )}
          </p>

          {isCurrentSubscription ? (
            <div className="current-badge">Current Plan</div>
          ) : (
            <button
              className="pricing-btn"
              onClick={() => {
                if (isEnterprisePlan) {
                  alert(
                    "Contact Capture Expert Care.\ncustom@capture_expert.com"
                  );
                  return;
                }

                navigate(`/signup`);
              }}
            >
              {isEnterprisePlan
                ? "Contact Sales"
                : "Get Started"}
            </button>
          )}
        </div>
      );
    })}
  </div>
</section>

*/}


{/* ===== ABOUT PREVIEW SECTION ===== */}
<div className="about-preview-section">

  {/* LEFT IMAGE */}
  <div className="about-preview-image">
    <img src={processImg} alt="Data Processing" />
  </div>

  {/* RIGHT CONTENT */}
  <div className="about-preview-content">
    <h2>Transforming Data into Intelligence</h2>

    <p>
      Capture.Expert enables organizations to collect, process, and analyze
      high-quality datasets across industries. Our platform simplifies data
      workflows, making it easier to build AI models, generate insights,
      and drive smarter decisions.
    </p>

    <p>
      From real-time data collection to advanced analytics, we provide a
      complete ecosystem for modern data-driven businesses.
    </p>

    <button
      className="about-preview-btn"
      onClick={() => navigate("/about")}
    >
      Learn More About Us
    </button>
  </div>

</div>
        {/* ================= FAQ ================= */}

<section className="faq">

  <h2>Frequently Asked Questions</h2>

  <div className="faq-container">

    {[
      {
        q: "What does Capture.Expert provide?",
        a: "Capture.Expert provides custom datasets, AI-ready data solutions, and data services for businesses across multiple industries."
      },

      {
        q: "Can I request custom datasets?",
        a: "Yes. You can raise a capture request based on your business requirements and receive customized datasets after approval and payment."
      },

      {
        q: "Can the datasets be used for AI and automation?",
        a: "Yes. The datasets can be used for AI models, analytics, automation workflows, research, and business intelligence solutions."
      },

      {
        q: "What industries do you support?",
        a: "We support healthcare, finance, e-commerce, logistics, AI, retail, research, and multiple enterprise sectors."
      },

      {
        q: "Is the data secure?",
        a: "Yes. We use enterprise-grade security, encryption, secure infrastructure, and controlled access mechanisms."
      },

      {
        q: "Can you build custom AI solutions for businesses?",
        a: "Yes. We develop customized AI-powered applications, automation systems, analytics platforms, and enterprise integrations according to business requirements."
      },

      {
        q: "How do I receive the datasets?",
        a: "After request approval and payment confirmation, datasets are securely delivered based on the requested format and requirement."
      },

      {
        q: "How does the capture request process work?",
        a: "Users submit their requirements, our team reviews the request, shares pricing and delivery details, and then provides the required datasets or solutions."
      },

      {
        q: "Can datasets be customized?",
        a: "Yes. Datasets can be customized, cleaned, enhanced, structured, and prepared according to your business needs."
      },

      {
        q: "Do you provide enterprise support?",
        a: "Yes. Enterprise customers receive dedicated assistance, custom workflows, scalable solutions, and priority business support."
      }

    ].map((item, index) => (

      <div
        key={index}
        className={`faq-item ${
          activeFAQ === index ? "active" : ""
        }`}
      >

        <div
          className="faq-question"
          onClick={() =>
            setActiveFAQ(
              activeFAQ === index
                ? null
                : index
            )
          }
        >

          <span>{item.q}</span>

          <span className="faq-icon">
            {activeFAQ === index ? "−" : "+"}
          </span>

        </div>

        <div className="faq-answer">
          <p>{item.a}</p>
        </div>

      </div>

    ))}

  </div>

</section>
        

      </div>

      <Footer />
    </>
  );
};

export default LandingPage;