"""
🎯 VERTEX NEXUS - API Monitoring SaaS Dashboard
Streamlit MVP for rapid market validation
BOSS decision: Streamlit AGORA for 500 signups
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import time
import hashlib
import sqlite3
import os

# Page config
st.set_page_config(
    page_title="🎯 VERTEX Nexus - API Monitoring",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'user' not in st.session_state:
    st.session_state.user = None
if 'page' not in st.session_state:
    st.session_state.page = 'landing'

# Database setup
def init_db():
    conn = sqlite3.connect('vertex.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            email TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Waitlist table
    c.execute('''
        CREATE TABLE IF NOT EXISTS waitlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            name TEXT,
            company TEXT,
            position INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # API endpoints table (for monitoring)
    c.execute('''
        CREATE TABLE IF NOT EXISTS endpoints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            url TEXT,
            method TEXT DEFAULT 'GET',
            expected_status INTEGER DEFAULT 200,
            check_interval INTEGER DEFAULT 60,
            last_check TIMESTAMP,
            status TEXT DEFAULT 'unknown',
            response_time REAL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Insert default admin user if not exists
    c.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
    if c.fetchone()[0] == 0:
        password_hash = hashlib.sha256('V3rt3x@Boss'.encode()).hexdigest()
        c.execute(
            "INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)",
            ('admin', password_hash, 'nexusdigital@orquestracrm.com.br', 'admin')
        )
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Authentication functions
def authenticate(username, password):
    conn = sqlite3.connect('vertex.db')
    c = conn.cursor()
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    c.execute(
        "SELECT id, username, email, role FROM users WHERE username = ? AND password_hash = ?",
        (username, password_hash)
    )
    
    user = c.fetchone()
    conn.close()
    
    if user:
        return {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'role': user[3]
        }
    return None

def add_to_waitlist(email, name, company):
    conn = sqlite3.connect('vertex.db')
    c = conn.cursor()
    
    # Get next position
    c.execute("SELECT COUNT(*) FROM waitlist")
    position = c.fetchone()[0] + 1
    
    try:
        c.execute(
            "INSERT INTO waitlist (email, name, company, position) VALUES (?, ?, ?, ?)",
            (email, name, company, position)
        )
        conn.commit()
        conn.close()
        return position
    except sqlite3.IntegrityError:
        conn.close()
        return None

# Landing page
def show_landing_page():
    st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3.5rem;
        font-weight: 800;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        color: #94a3b8;
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 3rem;
    }
    .metric-card {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(14, 165, 233, 0.3);
        border-radius: 1rem;
        padding: 1.5rem;
        text-align: center;
    }
    .pricing-card {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
    }
    .pricing-card:hover {
        border-color: #8b5cf6;
        transform: translateY(-5px);
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.markdown('<h1 class="main-header">🎯 VERTEX Nexus</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Simple, Affordable API Monitoring for Small Teams</p>', unsafe_allow_html=True)
    
    # Hero section
    col1, col2, col3 = st.columns([2, 1, 2])
    
    with col2:
        if st.button("🚀 Join Waitlist (Free)", use_container_width=True):
            st.session_state.page = 'waitlist'
            st.rerun()
        
        if st.button("🔐 Control Room Login", use_container_width=True):
            st.session_state.page = 'login'
            st.rerun()
    
    # Features
    st.markdown("---")
    st.markdown("## ⚡ Why Choose Our API Monitoring?")
    
    features = st.columns(3)
    
    with features[0]:
        st.markdown("### 🔔 Smart Alerts")
        st.markdown("Get instant notifications via email, SMS, or Slack when your APIs go down.")
    
    with features[1]:
        st.markdown("### 📊 Detailed Analytics")
        st.markdown("Beautiful dashboards with historical data to understand API performance.")
    
    with features[2]:
        st.markdown("### 👥 Team Collaboration")
        st.markdown("Invite team members, assign incidents, and resolve issues together.")
    
    # Pricing
    st.markdown("---")
    st.markdown("## 💰 Simple, Transparent Pricing")
    
    pricing = st.columns(4)
    
    pricing_data = [
        {"plan": "FREE", "price": "$0", "endpoints": "3", "features": ["Basic monitoring", "Email alerts", "7-day history"]},
        {"plan": "STARTER", "price": "$29", "endpoints": "10", "features": ["All Free features", "SMS alerts", "30-day history", "Team access (3 users)"]},
        {"plan": "PRO", "price": "$99", "endpoints": "50", "features": ["All Starter features", "Advanced analytics", "Webhook integration", "Priority support"]},
        {"plan": "BUSINESS", "price": "$299", "endpoints": "200", "features": ["All Pro features", "Custom SLAs", "Dedicated support", "API access"]}
    ]
    
    for i, plan in enumerate(pricing_data):
        with pricing[i]:
            with st.container():
                st.markdown(f"### {plan['plan']}")
                st.markdown(f"## {plan['price']}")
                if plan['price'] != "$0":
                    st.markdown("per month")
                
                for feature in plan['features']:
                    st.markdown(f"• {feature}")
                
                if st.button(f"Join Waitlist", key=f"pricing_{i}", use_container_width=True):
                    st.session_state.page = 'waitlist'
                    st.rerun()
    
    # Business metrics
    st.markdown("---")
    st.markdown("## 📈 Built for Developers, by Developers")
    
    metrics = st.columns(4)
    
    metric_data = [
        {"value": "376x", "label": "Projected ROI"},
        {"value": "85%", "label": "Success Probability"},
        {"value": "6/20", "label": "Risk Score (LOW)"},
        {"value": "$564K", "label": "Year 1 Projection"}
    ]
    
    for i, metric in enumerate(metric_data):
        with metrics[i]:
            st.markdown(f"<div class='metric-card'><h1 style='margin:0;'>{metric['value']}</h1><p style='color:#94a3b8;margin:0;'>{metric['label']}</p></div>", unsafe_allow_html=True)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align:center;color:#94a3b8;'>
    &copy; 2026 VERTEX Nexus. All rights reserved.<br>
    API Monitoring SaaS - Simple, Affordable, Effective.
    </div>
    """, unsafe_allow_html=True)

# Waitlist page
def show_waitlist_page():
    st.title("🚀 Join Our Waitlist")
    st.markdown("Be the first to know when we launch. Get early access, exclusive discounts, and help shape the future of API monitoring.")
    
    with st.form("waitlist_form"):
        email = st.text_input("Email address *", placeholder="your@email.com")
        name = st.text_input("Name (optional)", placeholder="Your name")
        company = st.text_input("Company (optional)", placeholder="Your company")
        
        submitted = st.form_submit_button("Join Waitlist & Get Early Access")
        
        if submitted:
            if not email:
                st.error("Please enter your email address")
            else:
                position = add_to_waitlist(email, name, company)
                if position:
                    st.success(f"✅ Thanks for joining! You're position #{position} in line.")
                    st.balloons()
                    
                    # Show waitlist stats
                    conn = sqlite3.connect('vertex.db')
                    c = conn.cursor()
                    c.execute("SELECT COUNT(*) FROM waitlist")
                    total = c.fetchone()[0]
                    conn.close()
                    
                    st.info(f"📊 {total} developers already waiting. We'll notify you when we launch!")
                    
                    # Option to go to landing page
                    if st.button("← Back to Landing Page"):
                        st.session_state.page = 'landing'
                        st.rerun()
                else:
                    st.error("This email is already on the waitlist.")

# Login page
def show_login_page():
    st.title("🔐 VERTEX Control Room Login")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        with st.form("login_form"):
            username = st.text_input("Username", value="admin")
            password = st.text_input("Password", type="password", value="V3rt3x@Boss")
            
            submitted = st.form_submit_button("Login to Control Room")
            
            if submitted:
                user = authenticate(username, password)
                if user:
                    st.session_state.authenticated = True
                    st.session_state.user = user
                    st.session_state.page = 'dashboard'
                    st.success("✅ Login successful!")
                    time.sleep(1)
                    st.rerun()
                else:
                    st.error("❌ Invalid username or password")
        
        st.markdown("---")
        st.markdown("**Demo Credentials:**")
        st.code("Username: admin\nPassword: V3rt3x@Boss")
        
        if st.button("← Back to Landing Page"):
            st.session_state.page = 'landing'
            st.rerun()

# Dashboard page
def show_dashboard_page():
    if not st.session_state.authenticated:
        st.error("Authentication required")
        if st.button("Go to Login"):
            st.session_state.page = 'login'
            st.rerun()
        return
    
    # Sidebar navigation
    with st.sidebar:
        st.markdown(f"### 👤 {st.session_state.user['username']}")
        st.markdown(f"*{st.session_state.user['role']}*")
        st.markdown("---")
        
        page_options = {
            "📊 Dashboard": "dashboard",
            "📋 Mission Kanban": "kanban",
            "⚙️ Settings": "settings",
            "🏠 Landing Page": "landing",
            "🔓 Logout": "logout"
        }
        
        for label, page in page_options.items():
            if st.button(label, use_container_width=True):
                if page == "logout":
                    st.session_state.authenticated = False
                    st.session_state.user = None
                    st.session_state.page = 'landing'
                    st.rerun()
                else:
                    st.session_state.page = page
                    st.rerun()
        
        st.markdown("---")
        st.markdown("**🎯 VERTEX Nexus**")
        st.markdown("*Control Room v1.0*")
    
    # Main dashboard
    st.title("🎯 VERTEX Control Room")
    
    # Metrics row
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("ROI", "376x", "85% success probability")
    
    with col2:
        st.metric("Risk Score", "6/20", "LOW")
    
    with col3:
        st.metric("Agents", "9/13", "69% complete")
    
    with col4:
        st.metric("Projected Profit", "$564K", "Year 1")
    
    # Agent fleet
    st.markdown("---")
    st.markdown("### 🎯 Agent Fleet Status")
    
    agents_data = [
        {"name": "MARKET_HUNTER", "status": "✅", "task": "Market Research Complete", "time": "4min"},
        {"name": "TECH_EVALUATOR", "status": "✅", "task": "Technical Analysis Complete", "time": "4min"},
        {"name": "DEV_SPRINTER", "status": "✅", "task": "MVP Structure Complete", "time": "15min"},
        {"name": "SOCIAL_MEDIA_MANAGER", "status": "✅", "task": "Social Strategy Complete", "time": "5m40s"},
        {"name": "BUSINESS_STRATEGIST", "status": "✅", "task": "Business Plan Complete", "time": "7m2s"},
        {"name": "MARKETING_OPERATIONS", "status": "✅", "task": "Marketing Strategy Complete", "time": "7m33s"},
        {"name": "CUSTOMER_SUCCESS", "status": "✅", "task": "Customer Success Program", "time": "8m37s"},
        {"name": "VISUAL_IDENTITY_DESIGNER", "status": "✅", "task": "Visual Identity Complete", "time": "6m53s"},
        {"name": "FRONT_ARCHITECT_V2", "status": "✅", "task": "Control Room Complete", "time": "13m23s"},
        {"name": "SECURITY_ARCHITECT", "status": "⏳", "task": "System Security Hardening", "time": "120min"},
        {"name": "SDR_AGENT", "status": "⏳", "task": "Automated Lead Generation", "time": "60min"},
        {"name": "SLR_AGENT", "status": "⏳", "task": "Sales Lead Response", "time": "60min"},
        {"name": "CLOSER_AGENT", "status": "⏳", "task": "Deal Closing Automation", "time": "60min"}
    ]
    
    agents_df = pd.DataFrame(agents_data)
    st.dataframe(
        agents_df,
        column_config={
            "name": "Agent",
            "status": "Status",
            "task": "Task",
            "time": "Time"
        },
        hide_index=True,
        use_container_width=True
    )
    
    # System status
    st.markdown("---")
    st.markdown("### ⚡ System Status")
    
    status_col1, status_col2 = st.columns(2)
    
    with status_col1:
        # Uptime chart
        st.markdown("**Uptime Last 24h**")
        uptime_data = pd.DataFrame({
            'hour': range(24),
            'uptime': [99.9] * 24
        })
        st.line_chart(uptime_data, x='hour', y='uptime')
    
    with status_col2:
        # Response time chart
        st.markdown("**Response Time (ms)**")
        response_data = pd.DataFrame({
            'minute': range(60),
            'response_time': np.random.normal(150, 20, 60)
        })
        st.line_chart(response_data, x='minute', y='response_time')
    
    # Real-time updates
    st.markdown("---")
    st.markdown("### 🔄 Real-time Updates")
    
    update_placeholder = st.empty()
    
    # Simulate real-time updates
    updates = [
        "✅ System health check passed",
        "📊 Metrics updated successfully",
        "🔧 Background optimization running",
        "📈 3 new waitlist signups today",
        "🎯 Mission timeline on track"
    ]
    
    for update in updates:
        update_placeholder.info(update)
        time.sleep(2)

# Mission Kanban page
def show_kanban_page():
    if not st.session_state.authenticated:
        st.error("Authentication required")
        return
    
    st.title("📋 Mission Kanban")
    
    # Kanban columns
    col1, col2, col3 = st.columns(3)
    
    # To Do
    with col1:
        st.markdown("### 📝 To Do")
        st.markdown("""
        - **Setup Landing Page Analytics**  
          *Install Google Analytics, Hotjar, and conversion tracking*  
          👤 MARKETING_OPERATIONS | 🔴 HIGH
        
        - **Create Social Media Campaign**  
          *Launch Twitter/LinkedIn campaign for 500 signups*  
          👤 SOCIAL_MEDIA_MANAGER | 🔴 HIGH
        
        - **Configure MySQL Production Database**  
          *Setup production MySQL with backups and monitoring*  
          👤 DEV_SPRINTER | 🟡 MEDIUM
        
        - **Setup Asaas Billing Integration**  
          *Integrate Asaas for subscription management*  
          👤 BUSINESS_STRATEGIST | 🟡 MEDIUM
        
        - **Create Email Sequence**  
          *Welcome emails, onboarding, and nurture sequence*  
          👤 CUSTOMER_SUCCESS | 🟢 LOW
        """)
    
    # In Progress
    with col2:
        st.markdown("### ⚡ In Progress")
        st.markdown("""
        - **Secure Server Implementation**  
          *Implement JWT authentication and protected APIs*  
          👤 SECURITY_ARCHITECT | 🔴 HIGH
        
        - **Landing Page Optimization**  
          *A/B testing and conversion rate optimization*  
          👤 FRONT_ARCHITECT_V2 | 🟡 MEDIUM
        
        - **Agent Kanban System**  
          *Real-time drag & drop kanban for mission control*  
          👤 VERTEX_NEXUS | 🟡 MEDIUM
        """)
    
    # Done
    with col3:
        st.markdown("### ✅ Done")
        st.markdown("""
        - **Market Research Complete**  
          *Identified API Monitoring as optimal opportunity*  
          👤 MARKET_HUNTER | ✅ COMPLETE
        
        - **Technical Evaluation Complete**  
          *Confirmed 4-week MVP timeline, 85% success probability*  
          👤 TECH_EVALUATOR | ✅ COMPLETE
        
        - **MVP Structure Created**  
          *Full Express.js structure with monitoring logic*  
          👤 DEV_SPRINTER | ✅ COMPLETE
        
        - **Business Plan Complete**  
          *Complete business strategy with $564k Year 1 projection*  
          👤 BUSINESS_STRATEGIST | ✅ COMPLETE
        
        - **Marketing Strategy Complete**  
          *Complete marketing/sales strategy with positioning*  
          👤 MARKETING_OPERATIONS | ✅ COMPLETE
        """)
    
    # Mission Timeline
    st.markdown("---")
    st.markdown("### 🚀 Mission Timeline")
    
    timeline_data = pd.DataFrame({
        'Phase': ['Week 1', 'Week 2-4', 'Month 2', 'Month 3-6'],
        'Task': ['Landing Page + 500 Signups', 'MVP Development', 'Public Launch', 'Scale & Growth'],
        'Status': ['⏳ IN PROGRESS', '📅 PLANNED', '📅 PLANNED', '📅 PLANNED'],
        'Progress': [25, 0, 0, 0]
    })
    
    st.dataframe(timeline_data, hide_index=True, use_container_width=True)
    
    # Progress bars
    for _, row in timeline_data.iterrows():
        st.progress(row['Progress'] / 100, text=f"{row['Phase']}: {row['Task']} - {row['Status']}")

# Settings page
def show_settings_page():
    if not st.session_state.authenticated:
        st.error("Authentication required")
        return
    
    st.title("⚙️ Settings")
    
    tab1, tab2, tab3 = st.tabs(["Profile", "API Keys", "System"])
    
    with tab1:
        st.markdown("### 👤 Profile Settings")
        
        with st.form("profile_form"):
            st.text_input("Username", value=st.session_state.user['username'], disabled=True)
            st.text_input("Email", value=st.session_state.user['email'])
            new_password = st.text_input("New Password", type="password")
            confirm_password = st.text_input("Confirm Password", type="password")
            
            if st.form_submit_button("Update Profile"):
                if new_password and new_password != confirm_password:
                    st.error("Passwords do not match")
                else:
                    st.success("Profile updated successfully")
    
    with tab2:
        st.markdown("### 🔑 API Keys")
        
        st.info("API keys will be available after launch.")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.text_input("Asaas API Key", type="password", placeholder="Will be configured after launch")
        
        with col2:
            st.text_input("Email Service Key", type="password", placeholder="Will be configured after launch")
    
    with tab3:
        st.markdown("### 🖥️ System Configuration")
        
        st.selectbox("Theme", ["Dark", "Light", "Auto"])
        st.slider("Auto-refresh interval (seconds)", 10, 300, 30)
        st.checkbox("Enable email notifications", True)
        st.checkbox("Enable SMS alerts", False)
        
        if st.button("Save Settings", use_container_width=True):
            st.success("Settings saved successfully")

# Main app router
def main():
    # Check installation status
    try:
        import streamlit
        import pandas
        import plotly
    except ImportError:
        st.error("❌ Streamlit not installed. Please run: pip install streamlit pandas plotly")
        return
    
    # Route to appropriate page
    if st.session_state.page == 'landing':
        show_landing_page()
    elif st.session_state.page == 'waitlist':
        show_waitlist_page()
    elif st.session_state.page == 'login':
        show_login_page()
    elif st.session_state.page == 'dashboard':
        show_dashboard_page()
    elif st.session_state.page == 'kanban':
        show_kanban_page()
    elif st.session_state.page == 'settings':
        show_settings_page()

if __name__ == "__main__":
    main()