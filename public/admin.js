// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.apiBase = '/api';
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadClubs();
        this.loadCourts();
        this.loadReservations();
        this.loadUsers();
        this.loadPayments();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Form submissions
        document.getElementById('add-club-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addClub();
        });

        document.getElementById('add-court-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCourt();
        });

        // Filter controls
        document.getElementById('reservation-filter')?.addEventListener('change', (e) => {
            this.filterReservations(e.target.value);
        });
    }

    switchSection(section) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            clubs: 'Gestión de Clubes',
            courts: 'Gestión de Canchas',
            reservations: 'Gestión de Reservas',
            users: 'Gestión de Usuarios',
            payments: 'Gestión de Pagos'
        };

        document.getElementById('page-title').textContent = titles[section];
        document.getElementById('page-subtitle').textContent = 
            section === 'dashboard' ? 'Panel de administración del sistema' : 'Administrar y monitorear datos';

        this.currentSection = section;
    }

    async loadDashboardData() {
        try {
            // Load stats from API
            const statsRes = await fetch('/api/stats');
            const stats = await statsRes.json();

            // Update stats
            document.getElementById('total-clubs').textContent = stats.clubs;
            document.getElementById('total-courts').textContent = stats.courts;
            document.getElementById('total-reservations').textContent = stats.reservations;
            document.getElementById('total-revenue').textContent = `$${(stats.revenue / 100).toFixed(2)}`;

            // Load recent reservations for activity
            const reservationsRes = await fetch('/reservations');
            const reservations = await reservationsRes.json();
            this.loadRecentActivity(reservations.slice(0, 5));

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set default values on error
            document.getElementById('total-clubs').textContent = '0';
            document.getElementById('total-courts').textContent = '0';
            document.getElementById('total-reservations').textContent = '0';
            document.getElementById('total-revenue').textContent = '$0.00';
        }
    }

    loadRecentActivity(activities) {
        const container = document.getElementById('recent-activity-list');
        container.innerHTML = '';

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Sin actividad reciente</h3>
                    <p>No hay actividades para mostrar</p>
                </div>
            `;
            return;
        }

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <i class="fas fa-calendar-check"></i>
                <div class="activity-content">
                    <p>Nueva reserva en ${activity.court?.name || 'cancha'}</p>
                    <small>${this.formatDate(activity.createdAt)}</small>
                </div>
            `;
            container.appendChild(item);
        });
    }

    async loadClubs() {
        try {
            const response = await fetch('/clubs');
            const clubs = await response.json();
            
            const tbody = document.getElementById('clubs-table-body');
            tbody.innerHTML = '';

            clubs.forEach(club => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${club.name}</td>
                    <td>${club.address || 'N/A'}</td>
                    <td>${club.city || 'N/A'}</td>
                    <td>${club.owner?.name || club.owner?.email || 'N/A'}</td>
                    <td><span class="status-badge ${club.isActive ? 'status-active' : 'status-cancelled'}">${club.isActive ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="adminPanel.editClub('${club.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-error" onclick="adminPanel.deleteClub('${club.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading clubs:', error);
        }
    }

    async loadCourts() {
        try {
            const response = await fetch('/courts');
            const courts = await response.json();
            
            const tbody = document.getElementById('courts-table-body');
            tbody.innerHTML = '';

            courts.forEach(court => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${court.name}</td>
                    <td>${court.club?.name || 'N/A'}</td>
                    <td>${court.surface || 'N/A'}</td>
                    <td>$${(court.basePrice / 100).toFixed(2)}</td>
                    <td><span class="status-badge ${court.isActive ? 'status-active' : 'status-cancelled'}">${court.isActive ? 'Activa' : 'Inactiva'}</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="adminPanel.editCourt('${court.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-error" onclick="adminPanel.deleteCourt('${court.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading courts:', error);
        }
    }

    async loadReservations() {
        try {
            const response = await fetch('/reservations');
            const reservations = await response.json();
            
            const tbody = document.getElementById('reservations-table-body');
            tbody.innerHTML = '';

            reservations.forEach(reservation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservation.user?.name || reservation.user?.email || 'N/A'}</td>
                    <td>${reservation.club?.name || 'N/A'}</td>
                    <td>${reservation.court?.name || 'N/A'}</td>
                    <td>${this.formatDate(reservation.timeslot?.date)}</td>
                    <td>${reservation.timeslot?.startTime || 'N/A'}</td>
                    <td>$${(reservation.totalCents / 100).toFixed(2)}</td>
                    <td><span class="status-badge status-${reservation.status.toLowerCase()}">${this.getStatusText(reservation.status)}</span></td>
                    <td>
                        <button class="btn btn-success" onclick="adminPanel.confirmReservation('${reservation.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-error" onclick="adminPanel.cancelReservation('${reservation.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    }

    async loadUsers() {
        try {
            const response = await fetch('/auth/users');
            const users = await response.json();
            
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge status-${user.role.toLowerCase()}">${user.role}</span></td>
                    <td>${user.wallet ? `${user.wallet.substring(0, 8)}...` : 'N/A'}</td>
                    <td>${this.formatDate(user.createdAt)}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="adminPanel.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-error" onclick="adminPanel.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async loadPayments() {
        try {
            const response = await fetch('/payments');
            const payments = await response.json();
            
            const tbody = document.getElementById('payments-table-body');
            tbody.innerHTML = '';

            payments.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.id.substring(0, 8)}...</td>
                    <td>${payment.method}</td>
                    <td>$${(payment.amountCents / 100).toFixed(2)}</td>
                    <td>${payment.currency}</td>
                    <td><span class="status-badge status-${payment.status.toLowerCase()}">${this.getStatusText(payment.status)}</span></td>
                    <td>${payment.network || 'N/A'}</td>
                    <td>${this.formatDate(payment.createdAt)}</td>
                    <td>
                        <button class="btn btn-success" onclick="adminPanel.confirmPayment('${payment.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading payments:', error);
        }
    }

    async addClub() {
        const form = document.getElementById('add-club-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Club creado exitosamente', 'success');
                this.closeModal('add-club-modal');
                form.reset();
                this.loadClubs();
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Error al crear club', 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    }

    async addCourt() {
        const form = document.getElementById('add-court-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/courts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Cancha creada exitosamente', 'success');
                this.closeModal('add-court-modal');
                form.reset();
                this.loadCourts();
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Error al crear cancha', 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    }

    async confirmReservation(reservationId) {
        try {
            const response = await fetch(`/reservations/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservationId })
            });

            if (response.ok) {
                this.showNotification('Reserva confirmada', 'success');
                this.loadReservations();
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Error al confirmar reserva', 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    }

    async cancelReservation(reservationId) {
        if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

        try {
            const response = await fetch(`/reservations/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservationId })
            });

            if (response.ok) {
                this.showNotification('Reserva cancelada', 'success');
                this.loadReservations();
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Error al cancelar reserva', 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'PENDING': 'Pendiente',
            'PAID': 'Pagado',
            'CANCELLED': 'Cancelado',
            'AVAILABLE': 'Disponible',
            'RESERVED': 'Reservado',
            'HELD': 'Retenido',
            'CONFIRMED': 'Confirmado',
            'FAILED': 'Fallido',
            'ACTIVE': 'Activo',
            'INACTIVE': 'Inactivo'
        };
        return statusMap[status] || status;
    }

    filterReservations(filter) {
        const rows = document.querySelectorAll('#reservations-table-body tr');
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else {
                const statusBadge = row.querySelector('.status-badge');
                const status = statusBadge?.textContent.toLowerCase();
                if (status === filter.toLowerCase()) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
}

// Global functions for HTML onclick handlers
function showAddClubModal() {
    adminPanel.showModal('add-club-modal');
}

function showAddCourtModal() {
    adminPanel.showModal('add-court-modal');
}

function closeModal(modalId) {
    adminPanel.closeModal(modalId);
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
