// js/dashboard.js
let editId = null; 
let globalSlipData = []; 
let globalAbsensiData = [];

async function setupDashboard() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const nama = localStorage.getItem('nama_pegawai');

    if (!token) return showSection('login-section');

    document.getElementById('display-name').innerText = nama;
    document.getElementById('display-role').innerText = role;

    if (role === 'HRD') {
        document.getElementById('hrd-form-area').style.display = 'block';
        loadPegawai();
    } else {
        document.getElementById('hrd-form-area').style.display = 'none';
    }

    showSection('dashboard-section');
    switchTab('payroll'); 
    
    // Set default filter dropdown ke bulan berjalan (Mei 2026)
    document.getElementById('filter-bulan-gaji').value = 'Mei 2026';
    document.getElementById('filter-bulan-absen').value = '2026-05';

    loadDataGaji();
    loadDataAbsensi();
    startSaaSClock(); 
    initFilterListeners();
}

function startSaaSClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('live-clock').innerText = now.toLocaleTimeString('id-ID');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('live-date').innerText = now.toLocaleDateString('id-ID', options);
    }, 1000);
}

// --- LISTENERS UNTUK FILTER BULAN (POLISHING NO.1) ---
function initFilterListeners() {
    document.getElementById('filter-bulan-gaji').onchange = () => applyPayrollFilters();
    document.getElementById('filter-bulan-absen').onchange = () => applyAbsensiFilters();
}

async function loadPegawai() {
    const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.ok) {
        const users = await response.json();
        const select = document.getElementById('slip-userid');
        select.innerHTML = '<option value="">-- Pilih Pegawai --</option>';
        users.forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.nama_pegawai} (${u.role})</option>`;
        });
    }
}

async function loadDataGaji() {
    const response = await fetch(`${API_URL}/slip-gaji`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const result = await response.json();
    globalSlipData = result.data; 

    // --- LOGIKA DROPDOWN GAJI OTOMATIS ---
    const selectGaji = document.getElementById('filter-bulan-gaji');
    const currentValue = selectGaji.value; // Simpan pilihan user sebelumnya
    selectGaji.innerHTML = '<option value="ALL">Semua Periode</option>'; // Reset opsi
    
    // Ambil semua 'periode_bulan' dari data, lalu filter yang dobel pakai Set
    const uniquePeriods = [...new Set(globalSlipData.map(s => s.periode_bulan))];
    uniquePeriods.forEach(periode => {
        selectGaji.innerHTML += `<option value="${periode}">${periode}</option>`;
    });

    // Kalau value sebelumnya masih valid, balikin lagi pilihannya
    if (currentValue !== 'ALL' && uniquePeriods.includes(currentValue)) {
        selectGaji.value = currentValue;
    }

    applyPayrollFilters(); 
}

// Menggabungkan filter bulan dan live search nama
function applyPayrollFilters() {
    const bulanFilter = document.getElementById('filter-bulan-gaji').value;
    const searchKeyword = document.getElementById('search-gaji').value.toLowerCase();

    const filtered = globalSlipData.filter(s => {
        const matchBulan = (bulanFilter === 'ALL' || s.periode_bulan === bulanFilter);
        const nama = s.User ? s.User.nama_pegawai.toLowerCase() : '';
        const matchNama = nama.includes(searchKeyword);
        return matchBulan && matchNama;
    });

    // Hitung total pengeluaran payroll berdasarkan filter aktif
    let totalPayout = 0;
    filtered.forEach(s => {
        totalPayout += (parseInt(s.gaji_pokok) + parseInt(s.bonus)) - parseInt(s.potongan_hutang);
    });

    document.getElementById('sum-total-payroll').innerText = `Rp ${totalPayout.toLocaleString('id-ID')}`;
    document.getElementById('sum-count-payroll').innerText = `${filtered.length} Slip`;

    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.getElementById('tbody-gaji');
    tbody.innerHTML = ''; 
    const role = localStorage.getItem('role');

    const thAksi = document.getElementById('th-aksi');
    if (thAksi) thAksi.style.display = role === 'HRD' ? '' : 'none';

    data.forEach((s) => {
        let actionTd = '';
        if (role === 'HRD') {
            actionTd = `
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="siapkanEdit(${s.id})" style="background: #f59e0b; padding: 5px 10px; font-size: 11px; color: white; border-radius: 6px; border: none; cursor: pointer;">Edit</button>
                        <button class="btn-danger" onclick="hapusGaji(${s.id})" style="padding: 5px 10px; font-size: 11px; border: none;">Hapus</button>
                    </div>
                </td>
            `;
        }
        const totalBersih = (parseInt(s.gaji_pokok) + parseInt(s.bonus)) - parseInt(s.potongan_hutang);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.User ? s.User.nama_pegawai : 'Unknown'}</td>
            <td>${s.periode_bulan}</td>
            <td>Rp ${parseInt(s.gaji_pokok).toLocaleString('id-ID')}</td>
            <td>Rp ${parseInt(s.bonus).toLocaleString('id-ID')}</td>
            <td>Rp ${parseInt(s.potongan_hutang).toLocaleString('id-ID')}</td>
            <td>${s.nomor_rekening}</td> 
            <td style="font-weight: 700; color: #16a34a;">Rp ${totalBersih.toLocaleString('id-ID')}</td> 
            ${actionTd} 
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('search-gaji').addEventListener('input', () => applyPayrollFilters());

function siapkanEdit(id) {
    const data = globalSlipData.find(s => s.id === id);
    if (!data) return;
    editId = id; 
    document.getElementById('slip-userid').value = data.userId;
    document.getElementById('slip-periode').value = data.periode_bulan;
    document.getElementById('slip-gaji').value = data.gaji_pokok;
    document.getElementById('slip-bonus').value = data.bonus;
    document.getElementById('slip-potongan').value = data.potongan_hutang;
    document.getElementById('slip-rekening').value = data.nomor_rekening;

    const btnSubmit = document.querySelector('#slip-form button[type="submit"]');
    btnSubmit.innerText = 'Update Data Gaji';
    btnSubmit.style.background = '#f59e0b'; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('slip-form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        userId: document.getElementById('slip-userid').value,
        periode_bulan: document.getElementById('slip-periode').value,
        gaji_pokok: document.getElementById('slip-gaji').value,
        bonus: document.getElementById('slip-bonus').value || 0,
        potongan_hutang: document.getElementById('slip-potongan').value || 0,
        nomor_rekening: document.getElementById('slip-rekening').value
    };
    const url = editId ? `${API_URL}/slip-gaji/${editId}` : `${API_URL}/slip-gaji`;
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
    });

    if (res.ok) { 
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data slip penggajian diperbarui!', timer: 1200, showConfirmButton: false });
        document.getElementById('slip-form').reset();
        editId = null; 
        const btnSubmit = document.querySelector('#slip-form button[type="submit"]');
        btnSubmit.innerText = 'Simpan Data Gaji';
        btnSubmit.style.background = 'var(--primary)';
        loadDataGaji(); 
    }
};

async function hapusGaji(id) {
    Swal.fire({
        title: 'Hapus Slip Gaji?',
        text: "Tindakan ini permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${API_URL}/slip-gaji/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            loadDataGaji();
        }
    });
}

// ==================== FITUR ABSENSI DENGAN FILTER & REKAP CARD ====================
document.getElementById('btn-do-absen').onclick = async () => {
    try {
        const res = await fetch(`${API_URL}/absensi`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Berhasil', text: data.message });
            loadDataAbsensi();
        } else {
            Swal.fire({ icon: 'warning', title: 'Gagal Absen', text: data.message });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghubungi server absensi.' });
    }
};

async function loadDataAbsensi() {
    try {
        const res = await fetch(`${API_URL}/absensi`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await res.json();
        globalAbsensiData = result.data || [];

        // --- LOGIKA DROPDOWN ABSENSI OTOMATIS ---
        const selectAbsen = document.getElementById('filter-bulan-absen');
        const currentValue = selectAbsen.value;
        selectAbsen.innerHTML = '<option value="ALL">Semua Bulan</option>';

        // Potong tanggal '2026-05-17' jadi '2026-05' aja, terus buang yang dobel
        const uniqueMonths = [...new Set(globalAbsensiData.map(a => a.tanggal.substring(0, 7)))];
        
        // Bikin list dropdownnya
        uniqueMonths.forEach(bulan => {
            selectAbsen.innerHTML += `<option value="${bulan}">${bulan}</option>`;
        });

        // Setel otomatis ke bulan berjalan jika baru pertama kali load
        const bulanIni = new Date().toISOString().substring(0, 7); // Output: "2026-05"
        if (currentValue === '2026-05' && uniqueMonths.includes(bulanIni)) {
            selectAbsen.value = bulanIni;
        } else if (currentValue !== 'ALL' && uniqueMonths.includes(currentValue)) {
            selectAbsen.value = currentValue;
        }

        applyAbsensiFilters();
    } catch(err){}
}

function applyAbsensiFilters() {
    const filterBulan = document.getElementById('filter-bulan-absen').value;
    const role = localStorage.getItem('role');
    const hariIniStr = new Date().toISOString().split('T')[0];
    
    // 1. Saring Data Berdasarkan Bulan Terpilih
    const filtered = globalAbsensiData.filter(a => {
        return (filterBulan === 'ALL' || a.tanggal.startsWith(filterBulan));
    });

    // 2. Logika Summary Card Dinamis (HRD vs Karyawan)
    const titleTotalHadir = document.querySelector('.attendance-card span');
    const valueTotalHadir = document.getElementById('sum-total-hadir');

    if (role === 'HRD') {
        // Mode HRD: Pantau jumlah ORANG yang hadir HARI INI
        titleTotalHadir.innerText = "Pegawai Hadir (Hari Ini)";
        const hadirHariIni = globalAbsensiData.filter(a => a.tanggal === hariIniStr && a.status === 'Hadir').length;
        valueTotalHadir.innerText = `${hadirHariIni} Orang`;
    } else {
        // Mode Karyawan: Pantau jumlah HARI kerjanya di BULAN INI
        titleTotalHadir.innerText = "Total Kehadiran (Bulan Ini)";
        const hadirBulanIni = filtered.filter(a => a.status === 'Hadir').length;
        valueTotalHadir.innerText = `${hadirBulanIni} Hari`;
    }

    // Cek status hari ini untuk user aktif 
    const sudahAbsenHariIni = globalAbsensiData.some(a => a.tanggal === hariIniStr && (a.User ? a.User.nama_pegawai : localStorage.getItem('nama_pegawai')) === localStorage.getItem('nama_pegawai'));
    
    const txtStatus = document.getElementById('sum-status-hari-ini');
    if (sudahAbsenHariIni) {
        txtStatus.innerText = "Sudah Hadir";
        txtStatus.style.color = "var(--success)";
    } else {
        txtStatus.innerText = "Belum Absen";
        txtStatus.style.color = "var(--danger)";
    }

    // 3. Render ke HTML Tabel
    const tbody = document.getElementById('tbody-absensi');
    tbody.innerHTML = '';

    filtered.forEach(a => {
        const nama = a.User ? a.User.nama_pegawai : localStorage.getItem('nama_pegawai');
        const jamLog = new Date(a.createdAt).toLocaleTimeString('id-ID');
        tbody.innerHTML += `
            <tr>
                <td><strong>${nama}</strong></td>
                <td>${a.tanggal}</td>
                <td><span style="background:#d1fae5; color:#065f46; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px;">${a.status}</span></td>
                <td>${jamLog} WIB</td>
            </tr>
        `;
    });
}