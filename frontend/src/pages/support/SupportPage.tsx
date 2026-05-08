import { useEffect, useState } from "react";
import {
  createTicket,
  getMyTickets,
  getMessages,
  replyTicket,
} from "../../services/supportService";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./SupportPage.css";

export default function SupportPage() {

  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Support");
  const [message, setMessage] = useState("");
  

  const [reply, setReply] = useState("");
  

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  // ---------------------------
  // LOAD TICKETS
  // ---------------------------
  const loadTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data || []);
    } catch {
      alert("Failed to load tickets");
    }
  };

  // ---------------------------
  // OPEN TICKET
  // ---------------------------
  const openTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    try {
      const msgs = await getMessages(ticket.ticket_id);
      setMessages(msgs || []);
    } catch {
      alert("Failed to load messages");
    }
  };

  // ================= CREATE =================
  const handleCreate = async () => {

    if (!subject || !message) {
      alert("Subject and message required");
      return;
    }

    setLoading(true);

    try {
      const res = await createTicket({
        subject,
        category,
        message,
      });

      if (res.ticket_id) {
        alert("✅ Ticket created successfully");

        setSubject("");
        setMessage("");

        loadTickets();
      }

    } catch {
      alert("Server error");
    }

    setLoading(false);
  };

  // ================= REPLY =================
  const sendReply = async () => {

    if (!reply || !selectedTicket) return;

    if (selectedTicket.status === "closed") {
      alert("Ticket already closed");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("ticket_id", selectedTicket.ticket_id);
    formData.append("message", reply);


    try {
      await replyTicket(formData);

      setReply("");


      // 🔥 Refresh messages
      openTicket(selectedTicket);

    } catch {
      alert("Reply failed");
    }

    setLoading(false);
  };

  return (
    <>
      <DashboardHeader />

      <div className="support-page">

        {/* ================= SIDEBAR ================= */}
        <div className="ticket-sidebar">

          <h3>My Tickets</h3>

          {tickets.length === 0 && (
            <p className="empty">No tickets yet</p>
          )}

          {tickets.map((t) => (
            <div
              key={t.ticket_id}
              className="ticket-item"
              onClick={() => openTicket(t)}
            >
              <p className="ticket-id">#{t.ticket_id}</p>
              <p className="ticket-subject">{t.subject}</p>

              <span className={`ticket-status ${t.status}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="ticket-content">

          {/* CREATE */}
          {!selectedTicket && (
            <div className="ticket-create">

              <h3>Create Support Ticket</h3>

              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Billing</option>
                <option>Dataset Issue</option>
                <option>Download Issue</option>
                <option>Account Issue</option>
                <option>Technical Support</option>
                <option>Capture Request</option>
              </select>

              <textarea
                placeholder="Describe your issue"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button onClick={handleCreate} disabled={loading}>
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>

            </div>
          )}

          {/* CHAT */}
          {selectedTicket && (
            <div className="ticket-chat">

              <div className="chat-header">
                <h3>{selectedTicket.subject}</h3>

                <span className={`ticket-status ${selectedTicket.status}`}>
                  {selectedTicket.status}
                </span>
              </div>

              <div className="chat-messages">

                {messages.length === 0 && (
                  <p className="empty">No messages yet</p>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-message ${m.sender_type}`}
                  >
                    <p>{m.message}</p>

                    
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "closed" && (
                <div className="chat-reply">

                  <textarea
                    placeholder="Write your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />

                  <button onClick={sendReply} disabled={loading}>
                    {loading ? "Sending..." : "Send Reply"}
                  </button>

                </div>
              )}

              {selectedTicket.status === "closed" && (
                <p className="ticket-closed">
                  Ticket closed — replies disabled
                </p>
              )}

              <button
                className="back-btn"
                onClick={() => setSelectedTicket(null)}
              >
                ← Back
              </button>

            </div>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}