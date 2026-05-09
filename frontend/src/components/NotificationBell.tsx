import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  /* ================= LOAD ================= */

  const load = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
    }
  };

  /* ================= MARK AS READ ================= */

  const markAsRead = async (id: number) => {
    try {
      await API.post(`/notifications/read/${id}`);

      // update UI instantly
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );

    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  /* ================= CLICK HANDLER ================= */

  const handleClick = async (n: any) => {

    try {
      if (!n.read) {
        await markAsRead(n.id);
      }

      // navigate based on type
      if (n.ticket_id) {
        navigate("/support");
      }

    } catch (err) {
      console.error("Notification click failed", err);
    }
  };

  /* ================= UNREAD COUNT ================= */

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: "relative" }}>

      {/* ================= Bell ================= */}

      <div
        style={{ cursor: "pointer", fontSize: "22px" }}
        onClick={() => setOpen(prev => !prev)}
      >
        🔔

        {unread > 0 && (
          <span
            style={{
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "3px 7px",
              fontSize: "12px",
              marginLeft: "5px"
            }}
          >
            {unread}
          </span>
        )}
      </div>

      {/* ================= Dropdown ================= */}

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            width: "320px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            padding: "10px",
            zIndex: 100
          }}
        >

          <h4>Notifications</h4>

          {notifications.length === 0 && (
            <p>No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px 0",
                cursor: "pointer",
                opacity: n.read ? 0.5 : 1,
                background: n.read ? "#f9f9f9" : "white"
              }}
            >
              {n.title && <b>{n.title}</b>}
              <p style={{ margin: 0 }}>{n.message}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}