import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddonSettings } from "../../services/subscriptionService";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./AddonPage.css";

export default function AddonPage() {

  const navigate = useNavigate();

  const [addon, setAddon] = useState<any>(null);
  const [gb, setGb] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pricePerGB, setPricePerGB] = useState<number>(0);

  useEffect(() => {
    fetchAddon();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [gb, addon]);

  const fetchAddon = async () => {
    try {

      const res = await getAddonSettings("INDIA");

      console.log("ADDON API:", res.data); // 🔥 DEBUG

      const downloadAddon = res.data.find(
        (a: any) => a.addon_type === "download"
      );

      if (!downloadAddon) {
        alert("Download addon not configured");
        return;
      }

      setAddon(downloadAddon);

      const baseMB = downloadAddon.value;
      const basePrice = downloadAddon.price;

      const perGB = Math.ceil(1000 / baseMB) * basePrice;

      setPricePerGB(perGB);

    } catch (err) {
      console.error(err);
      alert("Failed to load addon settings");
    }
  };

  const calculatePrice = () => {

    if (!addon || gb <= 0) {
      setTotalPrice(0);
      return;
    }

    const baseMB = addon.value;
    const basePrice = addon.price;

    if (!baseMB || !basePrice) {
      setTotalPrice(0);
      return;
    }

    const totalMB = gb * 1000;

    const units = Math.ceil(totalMB / baseMB);

    const price = units * basePrice;

    setTotalPrice(price);
  };

  const handlePayment = () => {

    if (!totalPrice) {
      alert("Invalid amount");
      return;
    }

    navigate(`/payment?type=addon&addon_type=download&gb=${gb}`);
  };

  return (
    <>
      <DashboardHeader />

      <div className="addon-page">

        <h2 className="addon-title">Buy Data Addon</h2>

        <p className="addon-subtitle">
          Price: {pricePerGB} {addon?.currency} per GB
        </p>

        <div className="addon-input-wrapper">
          <input
            type="number"
            min="1"
            value={gb}
            onChange={(e) => setGb(Number(e.target.value) || 0)}
            className="addon-input"
          />
          <span className="addon-unit">GB</span>
        </div>

        <h3 className="addon-total-price">
          Total Price: {totalPrice} {addon?.currency}
        </h3>

        <button
          className="addon-btn addon-center-btn"
          onClick={handlePayment}
          disabled={!totalPrice}
        >
          Proceed to Payment
        </button>

      </div>

      <Footer />
    </>
  );
}