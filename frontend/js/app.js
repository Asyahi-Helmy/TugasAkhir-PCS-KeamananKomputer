// js/app.js
const showSection = (sectionId) => {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById(sectionId).style.display = 'flex';
    
    if(sectionId === 'dashboard-section') {
        document.getElementById(sectionId).style.display = 'block';
    }
};

// Navigasi Antar
const switchTab = (tabName) => {
    document.getElementById('tab-content-payroll').style.display = 'none';
    document.getElementById('tab-content-absensi').style.display = 'none';
    document.getElementById('tab-btn-payroll').classList.remove('active');
    document.getElementById('tab-btn-absensi').classList.remove('active');

    if(tabName === 'payroll') {
        document.getElementById('tab-content-payroll').style.display = 'block';
        document.getElementById('tab-btn-payroll').classList.add('active');
    } else if(tabName === 'absensi') {
        document.getElementById('tab-content-absensi').style.display = 'block';
        document.getElementById('tab-btn-absensi').classList.add('active');
    }
};

document.getElementById('link-to-register').onclick = (e) => { e.preventDefault(); showSection('register-section'); };
document.getElementById('link-to-login').onclick = (e) => { e.preventDefault(); showSection('login-section'); };

window.onload = () => showSection('login-section');