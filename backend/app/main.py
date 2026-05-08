#user\backend\app\main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.database import Base, engine
from app.core.config import AUTH_MODE, SECRET_KEY
from starlette.middleware.sessions import SessionMiddleware


# -------------------------
# IMPORT MODELS (IMPORTANT)
# -------------------------
# Ensure all models are imported so metadata is registered

from app.models.company_user import CompanyUser
from app.models.personal_user import PersonalUser
from app.models.payment import Payment
from app.models.invoice import Invoice
from app.models.subscription_plan import SubscriptionPlan
from app.models.subscription_price import SubscriptionPrice
from app.models.user_subscription import UserSubscription
from app.models.subscription_addon import SubscriptionAddon
from app.models.user_usage_tracking import UserUsageTracking
from app.models.enterprise_contract import EnterpriseContract
from app.models.support_ticket import SupportTicket
from app.models.support_message import SupportMessage
from app.models.support_category import SupportCategory
from app.models.support_priority import SupportPriority
from app.models.notification import Notification
from app.models.public_support_request import PublicSupportRequest
from app.routes import dataset_routes
from app.models.admin_audit_logs import AdminAuditLogs
from app.models.addon_purchases import AddonPurchase
from app.models.user_audit_logs import UserAuditLogs
from app.routes import capture_request_routes
from app.routes import capture_payment_routes
from app.routes import capture_invoice_routes
from app.routes import capture_payment_Details_routes
from app.routes import capture_invoice_Details_routes


# -------------------------
# ROUTES
# -------------------------

from app.routes import (
    company_routes,
    personal_routes,
    auth_routes,
    user_routes,
    user_profile,
    company_profile,
    subscription_routes,
    usage_routes,
    addon_routes,
    support_routes,
    notification_routes,
    public_support_routes
)

# -------------------------
# APP INIT
# -------------------------

app = FastAPI()

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
		"https://app.yourdomain.com",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

# -------------------------
# AUTH MODE
# -------------------------

if AUTH_MODE == "session":
    app.add_middleware(
        SessionMiddleware,
        secret_key=SECRET_KEY  # 🔥 use env secret
    )
    print("🔓 Running in SESSION mode")

elif AUTH_MODE == "jwt":
    print("🔐 Running in JWT mode")

else:
    raise ValueError("Invalid AUTH_MODE in .env (use 'session' or 'jwt')")

# -------------------------
# STARTUP EVENT (BETTER THAN DIRECT CALL)
# -------------------------

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ensured")

# -------------------------
# ROUTERS
# -------------------------

app.include_router(company_routes.router)
app.include_router(personal_routes.router)
app.include_router(auth_routes.router)
app.include_router(user_routes.router)

app.include_router(user_profile.router)
app.include_router(company_profile.router)

app.include_router(subscription_routes.router)
app.include_router(dataset_routes.router)


app.include_router(capture_request_routes.router)
app.include_router(addon_routes.router)

# -------------------------
# SUPPORT ROUTES
# -------------------------

app.include_router(support_routes.router)
app.include_router(notification_routes.router)
app.include_router(public_support_routes.router)
app.include_router(capture_payment_routes.router)
app.include_router(capture_invoice_routes.router)
app.include_router(capture_payment_Details_routes.router)
app.include_router(capture_invoice_Details_routes.router)
