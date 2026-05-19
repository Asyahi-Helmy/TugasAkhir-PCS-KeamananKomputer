// js/auth.js
const API_URL = 'http://localhost:3000'; 

// --- LOGIN ---
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email, password })
        });
        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Sign In Berhasil!',
                text: `Selamat datang di Dashboard, ${data.nama_pegawai}`,
                timer: 1300,
                showConfirmButton: false
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('nama_pegawai', data.nama_pegawai);
            
            setTimeout(() => { setupDashboard(); }, 1300); 
        } else {
            Swal.fire({ icon: 'error', title: 'Otentikasi Gagal', text: data.message });
        }
    } catch (err) { 
        Swal.fire({ icon: 'error', title: 'Koneksi Terputus', text: 'Backend service mati!' }); 
    }
};

// --- REGISTER ---
document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        nama_pegawai: document.getElementById('reg-nama').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        role: document.getElementById('reg-role').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            Swal.fire({ icon: 'success', title: 'Registrasi Berhasil', text: 'Silakan masuk menggunakan email terdaftar.' });
            showSection('login-section');
        } else {
            const data = await response.json();
            Swal.fire({ icon: 'warning', title: 'Perhatian', text: data.message });
        }
    } catch (err) { 
        Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kegagalan sistem register' }); 
    }
};

document.getElementById('logout-btn').onclick = () => { 
    localStorage.clear(); 
    Swal.fire({ icon: 'info', title: 'Session Ended', text: 'Anda berhasil keluar.', timer: 1000, showConfirmButton: false });
    showSection('login-section'); 
};