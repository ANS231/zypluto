import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans } from "../../services/subscriptionService";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./SubscriptionPage.css";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const region = "INDIA";

  useEffect(() => {
    const fetchData = async () => {
      try {

        const plansRes = await getPlans(region);
        setPlans(plansRes.data);

        const subRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/subscription/current`,
          { credentials: "include" }
        );

        const subData = await subRes.json();
        setCurrentSubscription(subData);


      } catch {
        setError("Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <p className="subscription-loading">Loading plans...</p>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <p className="subscription-error">{error}</p>
        <Footer />
      </>
    );
  }


  const handleBuyClick = (planId: number) => {

    if (planId === 4) {
      alert(
        "Contact Capture Expert Care to know more.\ncustom@capture_expert.com"
      );
      return;
    }

    navigate(`/payment?type=subscription&plan_id=${planId}`);
  };

  return (
    <>
      <DashboardHeader />

      <div className="subscription-page">

        <h2 className="subscription-title">Subscription Plans</h2>

        <div className="plans-grid">

          {plans.map((plan) => {

            const isCurrentSubscription =
              currentSubscription &&
              currentSubscription.subscription_id === plan.id;

            return (

              <div
                key={plan.id}
                className={`plan-card ${
                  isCurrentSubscription ? "current-plan" : ""
                }`}
              >

                <h3 className="plan-name">{plan.name}</h3>

                <div className="plan-features">

                  <p>
                    <strong>Dataset:</strong> {plan.dataset_category}
                  </p>

                  <p>
                    <strong>Download Limit:</strong> {plan.download_limit_mb} MB
                  </p>

                  <p>
                    <strong>API Limit:</strong> {plan.api_limit}
                  </p>

                  <p className="plan-price">
                    {plan.price} {plan.currency}
                  </p>

                </div>

                {isCurrentSubscription ? (

                  <div className="current-badge">
                    Current Plan
                  </div>

                ) : (

                  <button
                    className="buy-btn"
                    onClick={() => handleBuyClick(plan.id)}
                  >
                    Buy / Upgrade
                  </button>

                )}

              </div>

            );
          })}

        </div>

      </div>

      <Footer />
    </>
  );
}