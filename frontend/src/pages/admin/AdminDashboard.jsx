import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import usePagination from '../../hooks/usePagination';
import { contactAPI, usersAPI, servicesAPI, expertsAPI, ordersAPI, visitorsAPI } from '../../utils/api';

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContacts: 0,
    totalServices: 0,
    totalExperts: 0,
    pendingInquiries: 0,
    totalPaid: 0,
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paid Orders state
  const [orders, setOrders]           = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage]   = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const ORDERS_LIMIT = 10;

  // Visitor stats state
  const [visitorStats, setVisitorStats]   = useState([]);
  const [visitorSummary, setVisitorSummary] = useState({ total: 0, today: 0, peak: 0 });
  const [visitorLoading, setVisitorLoading] = useState(false);

  // usePagination custom hook for inquiries (contacts)
  const inquiriesPagination = usePagination(contactAPI.getAll, {
    initialLimit: 10
  });

  // usePagination custom hook for users
  const usersPagination = usePagination(usersAPI.getAll, {
    initialLimit: 10
  });

  // Service modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    num: '',
    title: '',
    description: '',
    tags: '',
    expert: '',
    isActive: true,
  });

  // Expert modal states
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [expertForm, setExpertForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    accessCode: '',
  });

  // User modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchVisitorStats();
  }, []);

  // Fetch paid orders whenever the payments tab is opened or page changes
  useEffect(() => {
    if (activeTab === 'payments') fetchOrders();
  }, [activeTab, ordersPage]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersAPI.getAll({ page: ordersPage, limit: ORDERS_LIMIT });
      if (data.success) {
        setOrders(data.data);
        setOrdersTotal(data.pagination?.total || 0);
        setStats(prev => ({ ...prev, totalPaid: data.pagination?.total || 0 }));
      }
    } catch (err) {
      console.error('Orders fetch error:', err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchVisitorStats = async () => {
    setVisitorLoading(true);
    try {
      const data = await visitorsAPI.getStats();
      if (data.success) {
        setVisitorStats(data.stats || []);
        setVisitorSummary(data.summary || { total: 0, today: 0, peak: 0 });
      }
    } catch { /* silent */ }
    setVisitorLoading(false);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [contactData, servicesData, usersData, expertsData] = await Promise.all([
        contactAPI.getAll({ limit: 100 }), // Get enough entries to compute stats/recent
        servicesAPI.getAll(),
        usersAPI.getAll({ limit: 1 }), // Just query for total user count
        expertsAPI.getAll(),
      ]);

      if (contactData.success) {
        setRecentContacts(contactData.data.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalContacts: contactData.pagination?.total || contactData.count || contactData.data.length,
          pendingInquiries: contactData.data.filter(c => c.status === 'pending' || c.status === 'new').length,
        }));
      }

      if (servicesData.success) {
        setServices(servicesData.data);
        setStats(prev => ({ ...prev, totalServices: servicesData.count || servicesData.data.length }));
      }

      if (usersData.success) {
        setStats(prev => ({ ...prev, totalUsers: usersData.pagination?.total || usersData.count }));
      }

      if (expertsData.success) {
        setExperts(expertsData.data);
        setStats(prev => ({ ...prev, totalExperts: expertsData.count || expertsData.data.length }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await contactAPI.delete(id);
      showSuccess('Inquiry deleted successfully');
      inquiriesPagination.refresh();
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      showError(error.message || 'Failed to delete inquiry');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await contactAPI.updateStatus(id, newStatus);
      showSuccess('Status updated successfully');
      inquiriesPagination.refresh();
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
      showError(error.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      showSuccess('User deleted successfully');
      usersPagination.refresh();
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error.message || 'Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (id, newRole) => {
    try {
      await usersAPI.updateRole(id, newRole);
      showSuccess('User role updated successfully');
      usersPagination.refresh();
    } catch (error) {
      console.error('Error updating user role:', error);
      showError(error.message || 'Failed to update user role');
    }
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'user',
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.update(editingUser._id, userForm);
      showSuccess('User updated successfully');
      setShowUserModal(false);
      usersPagination.refresh();
    } catch (error) {
      console.error('Error saving user:', error);
      showError(error.message || 'Failed to save user');
    }
  };

  const renderSkeleton = () => {
    if (activeTab === 'overview') {
      return (
        <div>
          {/* Stats Grid Skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', borderRadius: 12, padding: '1.5rem' }}>
                <div className="skeleton" style={{ width: '60%', height: '14px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '40%', height: '36px' }} />
              </div>
            ))}
          </div>
          {/* Recent Inquiries Skeleton */}
          <div style={{ background: 'var(--dash-list-item-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.5rem' }}>
            <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: '1.5rem' }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', padding: '16px', borderRadius: 8, marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                  <div className="skeleton" style={{ width: '60px', height: '12px' }} />
                </div>
                <div className="skeleton" style={{ width: '220px', height: '14px' }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'inquiries') {
      return (
        <div>
          <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div className="skeleton" style={{ width: '120px', height: '18px', marginBottom: '6px' }} />
                    <div className="skeleton" style={{ width: '150px', height: '13px' }} />
                  </div>
                  <div>
                    <div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '6px' }} />
                  </div>
                </div>
                <div style={{ background: 'var(--dash-list-item-bg)', padding: '12px', borderRadius: 8, marginBottom: '12px' }}>
                  <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '75%', height: '14px' }} />
                </div>
                <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'services') {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="skeleton" style={{ width: '250px', height: '24px' }} />
            <div className="skeleton" style={{ width: '130px', height: '38px', borderRadius: '10px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="skeleton" style={{ width: '30px', height: '12px' }} />
                    <div className="skeleton" style={{ width: '50px', height: '16px', borderRadius: '4px' }} />
                  </div>
                  <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '6px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', borderTop: 'var(--dash-card-border)', paddingTop: '12px', marginTop: '16px' }}>
                  <div className="skeleton" style={{ flex: 1, height: '32px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ flex: 1, height: '32px', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'users') {
      return (
        <div>
          <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '120px', height: '16px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ width: '180px', height: '13px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '100px', height: '28px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      showSuccess('Service deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting service:', error);
      showError(error.message || 'Failed to delete service');
    }
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      num: '',
      title: '',
      description: '',
      tags: '',
      expert: '',
      isActive: true,
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      num: service.num || '',
      title: service.title || '',
      description: service.description || '',
      tags: service.tags ? service.tags.join(', ') : '',
      expert: service.expert?._id || service.expert || '',
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const payload = {
      num: serviceForm.num,
      title: serviceForm.title,
      description: serviceForm.description,
      tags: serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      expert: serviceForm.expert || null,
      isActive: serviceForm.isActive,
    };

    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, payload);
        showSuccess('Service updated successfully');
      } else {
        await servicesAPI.create(payload);
        showSuccess('Service created successfully');
      }
      setShowServiceModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving service:', error);
      showError(error.message || 'Failed to save service');
    }
  };

  // Expert Management Actions
  const handleApproveExpert = async (id) => {
    try {
      await expertsAPI.approve(id);
      showSuccess('Expert approved successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving expert:', error);
      showError(error.message || 'Failed to approve expert');
    }
  };

  const handleDeleteExpert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expert?')) return;
    try {
      await expertsAPI.delete(id);
      showSuccess('Expert deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting expert:', error);
      showError(error.message || 'Failed to delete expert');
    }
  };

  const handleOpenAddExpert = () => {
    setEditingExpert(null);
    setExpertForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      accessCode: '',
    });
    setShowExpertModal(true);
  };

  const handleOpenEditExpert = (exp) => {
    setEditingExpert(exp);
    setExpertForm({
      name: exp.name || '',
      role: exp.role || '',
      email: exp.email || '',
      phone: exp.phone || '',
      accessCode: exp.accessCode || '',
    });
    setShowExpertModal(true);
  };

  const handleSaveExpert = async (e) => {
    e.preventDefault();
    try {
      if (editingExpert) {
        await expertsAPI.update(editingExpert._id, expertForm);
        showSuccess('Expert updated successfully');
      } else {
        await expertsAPI.create(expertForm);
        showSuccess('Expert created successfully');
      }
      setShowExpertModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving expert:', error);
      showError(error.message || 'Failed to save expert');
    }
  };

  return (
    <div className="dash-container" style={{
      minHeight: '100vh',
      background: 'var(--dash-bg)',
      padding: '2rem',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      <div className="dash-header" style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        <div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--dash-text-primary)',
            margin: 0,
            transition: 'color 0.3s ease',
          }}>
            Tech<span style={{ color: 'var(--dash-text-secondary)' }}>Help</span> Admin
          </h1>
          <p style={{ fontSize: 13, color: 'var(--dash-text-secondary)', margin: '4px 0 0 0', transition: 'color 0.3s ease' }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="dash-header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Go to Home button */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            🏠 Home
          </button>

          {/* Theme Toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: '#ef4444',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dash-tabs-container" style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '8px',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        {[
          { id: 'overview',  label: 'Overview',   icon: '📊' },
          { id: 'inquiries', label: 'Inquiries',   icon: '📧' },
          { id: 'payments',  label: 'Paid Users',  icon: '💳' },
          { id: 'services',  label: 'Services',    icon: '⚙️' },
          { id: 'experts',   label: 'Experts',     icon: '👨‍💼' },
          { id: 'users',     label: 'Users',       icon: '👥' },
        ].map(tab => (
          <button
            key={tab.id}
            className="dash-tab-btn"
            onClick={() => handleTabChange(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id 
                ? 'var(--dash-btn-hover-bg)' 
                : 'var(--dash-btn-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: activeTab === tab.id
                ? 'var(--dash-btn-border)'
                : '1px solid transparent',
              color: activeTab === tab.id
                ? 'var(--dash-text-primary)'
                : 'var(--dash-text-secondary)',
              padding: '12px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '2rem',
        minHeight: 400,
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  Dashboard Overview
                </h2>
                
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}>
                  {[
                    { label: 'Total Inquiries',   value: stats.totalContacts,   icon: '📧', color: '#3b82f6' },
                    { label: 'Pending Inquiries',  value: stats.pendingInquiries, icon: '⏳', color: '#f59e0b' },
                    { label: 'Total Services',     value: stats.totalServices,   icon: '⚙️', color: '#8b5cf6' },
                    { label: 'Total Experts',      value: stats.totalExperts,    icon: '👨‍💼', color: '#10b981' },
                    { label: 'Total Users',        value: stats.totalUsers,      icon: '👥', color: '#06b6d4' },
                    { label: 'Paid Users',         value: stats.totalPaid,       icon: '💳', color: '#22c55e' },
                    { label: "Today's Visitors",   value: visitorSummary.today,  icon: '👁️', color: '#ec4899' },
                  ].map((s, idx) => (
                    <div key={idx}
                      onClick={() => s.label === 'Paid Users' ? handleTabChange('payments') : null}
                      style={{
                        background: 'var(--dash-btn-bg)',
                        border: 'var(--dash-btn-border)',
                        borderRadius: 12,
                        padding: '1.25rem 1.5rem',
                        transition: 'all 0.25s ease',
                        cursor: s.label === 'Paid Users' ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', gap: 14,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}18`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: 'var(--dash-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>{s.label}</p>
                        <p style={{ fontSize: 30, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Visitor Bar Chart ── */}
                <div style={{
                  background: 'var(--dash-list-item-bg)',
                  border: 'var(--dash-card-border)',
                  borderRadius: 12, padding: '1.5rem',
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, margin: 0 }}>📈 Website Visitors — Last 14 Days</h3>
                    <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--dash-text-secondary)' }}>
                      <span>Today: <strong style={{ color: '#ec4899' }}>{visitorSummary.today}</strong></span>
                      <span>14-day total: <strong style={{ color: 'var(--dash-text-primary)' }}>{visitorSummary.total}</strong></span>
                      <span>Peak: <strong style={{ color: '#3b82f6' }}>{visitorSummary.peak}</strong></span>
                    </div>
                  </div>
                  {visitorLoading ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-text-muted)', fontSize: 13 }}>Loading visitor data…</div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '0 4px' }}>
                      {visitorStats.map((day, i) => {
                        const isToday = i === visitorStats.length - 1;
                        const pct = visitorSummary.peak > 0 ? (day.count / visitorSummary.peak) * 100 : 0;
                        return (
                          <div key={day.date} title={`${day.label}: ${day.count} visitors`}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default' }}>
                            <span style={{ fontSize: 10, color: 'var(--dash-text-muted)', fontWeight: 600 }}>
                              {day.count > 0 ? day.count : ''}
                            </span>
                            <div style={{
                              width: '100%', borderRadius: '4px 4px 0 0',
                              height: `${Math.max(pct, day.count > 0 ? 4 : 1)}%`,
                              background: isToday
                                ? 'linear-gradient(180deg,#ec4899,#f43f5e)'
                                : `linear-gradient(180deg,#3b82f6,#6366f1)`,
                              opacity: day.count === 0 ? 0.2 : 1,
                              transition: 'height 0.4s ease',
                              minHeight: day.count > 0 ? 6 : 2,
                            }} />
                            <span style={{ fontSize: 9, color: isToday ? '#ec4899' : 'var(--dash-text-muted)', fontWeight: isToday ? 700 : 400, whiteSpace: 'nowrap' }}>
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'var(--dash-list-item-bg)',
                  border: 'var(--dash-card-border)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}>
                  <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, marginBottom: '1rem', transition: 'color 0.3s ease' }}>
                    Recent Inquiries
                  </h3>
                  {recentContacts.map(contact => (
                    <div
                      key={contact._id}
                      style={{
                        background: 'var(--dash-card-bg)',
                        border: 'var(--dash-card-border)',
                        padding: '12px',
                        borderRadius: 8,
                        marginBottom: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--dash-text-primary)', fontSize: 14, fontWeight: 500, transition: 'color 0.3s ease' }}>
                          {contact.name}
                        </span>
                        <span style={{
                          fontSize: 11,
                          color: 'var(--dash-text-muted)',
                          transition: 'color 0.3s ease',
                        }}>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                        {contact.email} • {contact.service}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  Contact Inquiries ({inquiriesPagination.total})
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search inquiries by name, email, or service..."
                    value={inquiriesPagination.search}
                    onChange={(e) => inquiriesPagination.setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--dash-list-item-bg)',
                      border: 'var(--dash-card-border)',
                      borderRadius: 10,
                      color: 'var(--dash-text-primary)',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {inquiriesPagination.loading && inquiriesPagination.data.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.5rem' }}>
                        <div className="skeleton" style={{ width: '40%', height: 16, marginBottom: 8 }} />
                        <div className="skeleton" style={{ width: '60%', height: 12, marginBottom: 12 }} />
                        <div className="skeleton" style={{ width: '80%', height: 14 }} />
                      </div>
                    ))}
                  </div>
                ) : inquiriesPagination.data.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dash-text-muted)' }}>
                    <p style={{ fontSize: 18, marginBottom: '8px' }}>📭</p>
                    <p>No inquiries found</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: inquiriesPagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                      {inquiriesPagination.data.map(contact => (
                        <div
                          key={contact._id}
                          style={{
                            background: 'var(--dash-card-bg)',
                            border: 'var(--dash-card-border)',
                            borderRadius: 12,
                            padding: '1.5rem',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                              <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, margin: '0 0 4px 0', transition: 'color 0.3s ease' }}>
                                {contact.name}
                              </h3>
                              <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                                {contact.email}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <select
                                value={contact.status}
                                onChange={(e) => handleUpdateStatus(contact._id, e.target.value)}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-primary)',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  marginBottom: '8px',
                                  outline: 'none',
                                }}
                              >
                                <option value="new" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>New</option>
                                <option value="read" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>In Review</option>
                                <option value="resolved" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Resolved</option>
                              </select>
                              <p style={{ fontSize: 11, color: 'var(--dash-text-muted)', margin: 0, transition: 'color 0.3s ease' }}>
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div style={{
                            background: 'var(--dash-list-item-bg)',
                            padding: '12px',
                            borderRadius: 8,
                            marginBottom: '12px',
                            transition: 'all 0.3s ease',
                          }}>
                            <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                              <strong style={{ color: 'var(--dash-text-primary)', transition: 'color 0.3s ease' }}>Service:</strong> {contact.service}
                            </p>
                            <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                              <strong style={{ color: 'var(--dash-text-primary)', transition: 'color 0.3s ease' }}>Message:</strong> {contact.message}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              padding: '8px 16px',
                              borderRadius: 6,
                              fontSize: 13,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <PaginationControls pagination={inquiriesPagination} />
                  </>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, margin: 0, transition: 'color 0.3s ease' }}>
                    Services Management ({services.length})
                  </h2>
                  <button
                    onClick={handleOpenAddService}
                    style={{
                      background: 'var(--dash-btn-pro-bg)',
                      color: 'var(--dash-btn-pro-text)',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    ➕ Add Service
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}>
                  {services.map(service => (
                    <div
                      key={service._id}
                      style={{
                        background: 'var(--dash-card-bg)',
                        border: 'var(--dash-card-border)',
                        borderRadius: 12,
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}>
                          <span style={{
                            fontSize: 11,
                            color: 'var(--dash-text-muted)',
                            fontWeight: 600,
                            transition: 'color 0.3s ease',
                          }}>
                            {service.num}
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: service.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: service.isActive ? '#10b981' : '#ef4444',
                            fontWeight: 600,
                          }}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 18, margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                          {service.title}
                        </h3>
                        <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, marginBottom: '12px', transition: 'color 0.3s ease' }}>
                          {service.description}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                          {service.tags && service.tags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                background: 'var(--dash-avatar-bg)',
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                color: 'var(--dash-text-primary)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', borderTop: 'var(--dash-card-border)', paddingTop: '12px' }}>
                        <button
                          onClick={() => handleOpenEditService(service)}
                          style={{
                            flex: 1,
                            background: 'var(--dash-btn-bg)',
                            border: 'var(--dash-btn-border)',
                            color: 'var(--dash-btn-text)',
                            padding: '8px 12px',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          style={{
                            flex: 1,
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '8px 12px',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  User Management ({usersPagination.total})
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={usersPagination.search}
                    onChange={(e) => usersPagination.setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--dash-list-item-bg)',
                      border: 'var(--dash-card-border)',
                      borderRadius: 10,
                      color: 'var(--dash-text-primary)',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {usersPagination.loading && usersPagination.data.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                          <div>
                            <div className="skeleton" style={{ width: '120px', height: '16px', marginBottom: '8px' }} />
                            <div className="skeleton" style={{ width: '180px', height: '13px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : usersPagination.data.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: 'var(--dash-list-item-bg)',
                    borderRadius: 12,
                    border: '2px dashed var(--dash-card-border)',
                    transition: 'all 0.3s ease',
                  }}>
                    <p style={{ fontSize: 48, margin: '0 0 1rem 0' }}>👥</p>
                    <p style={{ color: 'var(--dash-text-primary)', fontSize: 18, marginBottom: '8px', transition: 'color 0.3s ease' }}>
                      No users found
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: usersPagination.loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                      {usersPagination.data.map(u => (
                        <div
                          key={u._id}
                          className="dash-user-row"
                          style={{
                            background: 'var(--dash-card-bg)',
                            border: 'var(--dash-card-border)',
                            borderRadius: 12,
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'var(--dash-avatar-bg)',
                              color: 'var(--dash-text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              fontWeight: '700',
                              border: 'var(--dash-card-border)',
                            }}>
                              {u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                            </div>
                            <div>
                              <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, margin: '0 0 4px 0', fontWeight: '600' }}>
                                {u.name} {u._id === user?.id && <span style={{ fontSize: '10px', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--dash-btn-text)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>You</span>}
                              </h3>
                              <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0 }}>
                                {u.email}
                              </p>
                            </div>
                          </div>

                          <div className="dash-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ minWidth: '120px' }}>
                              <p style={{ fontSize: 11, color: 'var(--dash-text-muted)', margin: '0 0 4px 0' }}>Joined On</p>
                              <p style={{ color: 'var(--dash-text-primary)', fontSize: 13, margin: 0 }}>
                                {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>

                            <div>
                              <p style={{ fontSize: 11, color: 'var(--dash-text-muted)', margin: '0 0 4px 0' }}>Role</p>
                              <select
                                value={u.role}
                                disabled={u._id === user?.id}
                                onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-primary)',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  cursor: u._id === user?.id ? 'not-allowed' : 'pointer',
                                  outline: 'none',
                                  opacity: u._id === user?.id ? 0.7 : 1,
                                }}
                              >
                                <option value="user" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>User</option>
                                <option value="admin" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Admin</option>
                              </select>
                            </div>

                            <button
                              onClick={() => handleOpenEditUser(u)}
                              disabled={u._id === user?.id}
                              style={{
                                background: u._id === user?.id ? 'rgba(79, 70, 229, 0.05)' : 'var(--dash-btn-bg)',
                                border: 'var(--dash-btn-border)',
                                color: 'var(--dash-btn-text)',
                                padding: '8px 16px',
                                borderRadius: 6,
                                fontSize: 13,
                                cursor: u._id === user?.id ? 'not-allowed' : 'pointer',
                                opacity: u._id === user?.id ? 0.5 : 1,
                                transition: 'all 0.2s',
                                marginRight: '8px'
                              }}
                              onMouseOver={e => {
                                if (u._id !== user?.id) {
                                  e.currentTarget.style.background = 'var(--dash-btn-hover-bg)';
                                }
                              }}
                              onMouseOut={e => {
                                if (u._id !== user?.id) {
                                  e.currentTarget.style.background = 'var(--dash-btn-bg)';
                                }
                              }}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u._id === user?.id}
                              style={{
                                background: u._id === user?.id ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                padding: '8px 16px',
                                borderRadius: 6,
                                fontSize: 13,
                                cursor: u._id === user?.id ? 'not-allowed' : 'pointer',
                                opacity: u._id === user?.id ? 0.5 : 1,
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={e => {
                                if (u._id !== user?.id) {
                                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                }
                              }}
                              onMouseOut={e => {
                                if (u._id !== user?.id) {
                                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <PaginationControls pagination={usersPagination} />
                  </>
                )}
              </div>
            )}

            {activeTab === 'experts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, margin: 0, transition: 'color 0.3s ease' }}>
                    Experts Management ({experts.length})
                  </h2>
                  <button
                    onClick={handleOpenAddExpert}
                    style={{
                      background: 'var(--dash-btn-pro-bg)',
                      color: 'var(--dash-btn-pro-text)',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    ➕ Add Expert
                  </button>
                </div>

                {experts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dash-text-muted)' }}>
                    <p style={{ fontSize: 18, marginBottom: '8px' }}>👤</p>
                    <p>No experts found</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem',
                  }}>
                    {experts.map(exp => (
                      <div
                        key={exp._id}
                        style={{
                          background: 'var(--dash-card-bg)',
                          border: 'var(--dash-card-border)',
                          borderRadius: 12,
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '200px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'var(--dash-avatar-bg)',
                              color: 'var(--dash-text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              border: 'var(--dash-card-border)',
                            }}>
                              {exp.name ? exp.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'EX'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, margin: 0, fontWeight: '600' }}>
                                  {exp.name}
                                </h3>
                                {exp.isApproved === false ? (
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#f59e0b',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    Pending
                                  </span>
                                ) : (
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#10b981',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    Approved
                                  </span>
                                )}
                              </div>
                              <p style={{ color: 'var(--dash-text-secondary)', fontSize: 12, margin: '2px 0 0 0' }}>
                                {exp.role}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 13, color: 'var(--dash-text-secondary)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📧</span>
                              <span style={{ wordBreak: 'break-all' }}>{exp.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📞</span>
                              <span>{exp.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: 'var(--dash-card-border)', paddingTop: '12px' }}>
                          {exp.isApproved === false && (
                            <button
                              onClick={() => handleApproveExpert(exp._id)}
                              style={{
                                width: '100%',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#10b981',
                                padding: '8px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                              }}
                            >
                              ✅ Approve Expert
                            </button>
                          )}
                          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <button
                              onClick={() => handleOpenEditExpert(exp)}
                              style={{
                                flex: 1,
                                background: 'var(--dash-btn-bg)',
                                border: 'var(--dash-btn-border)',
                                color: 'var(--dash-btn-text)',
                                padding: '8px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExpert(exp._id)}
                              style={{
                                flex: 1,
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                padding: '8px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* ── Paid Users Tab ── */}
            {activeTab === 'payments' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
                  <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, margin: 0 }}>
                    💳 Paid Users ({ordersTotal})
                  </h2>
                  <button
                    onClick={fetchOrders}
                    style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: 'var(--dash-btn-text)', padding: '10px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
                  >🔄 Refresh</button>
                </div>

                {ordersLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ background: 'var(--dash-card-bg)', border: 'var(--dash-card-border)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                        <div className="skeleton" style={{ width: '30%', height: 16, marginBottom: 10 }} />
                        <div className="skeleton" style={{ width: '55%', height: 12 }} />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--dash-text-muted)' }}>
                    <p style={{ fontSize: 48, margin: '0 0 1rem' }}>💳</p>
                    <p style={{ fontSize: 16 }}>No paid orders yet</p>
                    <p style={{ fontSize: 13, marginTop: 8 }}>Payments will appear here after customers complete checkout.</p>
                  </div>
                ) : (
                  <>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr 1.2fr', gap: 12, padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      <span>Customer</span>
                      <span>Email</span>
                      <span>Plan</span>
                      <span>Billing</span>
                      <span>Amount</span>
                      <span>Invoice / Date</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {orders.map(order => {
                        const planColor = order.planId === 'starter' ? '#3b82f6' : order.planId === 'professional' ? '#8b5cf6' : '#10b981';
                        return (
                          <div key={order._id} style={{
                            background: 'var(--dash-card-bg)',
                            border: 'var(--dash-card-border)',
                            borderRadius: 12,
                            padding: '14px 16px',
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr 1.2fr',
                            gap: 12,
                            alignItems: 'center',
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-list-item-bg)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--dash-card-bg)'}
                          >
                            {/* Customer Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${planColor}20`, color: planColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                {order.customerName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'}
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {order.customerName}
                              </span>
                            </div>

                            {/* Email */}
                            <span style={{ fontSize: 13, color: 'var(--dash-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {order.customerEmail}
                            </span>

                            {/* Plan */}
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: '4px 10px',
                                borderRadius: 20,
                                background: `${planColor}18`,
                                color: planColor,
                                whiteSpace: 'nowrap',
                              }}>
                                {order.planName}
                              </span>
                            </span>

                            {/* Billing */}
                            <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', textTransform: 'capitalize' }}>
                              {order.billing === 'yearly' ? '📅 Yearly' : '🗓️ Monthly'}
                            </span>

                            {/* Amount */}
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>
                              ${(order.amount / 100).toFixed(2)}
                            </span>

                            {/* Invoice + Date */}
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 2 }}>
                                {order.invoiceNumber || '—'}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {Math.ceil(ordersTotal / ORDERS_LIMIT) > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: 'var(--dash-card-border)' }}>
                        <span style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>
                          Page {ordersPage} of {Math.ceil(ordersTotal / ORDERS_LIMIT)} ({ordersTotal} orders)
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                            disabled={ordersPage === 1}
                            style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: 'var(--dash-btn-text)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: ordersPage === 1 ? 'not-allowed' : 'pointer', opacity: ordersPage === 1 ? 0.5 : 1 }}
                          >← Prev</button>
                          <button
                            onClick={() => setOrdersPage(p => p + 1)}
                            disabled={ordersPage >= Math.ceil(ordersTotal / ORDERS_LIMIT)}
                            style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: 'var(--dash-btn-text)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: ordersPage >= Math.ceil(ordersTotal / ORDERS_LIMIT) ? 'not-allowed' : 'pointer', opacity: ordersPage >= Math.ceil(ordersTotal / ORDERS_LIMIT) ? 0.5 : 1 }}
                          >Next →</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        /* Mobile and split-screen responsive dashboard adjustments */
        @media (max-width: 768px) {
          .dash-container {
            padding: 1rem !important;
          }
          .dash-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1rem !important;
            text-align: center !important;
            padding: 1.25rem 1rem !important;
          }
          .dash-header-actions {
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .dash-header-actions button {
            flex: 1 !important;
            min-width: 100px !important;
            justify-content: center !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          .dash-tabs-container {
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding: 8px !important;
          }
          .dash-tab-btn {
            flex: unset !important;
            width: calc(50% - 4px) !important;
            padding: 8px !important;
            font-size: 13px !important;
          }
          .dash-user-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1rem !important;
            padding: 1rem !important;
          }
          .dash-user-actions {
            width: 100% !important;
            justify-content: space-between !important;
            gap: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .dash-tab-btn {
            width: 100% !important;
          }
          .dash-user-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .dash-user-actions div, 
          .dash-user-actions select, 
          .dash-user-actions button {
            width: 100% !important;
            min-width: unset !important;
          }
          .dash-user-actions select {
            padding: 8px !important;
          }
        }
      `}</style>

      {/* Services Modal */}
      {showServiceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }} onClick={() => setShowServiceModal(false)}>
          <div style={{
            background: 'var(--dash-card-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: 'var(--dash-card-border)',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 500,
            boxShadow: 'var(--dash-card-shadow)',
            transition: 'all 0.3s ease',
            animation: 'modalIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                {editingService ? '✏️ Edit Service' : '✨ Add New Service'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} aria-label="Close" style={{
                background: 'none', border: 'none', color: 'var(--dash-text-secondary)', fontSize: 20, cursor: 'pointer', outline: 'none'
              }}>×</button>
            </div>

            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Num</label>
                  <input
                    type="text"
                    required
                    placeholder="05"
                    value={serviceForm.num}
                    onChange={e => setServiceForm(prev => ({ ...prev, num: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: 'var(--dash-list-item-bg)',
                      border: 'var(--dash-card-border)',
                      borderRadius: 8, color: 'var(--dash-text-primary)',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Service Title"
                    value={serviceForm.title}
                    onChange={e => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: 'var(--dash-list-item-bg)',
                      border: 'var(--dash-card-border)',
                      borderRadius: 8, color: 'var(--dash-text-primary)',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed description of the service..."
                  value={serviceForm.description}
                  onChange={e => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none', resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, AWS"
                  value={serviceForm.tags}
                  onChange={e => setServiceForm(prev => ({ ...prev, tags: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Assigned Expert</label>
                <select
                  value={serviceForm.expert}
                  onChange={e => setServiceForm(prev => ({ ...prev, expert: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Select an expert...</option>
                  {experts.map(exp => (
                    <option key={exp._id} value={exp._id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {exp.name} ({exp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={serviceForm.isActive}
                  onChange={e => setServiceForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                />
                <label htmlFor="isActive" style={{ fontSize: 14, color: 'var(--dash-text-primary)', cursor: 'pointer', userSelect: 'none' }}>
                  Service is Active (visible on homepage)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-bg)',
                    border: 'var(--dash-btn-border)',
                    color: 'var(--dash-text-secondary)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-pro-bg)',
                    border: 'none',
                    color: 'var(--dash-btn-pro-text)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }} onClick={() => setShowUserModal(false)}>
          <div style={{
            background: 'var(--dash-card-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: 'var(--dash-card-border)',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 450,
            boxShadow: 'var(--dash-card-shadow)',
            transition: 'all 0.3s ease',
            animation: 'modalIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                ✏️ Edit User Details
              </h3>
              <button onClick={() => setShowUserModal(false)} aria-label="Close" style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer', outline: 'none'
              }}>×</button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={userForm.name}
                  onChange={e => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={userForm.email}
                  onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>User Role</label>
                <select
                  value={userForm.role}
                  onChange={e => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="user" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>User</option>
                  <option value="admin" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-bg)',
                    border: 'var(--dash-btn-border)',
                    color: 'var(--dash-text-secondary)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-pro-bg)',
                    border: 'none',
                    color: 'var(--dash-btn-pro-text)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experts Modal */}
      {showExpertModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }} onClick={() => setShowExpertModal(false)}>
          <div style={{
            background: 'var(--dash-card-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: 'var(--dash-card-border)',
            borderRadius: 16,
            padding: '2rem',
            width: '100%',
            maxWidth: 450,
            boxShadow: 'var(--dash-card-shadow)',
            transition: 'all 0.3s ease',
            animation: 'modalIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                {editingExpert ? '✏️ Edit Expert Details' : '✨ Add New Expert'}
              </h3>
              <button onClick={() => setShowExpertModal(false)} aria-label="Close" style={{
                background: 'none', border: 'none', color: 'var(--dash-text-secondary)', fontSize: 20, cursor: 'pointer', outline: 'none'
              }}>×</button>
            </div>

            <form onSubmit={handleSaveExpert} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Prietish Patahk"
                  value={expertForm.name}
                  onChange={e => setExpertForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Role / Area of Expertise</label>
                <input
                  type="text"
                  required
                  placeholder="Senior Full-Stack Engineer"
                  value={expertForm.role}
                  onChange={e => setExpertForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="prietish12@gmail.com"
                  value={expertForm.email}
                  onChange={e => setExpertForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="91 75950 42847"
                  value={expertForm.phone}
                  onChange={e => setExpertForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontWeight: 600 }}>Access Code (Login Password)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. prietish123"
                  value={expertForm.accessCode}
                  onChange={e => setExpertForm(prev => ({ ...prev, accessCode: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--dash-list-item-bg)',
                    border: 'var(--dash-card-border)',
                    borderRadius: 8, color: 'var(--dash-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowExpertModal(false)}
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-bg)',
                    border: 'var(--dash-btn-border)',
                    color: 'var(--dash-text-secondary)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--dash-btn-pro-bg)',
                    border: 'none',
                    color: 'var(--dash-btn-pro-text)',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Expert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationControls({ pagination }) {
  const {
    page,
    totalPages,
    limit,
    setLimit,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    total,
    loading
  } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: 'var(--dash-card-border)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
        Showing page {page} of {totalPages} ({total} items total)
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{
            background: 'var(--dash-btn-bg)',
            border: 'var(--dash-btn-border)',
            color: 'var(--dash-text-primary)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            outline: 'none',
            marginRight: '12px'
          }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        
        <button
          onClick={prevPage}
          disabled={!hasPrevPage || loading}
          style={{
            background: hasPrevPage ? 'var(--dash-btn-bg)' : 'rgba(0, 0, 0, 0.05)',
            border: 'var(--dash-btn-border)',
            color: hasPrevPage ? 'var(--dash-btn-text)' : 'var(--dash-text-muted)',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: hasPrevPage ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: hasPrevPage ? 1 : 0.5
          }}
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={!hasNextPage || loading}
          style={{
            background: hasNextPage ? 'var(--dash-btn-bg)' : 'rgba(0, 0, 0, 0.05)',
            border: 'var(--dash-btn-border)',
            color: hasNextPage ? 'var(--dash-btn-text)' : 'var(--dash-text-muted)',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: hasNextPage ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: hasNextPage ? 1 : 0.5
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}