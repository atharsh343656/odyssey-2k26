/**
 * ODYSSEY 2K26 - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        menuToggle.innerHTML = isActive ? `<i data-lucide="x"></i>` : `<i data-lucide="menu"></i>`;
        lucide.createIcons();
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            // Keep it scrolled if we are not on the index page (as the background is dark)
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/' + window.location.pathname.split('/').pop().split('.')[0] + '/')) {
                navbar.classList.remove('scrolled');
            } else {
                 navbar.classList.add('scrolled');
            }
        }
    });

    // 3. Page Active Link Highlighting
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Live Winners Board Logic (LocalStorage Integration)
    const MOCK_EVENTS = [
        "Foot Loose (Solo)", "Foot Loose (Team)", "Melody Mania (Solo)", "Melody Mania (Team)",
        "Mind Marathon", "Elite Walk", "Pixel Hunt", "Henna Harmony", "Hue and You", "Junk Yard", "Art Arena"
    ];

    function fetchWinnersData() {
        const tbody = document.getElementById('live-winners-body');
        if (!tbody) return;

        const saved = localStorage.getItem('odyssey2k26_winners');
        let winnersData = saved ? JSON.parse(saved) : [];

        renderWinnersTable(winnersData, tbody);
    }

    function renderWinnersTable(dataArray, tbodyElement) {
        tbodyElement.innerHTML = ''; // Clear existing rows

        // For each event, we show a row. If there's data, we show it, else "Updating..."
        MOCK_EVENTS.forEach(eventName => {
            const item = dataArray.find(w => w.eventName === eventName);
            const tr = document.createElement('tr');

            if (item) {
                // Determine styling based on whether the result is announced
                const renderName = (name) => {
                    const isUpdating = (!name || name === '—' || name.toLowerCase().includes('update'));
                    return isUpdating
                        ? `<span class="updating-pulse">Updating...</span>`
                        : `<strong style="color: white; text-shadow: 0 0 5px rgba(255,255,255,0.5);">${name}</strong>`;
                };

                const renderCollege = (name, col) => {
                    const isUpdating = (!name || name === '—' || name.toLowerCase().includes('update'));
                    return isUpdating || !col || col === '—'
                        ? '—'
                        : `<span style="color: var(--secondary);">${col}</span>`;
                };

                tr.innerHTML = `
                    <td><strong>${eventName}</strong></td>
                    <td>${renderName(item.prize1Name)}</td>
                    <td>${renderCollege(item.prize1Name, item.prize1College)}</td>
                    <td>${renderName(item.prize2Name)}</td>
                    <td>${renderCollege(item.prize2Name, item.prize2College)}</td>
                `;
            } else {
                tr.innerHTML = `
                    <td><strong>${eventName}</strong></td>
                    <td><span class="updating-pulse">Updating...</span></td>
                    <td>—</td>
                    <td><span class="updating-pulse">Updating...</span></td>
                    <td>—</td>
                `;
            }
            tbodyElement.appendChild(tr);
        });
    }

    // 7. Schedule Logic
    function fetchScheduleData() {
        const tbody = document.getElementById('live-schedule-body');
        if (!tbody) return;

        const saved = localStorage.getItem('odyssey2k26_schedule');
        let scheduleData = saved ? JSON.parse(saved) : null;

        // Fallback schedule based on user's table
        if (!scheduleData || scheduleData.length === 0) {
            scheduleData = [
                { time: "9:00 AM", event: "Inauguration", category: "Ceremony", venue: "Main Auditorium" },
                { time: "9:30 AM", event: "Mind Marathon", category: "On Stage", venue: "Seminar Hall" },
                { time: "10:15 AM", event: "Melody Mania (Solo)", category: "On Stage", venue: "Main Stage" },
                { time: "11:00 AM", event: "Melody Mania (Team)", category: "On Stage", venue: "Main Stage" },
                { time: "11:45 AM", event: "Pixel Hunt", category: "Off Stage", venue: "Campus Area" },
                { time: "12:15 PM", event: "Henna Harmony", category: "Off Stage", venue: "Art Hall" },
                { time: "1:00 PM", event: "Lunch Break", category: "—", venue: "Cafeteria" },
                { time: "2:00 PM", event: "Foot Loose (Solo)", category: "On Stage", venue: "Main Stage" },
                { time: "2:45 PM", event: "Foot Loose (Team)", category: "On Stage", venue: "Main Stage" },
                { time: "3:30 PM", event: "Elite Walk", category: "On Stage", venue: "Auditorium" },
                { time: "4:00 PM", event: "Hue and You", category: "Off Stage", venue: "Art Room" },
                { time: "4:30 PM", event: "Junk Yard", category: "Off Stage", venue: "Workshop Hall" },
                { time: "5:00 PM", event: "Art Arena", category: "Off Stage", venue: "Art Room" },
                { time: "5:45 PM", event: "Prize Distribution", category: "Ceremony", venue: "Main Stage" }
            ];
            // Don't auto-save to localstorage so admin has a clean slate, but display defaults
        }

        tbody.innerHTML = '';
        scheduleData.forEach(item => {
            const tr = document.createElement('tr');
            if (item.category === 'Ceremony') tr.classList.add('highlight-row');

            tr.innerHTML = `
                <td>${item.time}</td>
                <td><strong>${item.event}</strong></td>
                <td>${item.category}</td>
                <td>${item.venue}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 8. Contact Data Logic
    function fetchContactData() {
        const contactInfoContainer = document.querySelector('.contact-info');
        if (!contactInfoContainer) return;

        // Defaults per user spec
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

        const saved = localStorage.getItem('odyssey2k26_contacts');
        const contacts = saved ? JSON.parse(saved) : defaultContacts;

        let html = `<h3>Get in Touch</h3>`;

        if (contacts.staff.length > 0) {
            html += `<div class="info-item" style="margin-bottom: 20px;">
                <i data-lucide="users" style="color:var(--primary); margin-top:5px;"></i>
                <div>
                    <h4 style="color:var(--primary); margin-bottom: 5px;">Staff Coordinators</h4>`;
            contacts.staff.forEach(c => {
                html += `<p style="margin-bottom: 5px;"><strong>${c.name}</strong><br>${c.phone}</p>`;
            });
            html += `</div></div>`;
        }

        if (contacts.student.length > 0) {
            html += `<div class="info-item">
                <i data-lucide="user-check" style="color:var(--secondary); margin-top:5px;"></i>
                <div>
                    <h4 style="color:var(--secondary); margin-bottom: 5px;">Student Coordinators</h4>`;
            contacts.student.forEach(c => {
                html += `<p style="margin-bottom: 5px;"><strong>${c.name}</strong><br>${c.phone}</p>`;
            });
            html += `</div></div>`;
        }

        // keep email/location
        html += `
         <div class="info-item" style="margin-top:20px;">
            <i data-lucide="mail" style="margin-top:5px;"></i>
            <div>
                <h4>Email</h4>
                <p><a href="mailto:odyssey2k26@gmail.com">odyssey2k26@gmail.com</a></p>
            </div>
        </div>
        <div class="info-item" style="margin-top:20px;">
            <i data-lucide="map-pin" style="margin-top:5px;"></i>
            <div>
                <h4>College Location</h4>
                <p>Marthandam College of Engineering and Technology</p>
            </div>
        </div>`;

        contactInfoContainer.innerHTML = html;
        lucide.createIcons();
    }


    // Initial Fetch
    fetchWinnersData();
    fetchScheduleData();
    fetchContactData();


    // 10. Countdown Timer Logic
    function startCountdown() {
        const eventDate = new Date("March 26, 2026 00:00:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(timer);
                const container = document.getElementById("countdown");
                if (container) container.innerHTML = `<p style="font-size: 1.5rem; color: var(--primary); font-weight: bold;">EVENT STARTED!</p>`;
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const dEl = document.getElementById("days");
            const hEl = document.getElementById("hours");
            const mEl = document.getElementById("minutes");
            const sEl = document.getElementById("seconds");

            if (dEl) dEl.innerText = days.toString().padStart(2, '0');
            if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
            if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
            if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    // Initial Fetch
    fetchWinnersData();
    fetchScheduleData();
    fetchContactData();
    startCountdown();

    // Auto-refresh the live boards every 30 seconds (to simulate live without page reload)
    setInterval(() => {
        fetchWinnersData();
        fetchScheduleData();
        fetchContactData();
    }, 30000);

    // --- Certificate Search Logic ---
    const searchBtn = document.getElementById('search-btn');
    const chestInput = document.getElementById('chest-number');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    const downloadLink = document.getElementById('download-link');
    const foundChestDisplay = document.getElementById('found-chest-number');

    if (searchBtn && chestInput) {
        searchBtn.addEventListener('click', () => {
            const chestNumber = chestInput.value.trim().toUpperCase();
            if (!chestNumber) return;

            // Hide previous results
            resultContainer.style.display = 'none';
            errorContainer.style.display = 'none';

            // Get certificates from localStorage
            const certificates = JSON.parse(localStorage.getItem('odyssey2k26_certificates') || '[]');
            const found = certificates.find(c => c.chestNumber.toUpperCase() === chestNumber);

            if (found) {
                foundChestDisplay.textContent = `Certificate Found: ${found.chestNumber}`;
                downloadLink.href = found.fileData;
                downloadLink.setAttribute('download', `Certificate_${found.chestNumber}.pdf`);
                resultContainer.style.display = 'block';
                
                // Animate entry
                resultContainer.style.animation = 'reveal 0.5s forwards';
            } else {
                errorContainer.style.display = 'block';
                errorContainer.style.animation = 'reveal 0.5s forwards';
            }
        });

        // Search on Enter key
        chestInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }
});
