// App.js
import { useState, useEffect, useCallback } from "react";
import { 
  FaHome, FaChartBar, FaList, FaUserPlus, FaHistory, 
  FaUsers, FaSignOutAlt, FaMoneyBill, FaShoppingBasket,
  FaUserCircle, FaSearch, FaEdit, FaTrash, FaFileExport,
  FaPrint, FaFilter, FaCalendarAlt, FaBoxOpen, FaCheck, 
  FaTimes, FaHandHoldingUsd, FaClock, FaMapMarkerAlt,
  FaPlus, FaMinus, FaTshirt, FaUtensils, FaShoppingCart
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ================= UTILITIES =================
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// ================= MAIN COMPONENT =================
export default function App() {
  // ================= STATE MANAGEMENT =================
  const [page, setPage] = useState("login");
  const [user, setUser] = useLocalStorage("user", null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState("");
  
  // Data Master
  const [dana, setDana] = useLocalStorage("dana", 50000000);
  const [bahanPokok, setBahanPokok] = useLocalStorage("bahanPokok", []);
  const [warga, setWarga] = useLocalStorage("warga", []);
  const [riwayatLogin, setRiwayatLogin] = useLocalStorage("riwayatLogin", []);
  const [riwayatDana, setRiwayatDana] = useLocalStorage("riwayatDana", []);
  const [distribusi, setDistribusi] = useLocalStorage("distribusi", []);
  const [pengajuanDana, setPengajuanDana] = useLocalStorage("pengajuanDana", []);
  const [antrian, setAntrian] = useLocalStorage("antrian", []);
  
  const [petugas, setPetugas] = useLocalStorage("petugas", [
    { id: 1, username: "admin", password: "admin123", nama: "Administrator", role: "admin" },
    { id: 2, username: "petugas1", password: "petugas1", nama: "Budi Santoso", role: "petugas" }
  ]);

  // Form States
  const [formWarga, setFormWarga] = useState({
    nama: "", nik: "", jumlahKeluarga: 1, 
    penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
    status: "calon", catatan: "",
    alamat: {
      rt: "", rw: "", jalan: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: ""
    }
  });
  
  const [formBantuan, setFormBantuan] = useState({
    jenis: "", jumlah: 0, satuan: "", penerima: "", tanggal: new Date().toISOString().split('T')[0]
  });

  const [formPengajuan, setFormPengajuan] = useState({
    jumlah: 0,
    tujuan: "",
    kebutuhan: "",
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear()
  });

  const [formAntrian, setFormAntrian] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    penerima: []
  });

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "", password: "", confirmPassword: "", nama: "", role: "petugas"
  });

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarga, setSelectedWarga] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [currentDate] = useState(new Date().toLocaleDateString('id-ID'));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [danaForm, setDanaForm] = useState({
    jenis: "pemasukan",
    jumlah: 0,
    keterangan: ""
  });

  // Daftar pekerjaan
  const pekerjaanOptions = [
    { value: "buruh_tani", label: "Buruh Tani" },
    { value: "nelayan", label: "Nelayan" },
    { value: "buruh_bangunan", label: "Buruh Bangunan" },
    { value: "pekerja_serabutan", label: "Pekerja Serabutan" },
    { value: "pemulung", label: "Pemulung" },
    { value: "pedagang_kecil", label: "Pedagang Kecil" },
    { value: "lainnya", label: "Lainnya" }
  ];

  // Kategori bahan pokok
  const kategoriBahan = [
    { id: "pakaian", label: "Pakaian", icon: <FaTshirt />, color: "#3498db" },
    { id: "makanan", label: "Makanan", icon: <FaUtensils />, color: "#2ecc71" },
    { id: "bahan_pokok", label: "Bahan Pokok", icon: <FaShoppingCart />, color: "#f39c12" }
  ];

  // Animasi halaman
  useEffect(() => {
    setActivePage(page);
  }, [page]);

  // ================= CORE FUNCTIONS =================
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const foundUser = petugas.find(p => 
        p.username === loginForm.username && p.password === loginForm.password
      );
      
      if (foundUser) {
        setUser(foundUser);
        setPage("dashboard");
        setLoginForm({ username: "", password: "" });
        
        const newLogin = {
          userId: foundUser.id,
          username: foundUser.username,
          nama: foundUser.nama,
          waktu: new Date().toLocaleString(),
          ip: "192.168.1.1"
        };
        
        setRiwayatLogin(prev => [newLogin, ...prev]);
        toast.success(`Selamat datang, ${foundUser.nama}!`);
      } else {
        toast.error("Username atau password salah!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loginForm, petugas, setUser, setRiwayatLogin]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (registerForm.password !== registerForm.confirmPassword) {
        toast.error("Password dan konfirmasi password tidak cocok!");
        return;
      }
      
      if (petugas.some(p => p.username === registerForm.username)) {
        toast.error("Username sudah digunakan!");
        return;
      }
      
      if (registerForm.role === "admin" && user?.role !== "admin") {
        toast.error("Hanya admin yang bisa mendaftarkan admin baru!");
        return;
      }
      
      const newUser = {
        id: Date.now(),
        username: registerForm.username,
        password: registerForm.password,
        nama: registerForm.nama,
        role: registerForm.role
      };
      
      setPetugas(prev => [...prev, newUser]);
      toast.success("Registrasi berhasil! Silakan login");
      setPage("login");
      setRegisterForm({
        username: "", password: "", confirmPassword: "", nama: "", role: "petugas"
      });
    } catch (error) {
      toast.error("Terjadi kesalahan saat registrasi");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [registerForm, petugas, setPetugas, user]);

  const handleLogout = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(null);
      setPage("login");
      setIsLoading(false);
      toast.success("Logout berhasil!");
    }, 500);
  }, [setUser]);

  const tambahWarga = useCallback((e) => {
    e.preventDefault();
    
    // Validasi NIK 16 digit
    if (formWarga.nik.length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    
    // Validasi alamat
    if (!formWarga.alamat.rt || !formWarga.alamat.rw || !formWarga.alamat.jalan) {
      toast.error("RT, RW, dan Jalan harus diisi");
      return;
    }
    
    const pekerjaanDisplay = formWarga.pekerjaan === "lainnya" 
      ? formWarga.pekerjaanLain 
      : pekerjaanOptions.find(p => p.value === formWarga.pekerjaan)?.label;
    
    const newWarga = {
      ...formWarga,
      id: Date.now(),
      tanggalDaftar: currentDate,
      status: "calon",
      pekerjaanDisplay
    };
    
    setWarga(prev => [...prev, newWarga]);
    setFormWarga({
      nama: "", nik: "", jumlahKeluarga: 1, 
      penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
      status: "calon", catatan: "",
      alamat: {
        rt: "", rw: "", jalan: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: ""
      }
    });
    
    setShowModal(false);
    toast.success("Data warga berhasil ditambahkan!");
  }, [formWarga, currentDate, setWarga, pekerjaanOptions]);

  const updateWargaStatus = useCallback((id, newStatus) => {
    setWarga(prev => prev.map(w => 
      w.id === id ? { ...w, status: newStatus } : w
    ));
    toast.info(`Status warga diperbarui menjadi ${newStatus}`);
  }, [setWarga]);

  const hapusWarga = useCallback((id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data warga ini?")) {
      setWarga(prev => prev.filter(w => w.id !== id));
      toast.success("Data warga berhasil dihapus");
    }
  }, [setWarga]);

  // Fungsi untuk mengambil data bahan pokok dari backend pemerintah (simulasi)
  const fetchBahanPokok = useCallback(() => {
    // Simulasi data dari backend
    const dataBackend = [
      { id: 1, nama: "Beras", kategori: "bahan_pokok", satuan: "kg", stok: 1000 },
      { id: 2, nama: "Minyak Goreng", kategori: "bahan_pokok", satuan: "liter", stok: 500 },
      { id: 3, nama: "Gula", kategori: "bahan_pokok", satuan: "kg", stok: 300 },
      { id: 4, nama: "Telur", kategori: "bahan_pokok", satuan: "kg", stok: 200 },
      { id: 5, nama: "Daging Ayam", kategori: "makanan", satuan: "kg", stok: 150 },
      { id: 6, nama: "Susu", kategori: "makanan", satuan: "liter", stok: 200 },
      { id: 7, nama: "Kaos", kategori: "pakaian", satuan: "buah", stok: 300 },
      { id: 8, nama: "Celana", kategori: "pakaian", satuan: "buah", stok: 200 }
    ];
    
    setBahanPokok(dataBackend);
  }, [setBahanPokok]);

  useEffect(() => {
    // Ambil data bahan pokok saat pertama kali load
    if (bahanPokok.length === 0) {
      fetchBahanPokok();
    }
  }, [bahanPokok, fetchBahanPokok]);

  const tambahBantuan = useCallback((e) => {
    e.preventDefault();
    
    // Validasi penerima
    const penerimaWarga = warga.find(w => w.id === parseInt(formBantuan.penerima));
    if (!penerimaWarga) {
      toast.error("Penerima tidak ditemukan");
      return;
    }
    
    // Validasi bahan pokok
    const bahan = bahanPokok.find(b => b.id === parseInt(formBantuan.jenis));
    if (!bahan) {
      toast.error("Bahan pokok tidak ditemukan");
      return;
    }
    
    // Validasi stok
    if (bahan.stok < formBantuan.jumlah) {
      toast.error(`Stok ${bahan.nama} tidak mencukupi. Stok tersedia: ${bahan.stok}`);
      return;
    }
    
    // Update stok
    const updatedBahan = bahanPokok.map(b => 
      b.id === bahan.id ? { ...b, stok: b.stok - formBantuan.jumlah } : b
    );
    setBahanPokok(updatedBahan);
    
    const newBantuan = {
      ...formBantuan,
      id: Date.now(),
      petugas: user.nama,
      tanggal: currentDate,
      namaBahan: bahan.nama,
      kategori: bahan.kategori,
      penerimaNama: penerimaWarga.nama
    };
    
    setDistribusi(prev => [...prev, newBantuan]);
    setFormBantuan({
      jenis: "", jumlah: 0, satuan: "", penerima: "", tanggal: new Date().toISOString().split('T')[0]
    });
    
    toast.success("Distribusi bantuan berhasil dicatat!");
  }, [formBantuan, currentDate, user, setDistribusi, bahanPokok, setBahanPokok, warga]);

  const ajukanDana = useCallback((e) => {
    e.preventDefault();
    
    if (formPengajuan.jumlah <= 0) {
      toast.error("Jumlah pengajuan harus lebih dari 0");
      return;
    }
    
    const newPengajuan = {
      id: Date.now(),
      ...formPengajuan,
      status: "diproses",
      tanggal: currentDate,
      petugas: user.nama
    };
    
    setPengajuanDana(prev => [...prev, newPengajuan]);
    setFormPengajuan({
      jumlah: 0,
      tujuan: "",
      kebutuhan: "",
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear()
    });
    
    toast.success("Pengajuan dana berhasil dikirim!");
  }, [formPengajuan, currentDate, user, setPengajuanDana]);

  const kelolaDana = useCallback((e) => {
    e.preventDefault();
    
    if (danaForm.jumlah <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      jenis: danaForm.jenis,
      jumlah: parseInt(danaForm.jumlah),
      keterangan: danaForm.keterangan,
      tanggal: currentDate,
      petugas: user.nama
    };
    
    setRiwayatDana(prev => [newTransaction, ...prev]);
    
    // Update dana
    if (danaForm.jenis === "pemasukan") {
      setDana(prev => prev + parseInt(danaForm.jumlah));
    } else {
      setDana(prev => prev - parseInt(danaForm.jumlah));
    }
    
    setDanaForm({
      jenis: "pemasukan",
      jumlah: 0,
      keterangan: ""
    });
    
    toast.success(`Transaksi dana ${danaForm.jenis} berhasil dicatat`);
  }, [danaForm, currentDate, user, setRiwayatDana, setDana]);

  const tambahKeAntrian = useCallback(() => {
    // Cek apakah bulan/tahun sudah ada di antrian
    const existingAntrian = antrian.find(a => 
      a.bulan === formAntrian.bulan && a.tahun === formAntrian.tahun
    );
    
    if (existingAntrian) {
      toast.error("Antrian untuk bulan ini sudah ada");
      return;
    }
    
    // Batasi 33 penerima per bulan
    if (formAntrian.penerima.length > 33) {
      toast.error("Maksimal 33 penerima per bulan");
      return;
    }
    
    const newAntrian = {
      id: Date.now(),
      ...formAntrian,
      tanggalDibuat: currentDate,
      petugas: user.nama
    };
    
    setAntrian(prev => [...prev, newAntrian]);
    setFormAntrian({
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
      penerima: []
    });
    
    toast.success("Antrian baru berhasil dibuat!");
  }, [formAntrian, antrian, currentDate, user, setAntrian]);

  const tambahPenerimaKeAntrian = useCallback((wargaId) => {
    // Cek apakah warga sudah ada di antrian bulan ini
    if (formAntrian.penerima.includes(wargaId)) {
      toast.error("Warga sudah ada dalam antrian bulan ini");
      return;
    }
    
    // Batasi 33 penerima
    if (formAntrian.penerima.length >= 33) {
      toast.error("Sudah mencapai batas 33 penerima per bulan");
      return;
    }
    
    setFormAntrian(prev => ({
      ...prev,
      penerima: [...prev.penerima, wargaId]
    }));
  }, [formAntrian]);

  const hapusPenerimaDariAntrian = useCallback((wargaId) => {
    setFormAntrian(prev => ({
      ...prev,
      penerima: prev.penerima.filter(id => id !== wargaId)
    }));
  }, [formAntrian]);

  // Hitung jumlah penerima per bulan
  const hitungPenerimaPerBulan = useCallback(() => {
    const result = {};
    antrian.forEach(item => {
      const key = `${item.bulan}/${item.tahun}`;
      result[key] = item.penerima.length;
    });
    return result;
  }, [antrian]);

  // ================= RENDER COMPONENTS =================
  if (!user && page === "login") {
    return (
      <div className="auth-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="auth-card">
          <div className="auth-header">
            <FaBoxOpen className="auth-logo" />
            <h1>SISTEM DISTRIBUSI BANSOS</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Belum punya akun? <span onClick={() => setPage("register")}>Daftar disini</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (!user && page === "register") {
    return (
      <div className="auth-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="auth-card">
          <div className="auth-header">
            <FaUserPlus className="auth-logo" />
            <h1>REGISTRASI PETUGAS</h1>
          </div>
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  name="nama"
                  value={registerForm.nama}
                  onChange={(e) => setRegisterForm({...registerForm, nama: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>
            {user?.role === "admin" && (
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                >
                  <option value="petugas">Petugas</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Sudah punya akun? <span onClick={() => setPage("login")}>Login disini</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="sidebar">
        <div className="sidebar-header">
          <FaBoxOpen className="sidebar-logo" />
          <h2>BANSOS DIGITAL</h2>
        </div>
        <div className="sidebar-menu">
          <div className={`menu-item ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
            <FaHome className="menu-icon" />
            <span>Dashboard</span>
          </div>
          <div className={`menu-item ${page === "warga" ? "active" : ""}`} onClick={() => setPage("warga")}>
            <FaUsers className="menu-icon" />
            <span>Data Warga</span>
          </div>
          <div className={`menu-item ${page === "antrian" ? "active" : ""}`} onClick={() => setPage("antrian")}>
            <FaClock className="menu-icon" />
            <span>Antrian Bansos</span>
          </div>
          <div className={`menu-item ${page === "distribusi" ? "active" : ""}`} onClick={() => setPage("distribusi")}>
            <FaShoppingBasket className="menu-icon" />
            <span>Distribusi</span>
          </div>
          <div className={`menu-item ${page === "dana" ? "active" : ""}`} onClick={() => setPage("dana")}>
            <FaMoneyBill className="menu-icon" />
            <span>Kelola Dana</span>
          </div>
          <div className={`menu-item ${page === "pengajuan" ? "active" : ""}`} onClick={() => setPage("pengajuan")}>
            <FaHandHoldingUsd className="menu-icon" />
            <span>Pengajuan Dana</span>
          </div>
          <div className={`menu-item ${page === "laporan" ? "active" : ""}`} onClick={() => setPage("laporan")}>
            <FaFileExport className="menu-icon" />
            <span>Laporan</span>
          </div>
          {user?.role === "admin" && (
            <div className={`menu-item ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>
              <FaUserPlus className="menu-icon" />
              <span>Admin</span>
            </div>
          )}
        </div>
        <div className="sidebar-footer">
          <div className="menu-item" onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="content-header">
          <h1>
            {{
              dashboard: "Dashboard Utama",
              warga: "Manajemen Warga Penerima",
              antrian: "Antrian Bansos",
              distribusi: "Distribusi Bantuan",
              dana: "Manajemen Dana Bantuan",
              pengajuan: "Pengajuan Dana",
              laporan: "Laporan dan Statistik",
              admin: "Administrasi Sistem"
            }[page]}
          </h1>
          <div className="user-profile">
            <span>{user.nama} ({user.role})</span>
            <div className="avatar">
              <FaUserCircle />
            </div>
          </div>
        </div>
        <div className={`content-body ${activePage !== page ? "page-exit" : "page-enter"}`}>
          
          {/* Dashboard Content */}
          {page === "dashboard" && (
            <div className="dashboard-grid">
              <div className="welcome-card">
                <h2>Selamat Datang, {user.nama}!</h2>
                <p>Sistem Distribusi Bantuan Sosial Kelurahan</p>
                <div className="welcome-stats">
                  <div className="stat-item">
                    <FaUsers />
                    <span>{warga.length} Warga Terdaftar</span>
                  </div>
                  <div className="stat-item">
                    <FaClock />
                    <span>{antrian.length} Antrian Aktif</span>
                  </div>
                  <div className="stat-item">
                    <FaHistory />
                    <span>{riwayatLogin.length} Riwayat Login</span>
                  </div>
                </div>
              </div>
              
              <div className="recent-activity">
                <div className="activity-card">
                  <h3>Antrian Terdekat</h3>
                  <ul>
                    {antrian.slice(0, 3).map((item, i) => (
                      <li key={i}>
                        <span>Antrian {item.bulan}/{item.tahun}</span>
                        <small>{item.penerima.length} Penerima</small>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="activity-card">
                  <h3>Riwayat Login Terakhir</h3>
                  <ul>
                    {riwayatLogin.slice(0, 5).map((log, i) => (
                      <li key={i}>
                        <span>{log.nama}</span>
                        <small>{log.waktu}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Warga Management */}
          {page === "warga" && (
            <div className="data-container">
              <div className="data-toolbar">
                <div className="search-box">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Cari warga..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="semua">Semua Status</option>
                  <option value="calon">Calon Penerima</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="menerima">Sudah Menerima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                  <FaUserPlus /> Tambah Warga
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>NIK</th>
                      <th>Alamat</th>
                      <th>Pekerjaan</th>
                      <th>Penghasilan</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warga
                      .filter(w => 
                        w.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (filterStatus === "semua" || w.status === filterStatus)
                      )
                      .map(w => (
                        <tr key={w.id}>
                          <td>{w.nama}</td>
                          <td>{w.nik}</td>
                          <td>{w.alamat.jalan}, RT {w.alamat.rt}/RW {w.alamat.rw}</td>
                          <td>{w.pekerjaanDisplay}</td>
                          <td>Rp {w.penghasilan.toLocaleString('id-ID')}</td>
                          <td>
                            <span className={`status-badge ${w.status}`}>
                              {w.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-icon success"
                              onClick={() => updateWargaStatus(w.id, "disetujui")}
                              disabled={w.status === "disetujui"}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn-icon danger"
                              onClick={() => updateWargaStatus(w.id, "ditolak")}
                              disabled={w.status === "ditolak"}
                            >
                              <FaTimes />
                            </button>
                            <button 
                              className="btn-icon danger"
                              onClick={() => hapusWarga(w.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Antrian Bansos */}
          {page === "antrian" && (
            <div className="data-container">
              <div className="antrian-header">
                <h2>Manajemen Antrian Bansos</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bulan</label>
                    <select
                      value={formAntrian.bulan}
                      onChange={(e) => setFormAntrian({...formAntrian, bulan: parseInt(e.target.value)})}
                    >
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tahun</label>
                    <select
                      value={formAntrian.tahun}
                      onChange={(e) => setFormAntrian({...formAntrian, tahun: parseInt(e.target.value)})}
                    >
                      {Array.from({length: 5}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <button 
                      className="btn-primary" 
                      onClick={tambahKeAntrian}
                      disabled={formAntrian.penerima.length === 0}
                    >
                      <FaPlus /> Buat Antrian
                    </button>
                  </div>
                </div>
                <div className="penerima-info">
                  <span>Jumlah Penerima: <strong>{formAntrian.penerima.length}/33</strong></span>
                </div>
              </div>
              
              <div className="antrian-container">
                <div className="warga-list">
                  <h3>Daftar Warga Disetujui</h3>
                  <div className="search-box">
                    <FaSearch />
                    <input 
                      type="text" 
                      placeholder="Cari warga..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ul>
                    {warga
                      .filter(w => 
                        w.status === "disetujui" &&
                        w.nama.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(w => (
                        <li 
                          key={w.id} 
                          className={formAntrian.penerima.includes(w.id) ? "selected" : ""}
                        >
                          <div>
                            <strong>{w.nama}</strong>
                            <p>NIK: {w.nik}</p>
                            <p>{w.alamat.jalan}, RT {w.alamat.rt}/RW {w.alamat.rw}</p>
                          </div>
                          {formAntrian.penerima.includes(w.id) ? (
                            <button 
                              className="btn-icon danger"
                              onClick={() => hapusPenerimaDariAntrian(w.id)}
                            >
                              <FaTimes />
                            </button>
                          ) : (
                            <button 
                              className="btn-icon success"
                              onClick={() => tambahPenerimaKeAntrian(w.id)}
                              disabled={formAntrian.penerima.length >= 33}
                            >
                              <FaPlus />
                            </button>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div className="antrian-list">
                  <h3>Penerima Bulan Ini</h3>
                  {formAntrian.penerima.length === 0 ? (
                    <div className="empty-state">
                      <p>Belum ada penerima untuk bulan ini</p>
                      <small>Pilih warga dari daftar disamping</small>
                    </div>
                  ) : (
                    <ul>
                      {formAntrian.penerima.map(id => {
                        const wargaItem = warga.find(w => w.id === id);
                        return wargaItem ? (
                          <li key={id}>
                            <div>
                              <strong>{wargaItem.nama}</strong>
                              <p>NIK: {wargaItem.nik}</p>
                              <p>{wargaItem.alamat.jalan}, RT {wargaItem.alamat.rt}/RW {wargaItem.alamat.rw}</p>
                            </div>
                            <button 
                              className="btn-icon danger"
                              onClick={() => hapusPenerimaDariAntrian(id)}
                            >
                              <FaTimes />
                            </button>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="antrian-history">
                <h3>Riwayat Antrian</h3>
                <div className="history-grid">
                  {antrian.map(item => (
                    <div key={item.id} className="history-item">
                      <div className="history-header">
                        <h4>Antrian {item.bulan}/{item.tahun}</h4>
                        <span>{item.penerima.length} Penerima</span>
                      </div>
                      <div className="history-date">
                        Dibuat: {item.tanggalDibuat} oleh {item.petugas}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Distribusi Bahan Pokok */}
          {page === "distribusi" && (
            <div className="data-container">
              <h2>Distribusi Bahan Pokok</h2>
              
              <div className="bahan-pokok-section">
                <h3>Stok Bahan Pokok</h3>
                <div className="kategori-filter">
                  {kategoriBahan.map(kategori => (
                    <div 
                      key={kategori.id} 
                      className="kategori-item"
                      style={{ borderColor: kategori.color }}
                    >
                      <div className="kategori-icon" style={{ color: kategori.color }}>
                        {kategori.icon}
                      </div>
                      <span>{kategori.label}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bahan-grid">
                  {bahanPokok.map(bahan => (
                    <div 
                      key={bahan.id} 
                      className="bahan-item"
                      style={{ 
                        borderLeft: `4px solid ${kategoriBahan.find(k => k.id === bahan.kategori)?.color || '#3498db'}` 
                      }}
                    >
                      <div className="bahan-header">
                        <h4>{bahan.nama}</h4>
                        <span>{bahan.stok} {bahan.satuan}</span>
                      </div>
                      <div className="bahan-kategori">
                        {kategoriBahan.find(k => k.id === bahan.kategori)?.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="distribusi-form-section">
                <h3>Form Distribusi Bantuan</h3>
                <form onSubmit={tambahBantuan}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bahan Pokok</label>
                      <select
                        value={formBantuan.jenis}
                        onChange={(e) => {
                          const selectedBahan = bahanPokok.find(b => b.id === parseInt(e.target.value));
                          setFormBantuan({
                            ...formBantuan,
                            jenis: e.target.value,
                            satuan: selectedBahan ? selectedBahan.satuan : ""
                          });
                        }}
                        required
                      >
                        <option value="">Pilih Bahan Pokok</option>
                        {bahanPokok.map(bahan => (
                          <option key={bahan.id} value={bahan.id}>
                            {bahan.nama} ({bahan.stok} {bahan.satuan})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Jumlah</label>
                      <input
                        type="number"
                        min="1"
                        value={formBantuan.jumlah}
                        onChange={(e) => setFormBantuan({...formBantuan, jumlah: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Satuan</label>
                      <input
                        type="text"
                        value={formBantuan.satuan}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Penerima</label>
                      <select
                        value={formBantuan.penerima}
                        onChange={(e) => setFormBantuan({...formBantuan, penerima: e.target.value})}
                        required
                      >
                        <option value="">Pilih Penerima</option>
                        {warga
                          .filter(w => w.status === "disetujui")
                          .map(w => (
                            <option key={w.id} value={w.id}>
                              {w.nama} (NIK: {w.nik})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tanggal Distribusi</label>
                      <input
                        type="date"
                        value={formBantuan.tanggal}
                        onChange={(e) => setFormBantuan({...formBantuan, tanggal: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-footer">
                    <button type="submit" className="btn-primary">
                      <FaShoppingBasket /> Catat Distribusi
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="distribusi-history">
                <h3>Riwayat Distribusi</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Bahan</th>
                      <th>Kategori</th>
                      <th>Jumlah</th>
                      <th>Penerima</th>
                      <th>Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distribusi.map(d => (
                      <tr key={d.id}>
                        <td>{d.tanggal}</td>
                        <td>{d.namaBahan}</td>
                        <td>
                          <span className="bahan-kategori">
                            {kategoriBahan.find(k => k.id === d.kategori)?.label}
                          </span>
                        </td>
                        <td>{d.jumlah} {d.satuan}</td>
                        <td>{d.penerimaNama}</td>
                        <td>{d.petugas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Pengajuan Dana */}
          {page === "pengajuan" && (
            <div className="data-container">
              <div className="form-section">
                <h2>Ajukan Dana ke Pemerintah</h2>
                <form onSubmit={ajukanDana}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Jumlah Pengajuan (Rp)</label>
                      <input
                        type="number"
                        min="0"
                        value={formPengajuan.jumlah}
                        onChange={(e) => setFormPengajuan({...formPengajuan, jumlah: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Bulan</label>
                      <select
                        value={formPengajuan.bulan}
                        onChange={(e) => setFormPengajuan({...formPengajuan, bulan: parseInt(e.target.value)})}
                      >
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>
                            {new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tahun</label>
                      <input
                        type="number"
                        min={new Date().getFullYear()}
                        value={formPengajuan.tahun}
                        onChange={(e) => setFormPengajuan({...formPengajuan, tahun: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tujuan Pengajuan</label>
                    <input
                      type="text"
                      value={formPengajuan.tujuan}
                      onChange={(e) => setFormPengajuan({...formPengajuan, tujuan: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kebutuhan Masyarakat</label>
                    <textarea
                      value={formPengajuan.kebutuhan}
                      onChange={(e) => setFormPengajuan({...formPengajuan, kebutuhan: e.target.value})}
                      required
                      rows={4}
                    />
                  </div>
                  <div className="form-footer">
                    <button type="submit" className="btn-primary">
                      Ajukan Dana
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="pengajuan-history">
                <h3>Riwayat Pengajuan</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Jumlah</th>
                      <th>Bulan/Tahun</th>
                      <th>Status</th>
                      <th>Tujuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengajuanDana.map(item => (
                      <tr key={item.id}>
                        <td>{item.tanggal}</td>
                        <td>Rp {item.jumlah.toLocaleString('id-ID')}</td>
                        <td>{item.bulan}/{item.tahun}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.tujuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Kelola Dana */}
          {page === "dana" && (
            <div className="data-container">
              <div className="finance-header">
                <h2>Kelola Dana Bantuan Sosial</h2>
                <div className="finance-summary">
                  <div className="finance-card">
                    <h3>Saldo Saat Ini</h3>
                    <p>Rp {dana.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="finance-card">
                    <h3>Total Pemasukan</h3>
                    <p>Rp {riwayatDana.filter(d => d.jenis === "pemasukan").reduce((sum, d) => sum + d.jumlah, 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="finance-card">
                    <h3>Total Pengeluaran</h3>
                    <p>Rp {riwayatDana.filter(d => d.jenis === "pengeluaran").reduce((sum, d) => sum + d.jumlah, 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Tambah Transaksi Dana</h2>
                <form onSubmit={kelolaDana}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Jenis Transaksi</label>
                      <select
                        value={danaForm.jenis}
                        onChange={(e) => setDanaForm({...danaForm, jenis: e.target.value})}
                      >
                        <option value="pemasukan">Pemasukan</option>
                        <option value="pengeluaran">Pengeluaran</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Jumlah (Rp)</label>
                      <input
                        type="number"
                        min="0"
                        value={danaForm.jumlah}
                        onChange={(e) => setDanaForm({...danaForm, jumlah: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Keterangan</label>
                    <input
                      type="text"
                      value={danaForm.keterangan}
                      onChange={(e) => setDanaForm({...danaForm, keterangan: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-footer">
                    <button type="submit" className="btn-primary">
                      Simpan Transaksi
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="riwayat-dana">
                <h3>Riwayat Transaksi Dana</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Jenis</th>
                      <th>Jumlah</th>
                      <th>Keterangan</th>
                      <th>Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatDana.map((d, i) => (
                      <tr key={i}>
                        <td>{d.tanggal}</td>
                        <td>
                          <span className={`status-badge ${d.jenis}`}>
                            {d.jenis}
                          </span>
                        </td>
                        <td>Rp {d.jumlah.toLocaleString('id-ID')}</td>
                        <td>{d.keterangan}</td>
                        <td>{d.petugas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Modal Tambah Warga */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Tambah Data Warga</h3>
                  <button onClick={() => setShowModal(false)}>&times;</button>
                </div>
                <form onSubmit={tambahWarga}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nama Lengkap *</label>
                      <input
                        type="text"
                        value={formWarga.nama}
                        onChange={(e) => setFormWarga({...formWarga, nama: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>NIK (16 digit) *</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formWarga.nik}
                        onChange={(e) => setFormWarga({...formWarga, nik: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Pekerjaan *</label>
                    <div className="form-row">
                      <select
                        value={formWarga.pekerjaan}
                        onChange={(e) => setFormWarga({...formWarga, pekerjaan: e.target.value})}
                        required
                      >
                        {pekerjaanOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formWarga.pekerjaan === "lainnya" && (
                        <input
                          type="text"
                          placeholder="Tulis pekerjaan"
                          value={formWarga.pekerjaanLain}
                          onChange={(e) => setFormWarga({...formWarga, pekerjaanLain: e.target.value})}
                          required
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Penghasilan per Bulan (Rp) *</label>
                      <input
                        type="range"
                        min="500000"
                        max="3000000"
                        step="50000"
                        value={formWarga.penghasilan}
                        onChange={(e) => setFormWarga({...formWarga, penghasilan: parseInt(e.target.value)})}
                        required
                      />
                      <div className="slider-value">
                        Rp {formWarga.penghasilan.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Jumlah Anggota Keluarga *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formWarga.jumlahKeluarga}
                        onChange={(e) => setFormWarga({...formWarga, jumlahKeluarga: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  
                  <h3 className="form-section-title">Alamat Lengkap</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>RT *</label>
                      <input
                        type="text"
                        value={formWarga.alamat.rt}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, rt: e.target.value}
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>RW *</label>
                      <input
                        type="text"
                        value={formWarga.alamat.rw}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, rw: e.target.value}
                        })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Jalan *</label>
                    <input
                      type="text"
                      value={formWarga.alamat.jalan}
                      onChange={(e) => setFormWarga({
                        ...formWarga, 
                        alamat: {...formWarga.alamat, jalan: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kelurahan</label>
                      <input
                        type="text"
                        value={formWarga.alamat.kelurahan}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, kelurahan: e.target.value}
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Kecamatan</label>
                      <input
                        type="text"
                        value={formWarga.alamat.kecamatan}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, kecamatan: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kabupaten/Kota</label>
                      <input
                        type="text"
                        value={formWarga.alamat.kabupaten}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, kabupaten: e.target.value}
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Provinsi</label>
                      <input
                        type="text"
                        value={formWarga.alamat.provinsi}
                        onChange={(e) => setFormWarga({
                          ...formWarga, 
                          alamat: {...formWarga.alamat, provinsi: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn-primary">
                      Simpan Data Warga
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}