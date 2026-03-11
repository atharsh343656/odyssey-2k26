// admin.js

// Auth Check
if (localStorage.getItem('odyssey_admin_auth') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Logout handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('odyssey_admin_auth');
            window.location.href = 'login.html';
        });
    }

    // --- TAB SWITCHING ---
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`section-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // --- 1. PRIZE LIST MANAGEMENT ---
    const adminForm = document.getElementById('admin-form');
    const winnersTbody = document.getElementById('admin-winners-tbody');
    const clearWinnersBtn = document.getElementById('clear-winners-btn');

    loadAdminWinners();

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventName = document.getElementById('event-name').value;
        const prize1Name = document.getElementById('prize-1-name').value.trim();
        const prize1College = document.getElementById('prize-1-college').value.trim();
        const prize2Name = document.getElementById('prize-2-name').value.trim();
        const prize2College = document.getElementById('prize-2-college').value.trim();

        if (!eventName) {
            alert('Please select an event');
            return;
        }

        const newWinner = {
            id: Date.now().toString(),
            eventName,
            prize1Name: prize1Name || '—',
            prize1College: prize1College || '—',
            prize2Name: prize2Name || '—',
            prize2College: prize2College || '—',
            timestamp: new Date().toISOString()
        };

        // Get existing or create new array
        let winners = JSON.parse(localStorage.getItem('odyssey2k26_winners') || '[]');

        // Remove existing entry for the same event to update it
        winners = winners.filter(w => w.eventName !== eventName);
        winners.push(newWinner);

        localStorage.setItem('odyssey2k26_winners', JSON.stringify(winners));

        loadAdminWinners();
        showSuccess(adminForm.querySelector('button'), 'Updated!');
        adminForm.reset();
    });

    clearWinnersBtn.addEventListener('click', () => {
        if (confirm('Delete ALL published prizes? This cannot be undone.')) {
            localStorage.removeItem('odyssey2k26_winners');
            loadAdminWinners();
        }
    });

    function loadAdminWinners() {
        const saved = localStorage.getItem('odyssey2k26_winners');
        winnersTbody.innerHTML = '';

        if (!saved) {
            winnersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #a0a0b0;">No prizes published yet.</td></tr>`;
            return;
        }

        const winners = JSON.parse(saved);
        if (winners.length === 0) {
            winnersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #a0a0b0;">No prizes published yet.</td></tr>`;
            return;
        }

        const reversed = [...winners].reverse();

        reversed.forEach(winner => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td><strong>${winner.eventName}</strong></td>
                <td>${winner.prize1Name}<br><small style="color:var(--text-secondary)">${winner.prize1College}</small></td>
                <td>${winner.prize2Name}<br><small style="color:var(--text-secondary)">${winner.prize2College}</small></td>
                <td>
                    <button class="delete-btn delete-winner-btn" data-id="${winner.id}" title="Delete">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </td>
            `;
            winnersTbody.appendChild(tr);
        });

        lucide.createIcons();

        document.querySelectorAll('.delete-winner-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                if (!confirm('Delete this record?')) return;
                let winners = JSON.parse(localStorage.getItem('odyssey2k26_winners') || '[]');
                winners = winners.filter(w => w.id !== this.getAttribute('data-id'));
                localStorage.setItem('odyssey2k26_winners', JSON.stringify(winners));
                loadAdminWinners();
            });
        });
    }

    // --- 2. SCHEDULE MANAGEMENT ---
    const scheduleForm = document.getElementById('schedule-form');
    const scheduleTbody = document.getElementById('admin-schedule-tbody');

    if (scheduleForm) {
        loadAdminSchedule();

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const time = document.getElementById('schedule-time').value.trim();
            const event = document.getElementById('schedule-event').value.trim();
            const category = document.getElementById('schedule-category').value.trim();
            const venue = document.getElementById('schedule-venue').value.trim();

            if (!time || !event) return;

            const newItem = {
                id: Date.now().toString(),
                time, event, category, venue
            };

            let schedule = JSON.parse(localStorage.getItem('odyssey2k26_schedule') || '[]');
            schedule.push(newItem);
            localStorage.setItem('odyssey2k26_schedule', JSON.stringify(schedule));

            loadAdminSchedule();
            showSuccess(scheduleForm.querySelector('button'), 'Saved!');
            scheduleForm.reset();
        });
    }

    function loadAdminSchedule() {
        const schedule = JSON.parse(localStorage.getItem('odyssey2k26_schedule') || '[]');
        if (!scheduleTbody) return;
        scheduleTbody.innerHTML = '';

        if (schedule.length === 0) {
            scheduleTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem; color: #a0a0b0;">Schedule is empty.</td></tr>`;
            return;
        }

        schedule.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.time}</td>
                <td><strong>${item.event}</strong><br><small style="color:var(--text-secondary)">${item.category}</small></td>
                <td>${item.venue}</td>
                <td>
                    <button class="delete-btn delete-schedule-btn" data-id="${item.id}" title="Delete">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </td>
            `;
            scheduleTbody.appendChild(tr);
        });

        lucide.createIcons();

        document.querySelectorAll('.delete-schedule-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                if (!confirm('Delete this schedule item?')) return;
                let schedule = JSON.parse(localStorage.getItem('odyssey2k26_schedule') || '[]');
                schedule = schedule.filter(s => s.id !== this.getAttribute('data-id'));
                localStorage.setItem('odyssey2k26_schedule', JSON.stringify(schedule));
                loadAdminSchedule();
            });
        });
    }

    // --- 3. CONTACTS MANAGEMENT ---
    const contactForm = document.getElementById('contact-form-admin');
    const staffContainer = document.getElementById('staff-contacts-container');
    const studentContainer = document.getElementById('student-contacts-container');

    if (contactForm) {
        document.getElementById('add-staff-btn').addEventListener('click', () => addContactInput(staffContainer, 'staff'));
        document.getElementById('add-student-btn').addEventListener('click', () => addContactInput(studentContainer, 'student'));

        loadAdminContacts();

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const contacts = { staff: [], student: [] };

            staffContainer.querySelectorAll('.contact-row').forEach(div => {
                const name = div.querySelector('.contact-name').value.trim();
                const phone = div.querySelector('.contact-phone').value.trim();
                if (name || phone) contacts.staff.push({ name, phone });
            });

            studentContainer.querySelectorAll('.contact-row').forEach(div => {
                const name = div.querySelector('.contact-name').value.trim();
                const phone = div.querySelector('.contact-phone').value.trim();
                if (name || phone) contacts.student.push({ name, phone });
            });

            localStorage.setItem('odyssey2k26_contacts', JSON.stringify(contacts));
            showSuccess(contactForm.querySelector('button'), 'Saved Contacts!');
        });
    }

    function addContactInput(container, type, name = '', phone = '') {
        const div = document.createElement('div');
        div.className = 'contact-row';
        div.style.display = 'flex';
        div.style.gap = '10px';
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <input type="text" placeholder="Name" value="${name}" class="contact-name" style="flex:1; padding: 10px; border-radius: 4px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.5); color: white;">
            <input type="text" placeholder="Phone" value="${phone}" class="contact-phone" style="flex:1; padding: 10px; border-radius: 4px; border: 1px solid var(--glass-border); background: rgba(0,0,0,0.5); color: white;">
            <button type="button" class="btn-sm delete-contact-input" style="padding: 10px;"><i data-lucide="x"></i></button>
        `;
        container.appendChild(div);
        lucide.createIcons();

        div.querySelector('.delete-contact-input').addEventListener('click', () => div.remove());
    }

    function loadAdminContacts() {
        // Defaults to user request
        const defaultContacts = {
            staff: [
                { name: 'Dr. A. Astalin Melba', phone: '9047659356' },
                { name: 'Mrs. A. Bindhu', phone: '8925246460' }
            ],
            student: [
                { name: 'Ms. Evelin K. E.', phone: '9080460176' },
                { name: 'Mr. Gokul', phone: '9042816515' }
            ]
        };

        const saved = JSON.parse(localStorage.getItem('odyssey2k26_contacts') || JSON.stringify(defaultContacts));

        staffContainer.innerHTML = '';
        studentContainer.innerHTML = '';

        if (saved.staff.length === 0) addContactInput(staffContainer, 'staff');
        else saved.staff.forEach(c => addContactInput(staffContainer, 'staff', c.name, c.phone));

        if (saved.student.length === 0) addContactInput(studentContainer, 'student');
        else saved.student.forEach(c => addContactInput(studentContainer, 'student', c.name, c.phone));
    }


    // --- 4. CERTIFICATE MANAGEMENT ---
    const certForm = document.getElementById('certificate-form');
    const certTbody = document.getElementById('admin-cert-tbody');
    const certEditId = document.getElementById('cert-edit-id');
    const certSubmitBtn = document.getElementById('cert-submit-btn');
    const certCancelBtn = document.getElementById('cert-cancel-btn');

    if (certForm) {
        loadAdminCertificates();

        certForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const chestNumber = document.getElementById('cert-chest-number').value.trim();
            const fileData = document.getElementById('cert-file-data').value.trim();
            const editId = certEditId.value;

            if (!chestNumber || !fileData) return;

            let certificates = JSON.parse(localStorage.getItem('odyssey2k26_certificates') || '[]');

            if (editId) {
                // Update existing
                const index = certificates.findIndex(c => c.id === editId);
                if (index !== -1) {
                    certificates[index] = { ...certificates[index], chestNumber, fileData };
                }
                certEditId.value = '';
                certSubmitBtn.innerHTML = 'Upload Certificate <i data-lucide="file-up"></i>';
                certCancelBtn.style.display = 'none';
            } else {
                // Add new
                const newItem = {
                    id: Date.now().toString(),
                    chestNumber,
                    fileData
                };
                certificates.push(newItem);
            }

            localStorage.setItem('odyssey2k26_certificates', JSON.stringify(certificates));

            loadAdminCertificates();
            showSuccess(certSubmitBtn, editId ? 'Updated!' : 'Uploaded!');
            certForm.reset();
            lucide.createIcons();
        });

        certCancelBtn.addEventListener('click', () => {
            certForm.reset();
            certEditId.value = '';
            certSubmitBtn.innerHTML = 'Upload Certificate <i data-lucide="file-up"></i>';
            certCancelBtn.style.display = 'none';
            lucide.createIcons();
        });
    }

    function loadAdminCertificates() {
        const certificates = JSON.parse(localStorage.getItem('odyssey2k26_certificates') || '[]');
        if (!certTbody) return;
        certTbody.innerHTML = '';

        if (certificates.length === 0) {
            certTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem; color: #a0a0b0;">No certificates uploaded yet.</td></tr>`;
            return;
        }

        certificates.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.chestNumber}</strong></td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.fileData}</td>
                <td>
                    <div style="display: flex; gap: 10px;">
                        <button class="edit-btn edit-cert-btn" data-id="${item.id}" title="Edit" style="background: none; border: none; color: var(--secondary); cursor: pointer;">
                            <i data-lucide="edit-2" style="width: 18px; height: 18px;"></i>
                        </button>
                        <button class="delete-btn delete-cert-btn" data-id="${item.id}" title="Delete">
                            <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                        </button>
                    </div>
                </td>
            `;
            certTbody.appendChild(tr);
        });

        lucide.createIcons();

        document.querySelectorAll('.delete-cert-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                if (!confirm('Delete this certificate?')) return;
                let certificates = JSON.parse(localStorage.getItem('odyssey2k26_certificates') || '[]');
                certificates = certificates.filter(c => c.id !== this.getAttribute('data-id'));
                localStorage.setItem('odyssey2k26_certificates', JSON.stringify(certificates));
                loadAdminCertificates();
            });
        });

        document.querySelectorAll('.edit-cert-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                let certificates = JSON.parse(localStorage.getItem('odyssey2k26_certificates') || '[]');
                const item = certificates.find(c => c.id === id);
                if (item) {
                    document.getElementById('cert-chest-number').value = item.chestNumber;
                    document.getElementById('cert-file-data').value = item.fileData;
                    certEditId.value = item.id;
                    certSubmitBtn.innerHTML = 'Update Certificate <i data-lucide="save"></i>';
                    certCancelBtn.style.display = 'block';
                    lucide.createIcons();
                    window.scrollTo({ top: certForm.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }

    // --- UTILS ---
    function showSuccess(btn, msg) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `${msg} <i data-lucide="check-circle"></i>`;
        const originalBg = btn.style.background;
        btn.style.background = '#00cc66';
        lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = originalBg;
            lucide.createIcons();
        }, 2000);
    }
});
