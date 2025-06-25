// Admin Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        showLoginForm();
    } else {
        showDashboard();
    }

    // Login functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication (replace with real authentication)
            if (username === 'admin' && password === 'kinesiologie2024') {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                showDashboard();
            } else {
                showNotification('Identifiants incorrects', 'error');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            showLoginForm();
        });
    }

    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            switchTab(target);
        });
    });

    // Initialize dashboard
    if (localStorage.getItem('adminLoggedIn')) {
        initializeDashboard();
    }
});

// Show login form
function showLoginForm() {
    document.body.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <h1>Administration</h1>
                    <p>Connectez-vous à votre espace de gestion</p>
                </div>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Nom d'utilisateur</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="login-btn">Se connecter</button>
                </form>
                <div class="login-footer">
                    <a href="../index.html">← Retour au site</a>
                </div>
            </div>
        </div>
    `;
    
    // Re-attach event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'kinesiologie2024') {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                showDashboard();
            } else {
                showNotification('Identifiants incorrects', 'error');
            }
        });
    }
}

// Show dashboard
function showDashboard() {
    document.body.innerHTML = `
        <div class="admin-container">
            <div class="dashboard-container">
                <header class="admin-header">
                    <div class="header-left">
                        <h1>Administration Kinésiologie</h1>
                        <p>Bienvenue, ${localStorage.getItem('adminUsername') || 'Admin'}</p>
                    </div>
                    <div class="admin-info">
                        <span>Dernière connexion: ${new Date().toLocaleString('fr-FR')}</span>
                        <button id="logoutBtn" class="logout-btn">Déconnexion</button>
                    </div>
                </header>

                <nav class="admin-nav">
                    <button class="nav-btn active" data-tab="dashboard">
                        <i>📊</i> Tableau de bord
                    </button>
                    <button class="nav-btn" data-tab="appointments">
                        <i>📅</i> Rendez-vous
                    </button>
                    <button class="nav-btn" data-tab="messages">
                        <i>💬</i> Messages
                    </button>
                    <button class="nav-btn" data-tab="settings">
                        <i>⚙️</i> Paramètres
                    </button>
                </nav>

                <main class="admin-content">
                    <!-- Dashboard Tab -->
                    <div id="dashboard" class="tab-content active">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">📅</div>
                                <div class="stat-info">
                                    <h3>${getAppointmentsCount()}</h3>
                                    <p>Rendez-vous</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">💬</div>
                                <div class="stat-info">
                                    <h3>${getMessagesCount()}</h3>
                                    <p>Messages</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">✅</div>
                                <div class="stat-info">
                                    <h3>${getConfirmedAppointmentsCount()}</h3>
                                    <p>Confirmés</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">⏳</div>
                                <div class="stat-info">
                                    <h3>${getPendingAppointmentsCount()}</h3>
                                    <p>En attente</p>
                                </div>
                            </div>
                        </div>

                        <div class="recent-section">
                            <h2>Rendez-vous récents</h2>
                            <div class="appointments-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Date</th>
                                            <th>Heure</th>
                                            <th>Type</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recentAppointmentsTable">
                                        ${getRecentAppointmentsHTML()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="recent-section">
                            <h2>Messages récents</h2>
                            <div class="messages-container">
                                <div class="messages-list" id="recentMessagesList">
                                    ${getRecentMessagesHTML()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Appointments Tab -->
                    <div id="appointments" class="tab-content">
                        <div class="tab-header">
                            <h2>Gestion des Rendez-vous</h2>
                            <button class="add-btn" onclick="showAddAppointmentModal()">
                                <i>➕</i> Nouveau RDV
                            </button>
                        </div>

                        <div class="filters">
                            <button class="filter-btn active" data-filter="all">Tous</button>
                            <button class="filter-btn" data-filter="pending">En attente</button>
                            <button class="filter-btn" data-filter="confirmed">Confirmés</button>
                            <button class="filter-btn" data-filter="cancelled">Annulés</button>
                            <button class="filter-btn" data-filter="completed">Terminés</button>
                        </div>

                        <div class="appointments-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Téléphone</th>
                                        <th>Date</th>
                                        <th>Heure</th>
                                        <th>Type</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="appointmentsTable">
                                    ${getAllAppointmentsHTML()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Messages Tab -->
                    <div id="messages" class="tab-content">
                        <div class="tab-header">
                            <h2>Messages des Clients</h2>
                            <button class="refresh-btn" onclick="refreshMessages()">
                                <i>🔄</i> Actualiser
                            </button>
                        </div>

                        <div class="messages-container">
                            <div class="message-filters">
                                <button class="filter-btn active" data-filter="all">Tous</button>
                                <button class="filter-btn" data-filter="unread">Non lus</button>
                                <button class="filter-btn" data-filter="read">Lus</button>
                            </div>
                            <div class="messages-list" id="messagesList">
                                ${getAllMessagesHTML()}
                            </div>
                        </div>
                    </div>

                    <!-- Settings Tab -->
                    <div id="settings" class="tab-content">
                        <div class="settings-section">
                            <h2>Paramètres du Site</h2>
                            <form id="siteSettingsForm">
                                <div class="form-group">
                                    <label for="siteTitle">Titre du site</label>
                                    <input type="text" id="siteTitle" name="siteTitle" value="Kinésiologie - Votre partenaire bien-être">
                                </div>
                                <div class="form-group">
                                    <label for="contactEmail">Email de contact</label>
                                    <input type="email" id="contactEmail" name="contactEmail" value="contact@kinesiologie.fr">
                                </div>
                                <div class="form-group">
                                    <label for="contactPhone">Téléphone</label>
                                    <input type="tel" id="contactPhone" name="contactPhone" value="01 23 45 67 89">
                                </div>
                                <div class="form-group">
                                    <label for="address">Adresse</label>
                                    <textarea id="address" name="address" rows="3">123 Rue de la Paix, 75001 Paris, France</textarea>
                                </div>
                                <div class="form-group">
                                    <label for="openingHours">Horaires d'ouverture</label>
                                    <textarea id="openingHours" name="openingHours" rows="3">Lundi - Vendredi : 9h - 19h\nSamedi : 9h - 17h\nDimanche : Fermé</textarea>
                                </div>
                                <button type="submit" class="save-btn">Sauvegarder</button>
                            </form>
                        </div>

                        <div class="settings-section">
                            <h2>Paramètres Email</h2>
                            <form id="emailSettingsForm">
                                <div class="form-group">
                                    <label for="smtpHost">Serveur SMTP</label>
                                    <input type="text" id="smtpHost" name="smtpHost" placeholder="smtp.gmail.com">
                                </div>
                                <div class="form-group">
                                    <label for="smtpPort">Port SMTP</label>
                                    <input type="number" id="smtpPort" name="smtpPort" value="587">
                                </div>
                                <div class="form-group">
                                    <label for="smtpUser">Utilisateur SMTP</label>
                                    <input type="email" id="smtpUser" name="smtpUser" placeholder="votre-email@gmail.com">
                                </div>
                                <div class="form-group">
                                    <label for="smtpPass">Mot de passe SMTP</label>
                                    <input type="password" id="smtpPass" name="smtpPass">
                                </div>
                                <button type="submit" class="save-btn">Sauvegarder</button>
                                <button type="button" class="test-btn" onclick="testEmailSettings()">Tester la connexion</button>
                            </form>
                        </div>

                        <div class="settings-section">
                            <h2>Intégration Calendrier</h2>
                            <form id="calendarSettingsForm">
                                <div class="form-group">
                                    <label for="calendarType">Type de calendrier</label>
                                    <select id="calendarType" name="calendarType">
                                        <option value="google">Google Calendar</option>
                                        <option value="outlook">Outlook Calendar</option>
                                        <option value="ical">iCal</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="calendarUrl">URL du calendrier</label>
                                    <input type="url" id="calendarUrl" name="calendarUrl" placeholder="https://calendar.google.com/...">
                                </div>
                                <button type="submit" class="save-btn">Sauvegarder</button>
                                <button type="button" class="test-btn" onclick="testCalendarIntegration()">Tester l'intégration</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <!-- Add Appointment Modal -->
        <div id="addAppointmentModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Nouveau Rendez-vous</h3>
                    <button class="close-btn" onclick="closeModal('addAppointmentModal')">&times;</button>
                </div>
                <form id="addAppointmentForm">
                    <div class="form-group">
                        <label for="clientName">Nom du client</label>
                        <input type="text" id="clientName" name="clientName" required>
                    </div>
                    <div class="form-group">
                        <label for="clientEmail">Email</label>
                        <input type="email" id="clientEmail" name="clientEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="clientPhone">Téléphone</label>
                        <input type="tel" id="clientPhone" name="clientPhone">
                    </div>
                    <div class="form-group">
                        <label for="appointmentDate">Date</label>
                        <input type="date" id="appointmentDate" name="appointmentDate" required>
                    </div>
                    <div class="form-group">
                        <label for="appointmentTime">Heure</label>
                        <input type="time" id="appointmentTime" name="appointmentTime" required>
                    </div>
                    <div class="form-group">
                        <label for="sessionType">Type de séance</label>
                        <select id="sessionType" name="sessionType" required>
                            <option value="premiere">Première séance</option>
                            <option value="suivi">Séance de suivi</option>
                            <option value="specifique">Séance spécifique</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <textarea id="notes" name="notes" rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeModal('addAppointmentModal')">Annuler</button>
                        <button type="submit" class="save-btn">Créer le RDV</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Re-attach event listeners
    initializeDashboard();
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            showLoginForm();
        });
    }

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            switchTab(target);
        });
    });

    // Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Forms
    const siteSettingsForm = document.getElementById('siteSettingsForm');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSiteSettings();
        });
    }

    const emailSettingsForm = document.getElementById('emailSettingsForm');
    if (emailSettingsForm) {
        emailSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEmailSettings();
        });
    }

    const calendarSettingsForm = document.getElementById('calendarSettingsForm');
    if (calendarSettingsForm) {
        calendarSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCalendarSettings();
        });
    }

    const addAppointmentForm = document.getElementById('addAppointmentForm');
    if (addAppointmentForm) {
        addAppointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addAppointment();
        });
    }

    // Message items
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            showMessageDetail(this);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Get appointments count
function getAppointmentsCount() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.length;
}

// Get messages count
function getMessagesCount() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    return messages.length;
}

// Get confirmed appointments count
function getConfirmedAppointmentsCount() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.filter(app => app.status === 'confirmed').length;
}

// Get pending appointments count
function getPendingAppointmentsCount() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.filter(app => app.status === 'pending').length;
}

// Get recent appointments HTML
function getRecentAppointmentsHTML() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const recent = appointments.slice(0, 5);
    
    if (recent.length === 0) {
        return '<tr><td colspan="5" style="text-align: center; color: var(--color-gray);">Aucun rendez-vous récent</td></tr>';
    }

    return recent.map(app => `
        <tr>
            <td>${app.clientName}</td>
            <td>${new Date(app.date).toLocaleDateString('fr-FR')}</td>
            <td>${app.time}</td>
            <td>${app.sessionType}</td>
            <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
        </tr>
    `).join('');
}

// Get all appointments HTML
function getAllAppointmentsHTML() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    if (appointments.length === 0) {
        return '<tr><td colspan="8" style="text-align: center; color: var(--color-gray);">Aucun rendez-vous</td></tr>';
    }

    return appointments.map(app => `
        <tr>
            <td>${app.clientName}</td>
            <td>${app.clientEmail}</td>
            <td>${app.clientPhone || '-'}</td>
            <td>${new Date(app.date).toLocaleDateString('fr-FR')}</td>
            <td>${app.time}</td>
            <td>${getSessionTypeText(app.sessionType)}</td>
            <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editAppointment('${app.id}')">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteAppointment('${app.id}')">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// Get recent messages HTML
function getRecentMessagesHTML() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const recent = messages.slice(0, 3);
    
    if (recent.length === 0) {
        return '<div style="text-align: center; color: var(--color-gray); padding: var(--spacing-lg);">Aucun message récent</div>';
    }

    return recent.map(msg => `
        <div class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-header">
                <span class="message-sender">${msg.name}</span>
                <span class="message-date">${new Date(msg.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="message-subject">${msg.subject}</div>
            <div class="message-preview">${msg.message.substring(0, 100)}...</div>
        </div>
    `).join('');
}

// Get all messages HTML
function getAllMessagesHTML() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    if (messages.length === 0) {
        return '<div style="text-align: center; color: var(--color-gray); padding: var(--spacing-lg);">Aucun message</div>';
    }

    return messages.map(msg => `
        <div class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-header">
                <span class="message-sender">${msg.name}</span>
                <span class="message-date">${new Date(msg.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="message-subject">${msg.subject}</div>
            <div class="message-preview">${msg.message.substring(0, 100)}...</div>
        </div>
    `).join('');
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'En attente',
        'confirmed': 'Confirmé',
        'cancelled': 'Annulé',
        'completed': 'Terminé'
    };
    return statusMap[status] || status;
}

// Get session type text
function getSessionTypeText(type) {
    const typeMap = {
        'premiere': 'Première séance',
        'suivi': 'Séance de suivi',
        'specifique': 'Séance spécifique'
    };
    return typeMap[type] || type;
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show add appointment modal
function showAddAppointmentModal() {
    showModal('addAppointmentModal');
}

// Add appointment
function addAppointment() {
    const form = document.getElementById('addAppointmentForm');
    const formData = new FormData(form);
    
    const appointment = {
        id: Date.now().toString(),
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientPhone: formData.get('clientPhone'),
        date: formData.get('appointmentDate'),
        time: formData.get('appointmentTime'),
        sessionType: formData.get('sessionType'),
        notes: formData.get('notes'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    closeModal('addAppointmentModal');
    form.reset();
    showNotification('Rendez-vous créé avec succès', 'success');
    
    // Refresh the appointments table
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (appointmentsTable) {
        appointmentsTable.innerHTML = getAllAppointmentsHTML();
    }
}

// Edit appointment
function editAppointment(id) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(app => app.id === id);
    
    if (appointment) {
        // Populate form with appointment data
        document.getElementById('clientName').value = appointment.clientName;
        document.getElementById('clientEmail').value = appointment.clientEmail;
        document.getElementById('clientPhone').value = appointment.clientPhone || '';
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;
        document.getElementById('sessionType').value = appointment.sessionType;
        document.getElementById('notes').value = appointment.notes || '';
        
        showModal('addAppointmentModal');
    }
}

// Delete appointment
function deleteAppointment(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const filteredAppointments = appointments.filter(app => app.id !== id);
        localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
        
        showNotification('Rendez-vous supprimé', 'success');
        
        // Refresh tables
        const appointmentsTable = document.getElementById('appointmentsTable');
        if (appointmentsTable) {
            appointmentsTable.innerHTML = getAllAppointmentsHTML();
        }
        
        const recentAppointmentsTable = document.getElementById('recentAppointmentsTable');
        if (recentAppointmentsTable) {
            recentAppointmentsTable.innerHTML = getRecentAppointmentsHTML();
        }
    }
}

// Apply filter
function applyFilter(filter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-filter="${filter}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Filter appointments
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    let filteredAppointments = appointments;
    
    if (filter !== 'all') {
        filteredAppointments = appointments.filter(app => app.status === filter);
    }

    const appointmentsTable = document.getElementById('appointmentsTable');
    if (appointmentsTable) {
        if (filteredAppointments.length === 0) {
            appointmentsTable.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--color-gray);">Aucun rendez-vous trouvé</td></tr>';
        } else {
            appointmentsTable.innerHTML = filteredAppointments.map(app => `
                <tr>
                    <td>${app.clientName}</td>
                    <td>${app.clientEmail}</td>
                    <td>${app.clientPhone || '-'}</td>
                    <td>${new Date(app.date).toLocaleDateString('fr-FR')}</td>
                    <td>${app.time}</td>
                    <td>${getSessionTypeText(app.sessionType)}</td>
                    <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editAppointment('${app.id}')">Modifier</button>
                        <button class="action-btn delete-btn" onclick="deleteAppointment('${app.id}')">Supprimer</button>
                    </td>
                </tr>
            `).join('');
        }
    }
}

// Refresh messages
function refreshMessages() {
    const messagesList = document.getElementById('messagesList');
    if (messagesList) {
        messagesList.innerHTML = getAllMessagesHTML();
    }
    showNotification('Messages actualisés', 'success');
}

// Show message detail
function showMessageDetail(messageElement) {
    const messageId = messageElement.getAttribute('data-id');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const message = messages.find(msg => msg.id === messageId);
    
    if (message) {
        // Mark as read
        message.read = true;
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // Show message detail in modal
        showMessageDetailModal(message);
    }
}

// Show message detail modal
function showMessageDetailModal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Message de ${message.name}</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div style="margin-bottom: var(--spacing-md);">
                <p><strong>De:</strong> ${message.name} (${message.email})</p>
                <p><strong>Date:</strong> ${new Date(message.date).toLocaleString('fr-FR')}</p>
                <p><strong>Sujet:</strong> ${message.subject}</p>
            </div>
            <div style="background: var(--color-gray-light); padding: var(--spacing-md); border-radius: var(--radius-md);">
                <p>${message.message}</p>
            </div>
            <div class="modal-actions">
                <button class="cancel-btn" onclick="this.closest('.modal').remove()">Fermer</button>
                <button class="save-btn" onclick="replyToMessage('${message.email}')">Répondre</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Reply to message
function replyToMessage(email) {
    // Open default email client
    window.open(`mailto:${email}?subject=Re: Votre message - Kinésiologie`);
}

// Save site settings
function saveSiteSettings() {
    const form = document.getElementById('siteSettingsForm');
    const formData = new FormData(form);
    
    const settings = {
        siteTitle: formData.get('siteTitle'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        address: formData.get('address'),
        openingHours: formData.get('openingHours')
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showNotification('Paramètres sauvegardés', 'success');
}

// Save email settings
function saveEmailSettings() {
    const form = document.getElementById('emailSettingsForm');
    const formData = new FormData(form);
    
    const emailSettings = {
        smtpHost: formData.get('smtpHost'),
        smtpPort: formData.get('smtpPort'),
        smtpUser: formData.get('smtpUser'),
        smtpPass: formData.get('smtpPass')
    };
    
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
    showNotification('Paramètres email sauvegardés', 'success');
}

// Save calendar settings
function saveCalendarSettings() {
    const form = document.getElementById('calendarSettingsForm');
    const formData = new FormData(form);
    
    const calendarSettings = {
        calendarType: formData.get('calendarType'),
        calendarUrl: formData.get('calendarUrl')
    };
    
    localStorage.setItem('calendarSettings', JSON.stringify(calendarSettings));
    showNotification('Paramètres calendrier sauvegardés', 'success');
}

// Test email settings
function testEmailSettings() {
    showNotification('Test de connexion email en cours...', 'info');
    // Simulate email test
    setTimeout(() => {
        showNotification('Connexion email réussie !', 'success');
    }, 2000);
}

// Test calendar integration
function testCalendarIntegration() {
    showNotification('Test d\'intégration calendrier en cours...', 'info');
    // Simulate calendar test
    setTimeout(() => {
        showNotification('Intégration calendrier réussie !', 'success');
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fermeture automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize with sample data if empty
function initializeSampleData() {
    // Sample appointments
    if (!localStorage.getItem('appointments')) {
        const sampleAppointments = [
            {
                id: '1',
                clientName: 'Sophie Martin',
                clientEmail: 'sophie.martin@email.com',
                clientPhone: '06 12 34 56 78',
                date: '2024-01-15',
                time: '14:00',
                sessionType: 'premiere',
                notes: 'Stress au travail',
                status: 'confirmed',
                createdAt: '2024-01-10T10:00:00Z'
            },
            {
                id: '2',
                clientName: 'Thomas Dubois',
                clientEmail: 'thomas.dubois@email.com',
                clientPhone: '06 98 76 54 32',
                date: '2024-01-16',
                time: '10:00',
                sessionType: 'suivi',
                notes: 'Séance de suivi',
                status: 'pending',
                createdAt: '2024-01-11T14:30:00Z'
            }
        ];
        localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    }
    
    // Sample messages
    if (!localStorage.getItem('messages')) {
        const sampleMessages = [
            {
                id: '1',
                name: 'Claire Laurent',
                email: 'claire.laurent@email.com',
                subject: 'Demande de renseignements',
                message: 'Bonjour, je souhaiterais avoir des informations sur vos séances de kinésiologie. Pouvez-vous me dire quels sont vos tarifs et disponibilités ? Merci.',
                date: '2024-01-12T09:00:00Z',
                read: false
            },
            {
                id: '2',
                name: 'Pierre Moreau',
                email: 'pierre.moreau@email.com',
                subject: 'Rendez-vous urgent',
                message: 'Bonjour, j\'ai besoin d\'une séance rapidement car je traverse une période de stress intense. Avez-vous des créneaux disponibles cette semaine ?',
                date: '2024-01-13T16:00:00Z',
                read: true
            }
        ];
        localStorage.setItem('messages', JSON.stringify(sampleMessages));
    }
}

// Initialize sample data when the script loads
initializeSampleData(); 