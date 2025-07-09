import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaHome, FaChartBar, FaList, FaUserPlus, FaHistory,
  FaUsers, FaSignOutAlt, FaMoneyBill, FaShoppingBasket,
  FaUserCircle, FaSearch, FaEdit, FaTrash, FaFileExport,
  FaPrint, FaFilter, FaCalendarAlt, FaBoxOpen, FaCheck,
  FaTimes, FaHandHoldingUsd, FaClock, FaMapMarkerAlt,
  FaPlus, FaMinus, FaTshirt, FaUtensils, FaShoppingCart,
  FaEye, FaRedo, FaFileCsv, FaPills, FaExclamationTriangle,
  FaSort, FaSortUp, FaSortDown, FaRandom, FaUserEdit,
  FaIdCard, FaDatabase, FaAddressCard, FaEllipsisH,
  FaBars
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom hook untuk menyimpan user ke localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error("Error membaca dari localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error menulis ke localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
};

// Fungsi utilitas untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

// Fungsi utilitas untuk format waktu
const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });
};

// Fungsi utilitas untuk format mata uang
const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// --- Komponen AuthContainer (Login dan Registrasi) ---
const AuthContainer = ({ onLoginSuccess, onRegisterSuccess, mode }) => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nama: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAuthMode, setCurrentAuthMode] = useState(mode); // 'login' or 'register'

  useEffect(() => {
    setCurrentAuthMode(mode);
  }, [mode]);

  const API_BASE_URL = "http://localhost:5000"; // Sesuaikan dengan Base URL backend Anda!

  const callApi = useCallback(async (url, method = 'GET', body = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error(`Kesalahan Panggilan API (${method} ${url}):`, error);
      throw error;
    }
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const responseData = await callApi('/api/auth/login', 'POST', loginForm);
      const { user: loggedInUser, token } = responseData;
      onLoginSuccess({ ...loggedInUser, nama: loggedInUser.username, token });
      setLoginForm({ username: "", password: "" });
      toast.success(`Selamat datang, ${loggedInUser.username}!`);
    } catch (error) {
      toast.error(`Login gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [loginForm, onLoginSuccess, callApi]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok!");
      return;
    }
    setIsLoading(true);
    try {
      const dataToRegister = {
        username: registerForm.username,
        password: registerForm.password,
        role: "petugas"
      };
      const response = await callApi('/api/auth/register', 'POST', dataToRegister);
      toast.success(response.message || "Registrasi berhasil! Silakan login.");
      setRegisterForm({ username: "", password: "", confirmPassword: "", nama: "" });
      onRegisterSuccess(); // Panggil fungsi dari App.js untuk kembali ke login
    } catch (error) {
      toast.error(`Registrasi gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [registerForm, onRegisterSuccess, callApi]);

  return (
    <div className="auth-container">
      {currentAuthMode === "register" ? (
        <div className="auth-card">
          <div className="auth-header">
            <FaUserPlus className="auth-logo" />
            <h1>REGISTRASI PETUGAS</h1>
            <p>Daftarkan akun baru untuk petugas</p>
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
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Sudah punya akun? <span onClick={() => setCurrentAuthMode("login")}>Login disini</span></p>
          </div>
        </div>
      ) : (
        <div className="auth-card">
          <div className="auth-header">
            <FaBoxOpen className="auth-logo" />
            <h1>SISTEM DISTRIBUSI BANSOS</h1>
            <p>Kelurahan Bahagia Makmur</p>
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
            <p>Belum punya akun? <span onClick={() => setCurrentAuthMode("register")}>Daftar disini</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Komponen MainAppContainer (Setelah Login) ---
const MainAppContainer = ({ user, onLogout }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard"); // State internal untuk navigasi di MainApp

  // --- States untuk Data Aplikasi (akan diisi dari API atau dummy sementara) ---
  const [dana, setDana] = useLocalStorage("dana", 10000000);
  const [bahanPokok, setBahanPokok] = useLocalStorage("bahanPokok", []);
  const [warga, setWarga] = useLocalStorage("warga", []);
  const [petugas, setPetugas] = useLocalStorage("petugas", [
    { id: 1, username: "admin", password: "admin123", nama: "Administrator", role: "admin" },
    { id: 2, username: "petugas1", password: "petugas1", nama: "Budi Santoso", role: "petugas" }
  ]);
  const [riwayatLogin, setRiwayatLogin] = useLocalStorage("riwayatLogin", []);
  const [riwayatDana, setRiwayatDana] = useLocalStorage("riwayatDana", []);
  const [distribusi, setDistribusi] = useLocalStorage("distribusi", []);
  const [pengajuanDana, setPengajuanDana] = useLocalStorage("pengajuanDana", []);
  const [antrian, setAntrian] = useLocalStorage("antrian", []);
  // --- Akhir States Data Aplikasi ---

  const [isLoading, setIsLoading] = useState(false);

  // States untuk forms
  const [formWarga, setFormWarga] = useState({
    nama: "", nik: "", jumlahKeluarga: 1,
    penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
    status: "Belum Menerima", catatan: "",
    alamat: {
      rt: "", rw: "", jalan: "", nomor: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: ""
    }
  });
  const [editingWarga, setEditingWarga] = useState(null);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [itemsPerPage] = useState(10);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states untuk modul lain (dummy/placeholder)
  const [formBantuan, setFormBantuan] = useState({
    jenis: "", jumlah: 0, satuan: "", penerima: "", tanggal: new Date().toISOString().split('T')[0],
    kategori: ""
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
  const [formTambahBahan, setFormTambahBahan] = useState({
    kategori: "",
    jenis: "",
    jumlah: 0,
    harga: 0
  });
  const [danaForm, setDanaForm] = useState({
    jenis: "pengeluaran",
    jumlah: 0,
    keterangan: ""
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeCategory, setActiveCategory] = useState("semua");

  // Options dan Data Statis
  const pekerjaanOptions = [
    { value: "buruh_tani", label: "Buruh Tani" },
    { value: "nelayan", label: "Nelayan" },
    { value: "buruh_bangunan", label: "Buruh Bangunan" },
    { value: "pekerja_serabutan", label: "Pekerja Serabutan" },
    { value: "pemulung", label: "Pemulung" },
    { value: "pedagang_kecil", label: "Pedagang Kecil" },
    { value: "lainnya", label: "Lainnya" }
  ];

  const kategoriBahan = [
    {
      id: "pakaian",
      label: "Pakaian",
      icon: <FaTshirt />,
      jenis: [
        { id: 1, nama: "Kaos", satuan: "buah", harga: 50000 },
        { id: 2, nama: "Celana", satuan: "buah", harga: 80000 },
        { id: 3, nama: "Jaket", satuan: "buah", harga: 120000 }
      ]
    },
    {
      id: "makanan",
      label: "Makanan",
      icon: <FaUtensils />,
      jenis: [
        { id: 4, nama: "Mie Instan", satuan: "dus", harga: 60000 },
        { id: 5, nama: "Susu", satuan: "kotak", harga: 50000 },
        { id: 6, nama: "Biskuit", satuan: "kaleng", harga: 40000 }
      ]
    },
    {
      id: "bahan_pokok",
      label: "Bahan Pokok",
      icon: <FaShoppingCart />,
      jenis: [
        { id: 7, nama: "Beras", satuan: "kg", harga: 12000 },
        { id: 8, nama: "Minyak Goreng", satuan: "liter", harga: 15000 },
        { id: 9, nama: "Gula", satuan: "kg", harga: 13000 },
        { id: 10, nama: "Telur", satuan: "kg", harga: 20000 }
      ]
    },
    {
      id: "kesehatan",
      label: "Kesehatan",
      icon: <FaPills />,
      jenis: [
        { id: 11, nama: "Paracetamol", satuan: "strip", harga: 5000 },
        { id: 12, nama: "Vitamin C", satuan: "botol", harga: 15000 },
        { id: 13, nama: "Masker Medis", satuan: "kotak", harga: 30000 }
      ]
    }
  ];

  // Initialize bahanPokok if empty (for dummy data)
  useEffect(() => {
    if (bahanPokok.length === 0) {
      const initialBahan = [];
      kategoriBahan.forEach(kategori => {
        kategori.jenis.forEach(jenis => {
          initialBahan.push({
            id: jenis.id,
            nama: jenis.nama,
            kategori: kategori.id,
            satuan: jenis.satuan,
            harga: jenis.harga,
            stok: Math.floor(Math.random() * 100) + 10 // Stok dummy
          });
        });
      });
      setBahanPokok(initialBahan);
    }
  }, [bahanPokok.length, setBahanPokok, kategoriBahan]);

  // --- API Configuration ---
  const API_BASE_URL = "http://localhost:5000"; // Sesuaikan dengan Base URL backend Anda!

  // --- Fungsi Bantuan untuk Panggilan API ---
  const callApi = useCallback(async (url, method = 'GET', body = null, requiresAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth && user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { message: "Operasi berhasil" };
      }
      return await response.json();
    } catch (error) {
      console.error(`Kesalahan Panggilan API (${method} ${url}):`, error);
      throw error;
    }
  }, [user]);

  // --- Fungsi untuk Mengambil Semua Data Awal dari Backend ---
  const fetchData = useCallback(async () => {
    if (!user || !user.token) {
      console.log("Pengguna belum login atau token tidak ada, tidak dapat mengambil data.");
      return;
    }

    setIsLoading(true);
    try {
      const recipientsData = await callApi('/api/recipients', 'GET', null, true);
      setWarga(recipientsData);

      const programsData = await callApi('/api/programs', 'GET', null, true);
      setPengajuanDana(programsData.map(program => ({
        id: program._id,
        jumlah: program.amount,
        tujuan: program.title,
        kebutuhan: program.description,
        bulan: new Date(program.startDate).getMonth() + 1,
        tahun: new Date(program.startDate).getFullYear(),
        status: program.status,
        tanggal: program.startDate,
        petugas: "API User"
      })));

      const transactionsData = await callApi('/api/transactions', 'GET', null, true);
      setDistribusi(transactionsData.map(transaction => {
        const recipient = recipientsData.find(r => r._id === transaction.recipientId);
        const program = programsData.find(p => p._id === transaction.programId);
        const dummyBahanItem = bahanPokok.find(b => b.id === transaction.amount);

        return {
          id: transaction._id,
          jenis: dummyBahanItem ? dummyBahanItem.id : null,
          jumlah: transaction.amount,
          satuan: dummyBahanItem ? dummyBahanItem.satuan : 'unit',
          penerima: transaction.recipientId,
          tanggal: transaction.timestamp,
          kategori: dummyBahanItem ? dummyBahanItem.kategori : 'lain-lain',
          namaBahan: dummyBahanItem ? dummyBahanItem.nama : 'Bantuan Umum',
          penerimaNama: recipient ? recipient.nama : 'Tidak Dikenal',
          harga: dummyBahanItem ? dummyBahanItem.harga : 0,
          total: (dummyBahanItem ? dummyBahanItem.harga : 0) * transaction.amount,
          petugas: "API User"
        };
      }));

      // Tambahkan riwayat login untuk user saat ini (jika belum ada untuk sesi ini)
      const currentLoginEntry = riwayatLogin.find(
        (log) => log.userId === user._id && log.sessionId === user.token // Menggunakan token sebagai sessionId
      );
      if (!currentLoginEntry) {
        setRiwayatLogin((prev) => [
          {
            id: Date.now(), // ID unik untuk setiap entri
            userId: user._id,
            nama: user.nama || user.username,
            waktu: new Date().toLocaleString('id-ID'),
            sessionId: user.token, // Gunakan token sebagai ID sesi
          },
          ...prev,
        ]);
      }


      if (!isDataLoaded) {
        toast.success("Data berhasil dimuat dari server!");
        setIsDataLoaded(true);
      }
    } catch (error) {
      toast.error(`Gagal memuat data: ${error.message}`);
      if (error.message.includes("401") || error.message.includes("403")) {
        onLogout(); // Panggil onLogout dari App.js
        toast.info("Sesi Anda berakhir, silakan login kembali.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, callApi, isDataLoaded, setWarga, setPengajuanDana, setDistribusi, bahanPokok, onLogout, riwayatLogin, setRiwayatLogin]);

  useEffect(() => {
    if (user && user.token) {
      if (!isDataLoaded) {
        fetchData();
      }
    }
  }, [user, fetchData, isDataLoaded]);

  // --- Sorting function ---
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- CRUD Warga/Recipients ---
  const tambahWarga = useCallback(async (e) => {
    e.preventDefault();
    if (formWarga.nik.length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    if (!formWarga.alamat.rt || !formWarga.alamat.rw || !formWarga.alamat.jalan) {
      toast.error("RT, RW, dan Jalan harus diisi");
      return;
    }
    const pekerjaanDisplay = formWarga.pekerjaan === "lainnya"
      ? formWarga.pekerjaanLain
      : pekerjaanOptions.find(p => p.value === formWarga.pekerjaan)?.label;

    const newWargaData = {
      nama: formWarga.nama,
      nik: formWarga.nik,
      jumlahKeluarga: formWarga.jumlahKeluarga,
      penghasilan: formWarga.penghasilan,
      pekerjaan: formWarga.pekerjaan,
      pekerjaanDisplay: pekerjaanDisplay,
      status: "Belum Menerima",
      catatan: formWarga.catatan,
      alamat: formWarga.alamat,
      tanggalDaftar: new Date().toISOString(),
    };
    if (newWargaData.pekerjaan !== "lainnya") {
        delete newWargaData.pekerjaanLain;
    }
    setIsLoading(true);
    try {
      const addedWarga = await callApi('/api/recipients', 'POST', newWargaData, true);
      setWarga(prev => [...prev, addedWarga]);
      setFormWarga({
        nama: "", nik: "", jumlahKeluarga: 1,
        penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
        status: "Belum Menerima", catatan: "",
        alamat: { rt: "", rw: "", jalan: "", nomor: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: "" }
      });
      toast.success("Data warga berhasil ditambahkan!");
      setCurrentPage("data-warga"); // Navigasi ke data-warga setelah berhasil
    } catch (error) {
      toast.error(`Gagal menambah warga: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formWarga, user, setWarga, pekerjaanOptions, callApi, setCurrentPage]);

  const editWarga = useCallback((wargaToEdit) => {
    setEditingWarga(wargaToEdit);
    setFormWarga({
      ...wargaToEdit,
      pekerjaanLain: wargaToEdit.pekerjaan === "lainnya" ? wargaToEdit.pekerjaanDisplay : ""
    });
    setCurrentPage("pendaftaran");
  }, [setCurrentPage, setFormWarga]);

  const updateWarga = useCallback(async (e) => {
    e.preventDefault();
    if (!editingWarga || !editingWarga._id) {
      toast.error("ID warga tidak ditemukan untuk diperbarui.");
      return;
    }
    if (formWarga.nik.length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    if (!formWarga.alamat.rt || !formWarga.alamat.rw || !formWarga.alamat.jalan) {
      toast.error("RT, RW, dan Jalan harus diisi");
      return;
    }
    const pekerjaanDisplay = formWarga.pekerjaan === "lainnya"
      ? formWarga.pekerjaanLain
      : pekerjaanOptions.find(p => p.value === formWarga.pekerjaan)?.label;

    const updatedData = {
      nama: formWarga.nama, nik: formWarga.nik, jumlahKeluarga: formWarga.jumlahKeluarga,
      penghasilan: formWarga.penghasilan, pekerjaan: formWarga.pekerjaan,
      pekerjaanDisplay: pekerjaanDisplay, status: formWarga.status,
      catatan: formWarga.catatan, alamat: formWarga.alamat,
    };
    if (updatedData.pekerjaan !== "lainnya") {
        delete updatedData.pekerjaanLain;
    }
    const { _id, ...dataToSend } = updatedData;
    setIsLoading(true);
    try {
      const updatedRecipient = await callApi(`/api/recipients/${editingWarga._id}`, 'PUT', dataToSend, true);
      setWarga(prev => prev.map(w => w._id === updatedRecipient._id ? updatedRecipient : w));
      setEditingWarga(null);
      setFormWarga({
        nama: "", nik: "", jumlahKeluarga: 1,
        penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
        status: "Belum Menerima", catatan: "",
        alamat: { rt: "", rw: "", jalan: "", nomor: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: "" }
      });
      toast.success("Data warga berhasil diperbarui!");
      setCurrentPage("data-warga");
    } catch (error) {
      toast.error(`Gagal memperbarui warga: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formWarga, editingWarga, user, setWarga, pekerjaanOptions, callApi, setCurrentPage]);

  const hapusWarga = useCallback(async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data warga ini?")) {
      setIsLoading(true);
      try {
        await callApi(`/api/recipients/${id}`, 'DELETE', null, true);
        setWarga(prev => prev.filter(w => w._id !== id));
        toast.success("Data warga berhasil dihapus!");
      } catch (error) {
        toast.error(`Gagal menghapus warga: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, setWarga, callApi]);

  const updateWargaStatus = useCallback(async (id, newStatus) => {
    setIsLoading(true);
    try {
      const wargaToUpdate = warga.find(w => w._id === id);
      if (wargaToUpdate) {
        const updatedWarga = { ...wargaToUpdate, status: newStatus };
        await callApi(`/api/recipients/${id}`, 'PUT', updatedWarga, true);
        setWarga(prev => prev.map(w => w._id === id ? updatedWarga : w));
        toast.info(`Status warga berhasil diperbarui menjadi ${newStatus}!`);
      } else {
        toast.error("Warga tidak ditemukan untuk diperbarui statusnya.");
      }
    } catch (error) {
      toast.error(`Gagal memperbarui status warga: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, setWarga, callApi, warga]);

  // --- Fungsi-fungsi Dummy/Placeholder untuk Modul Lain ---
  const tambahBantuan = useCallback((e) => {
    e.preventDefault();
    toast.info("Fungsi 'Catat Distribusi' belum terhubung ke API backend.");
    const bahan = bahanPokok.find(b => b.id === parseInt(formBantuan.jenis));
    const penerimaWarga = warga.find(w => w._id === formBantuan.penerima);
    if (bahan && penerimaWarga) {
        const newBantuan = {
            id: Date.now(), petugas: user.username, tanggal: formBantuan.tanggal,
            namaBahan: bahan.nama, kategori: bahan.kategori, penerimaNama: penerimaWarga.nama,
            harga: bahan.harga, total: (bahan.harga || 0) * (formBantuan.jumlah || 0),
            jumlah: formBantuan.jumlah, satuan: bahan.satuan
        };
        setDistribusi(prev => [...prev, newBantuan]);
        setBahanPokok(prev => prev.map(b => b.id === bahan.id ? { ...b, stok: b.stok - formBantuan.jumlah } : b));
        toast.success("Distribusi bantuan (dummy) berhasil dicatat!");
    } else {
        toast.error("Data bahan atau penerima tidak valid.");
    }
  }, [formBantuan, bahanPokok, user, warga, setDistribusi, setBahanPokok]);

  const ajukanDana = useCallback((e) => {
    e.preventDefault();
    toast.info("Fungsi 'Ajukan Dana' belum terhubung ke API backend.");
    const newPengajuan = {
        id: Date.now(), ...formPengajuan, status: "diproses", tanggal: currentDate,
        petugas: user.username
    };
    setPengajuanDana(prev => [...prev, newPengajuan]);
    toast.success("Pengajuan dana (dummy) berhasil dikirim!");
  }, [formPengajuan, currentDate, user, setPengajuanDana]);

  const approvePengajuan = useCallback((id) => {
    if (window.confirm(`Apakah Anda yakin menyetujui pengajuan dana ini?`)) {
        toast.info("Fungsi 'Setujui Pengajuan Dana' belum terhubung ke API backend.");
        setPengajuanDana(prev => prev.map(p => p.id === id ? { ...p, status: "disetujui" } : p));
        const pengajuan = pengajuanDana.find(p => p.id === id);
        if (pengajuan) {
            setDana(prev => prev + pengajuan.jumlah);
            setRiwayatDana(prev => [...prev, {
                id: Date.now(), jenis: "pemasukan", jumlah: pengajuan.jumlah,
                keterangan: `Pengajuan disetujui: ${pengajuan.tujuan}`, tanggal: currentDate,
                petugas: user.username
            }]);
        }
        toast.success("Pengajuan dana (dummy) telah disetujui!");
    }
  }, [pengajuanDana, setPengajuanDana, setDana, setRiwayatDana, currentDate, user]);

  const kelolaDana = useCallback((e) => {
    e.preventDefault();
    toast.info("Fungsi 'Kelola Dana' belum terhubung ke API backend.");
    const newTransaction = {
        id: Date.now(), jenis: danaForm.jenis, jumlah: parseInt(danaForm.jumlah),
        keterangan: danaForm.keterangan, tanggal: currentDate, petugas: user.username
    };
    setRiwayatDana(prev => [newTransaction, ...prev]);
    if (danaForm.jenis === "pengeluaran") {
        setDana(prev => prev - parseInt(danaForm.jumlah));
    } else {
        setDana(prev => prev + parseInt(danaForm.jumlah));
    }
    toast.success(`Transaksi dana (dummy) ${danaForm.jenis} berhasil dicatat!`);
  }, [danaForm, currentDate, user, setRiwayatDana, setDana]);

  const tambahKeAntrian = useCallback(() => {
    toast.info("Fungsi 'Tambah Antrian' belum terhubung ke API backend.");
    const newAntrian = {
        id: Date.now(), ...formAntrian, tanggalDibuat: currentDate,
        petugas: user.username
    };
    setAntrian(prev => [...prev, newAntrian]);
    toast.success("Antrian baru (dummy) berhasil dibuat!");
  }, [formAntrian, currentDate, user, setAntrian]);

  const hapusAntrian = useCallback((id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus antrian ini?")) {
        toast.info("Fungsi 'Hapus Antrian' belum terhubung ke API backend.");
        setAntrian(prev => prev.filter(a => a.id !== id));
        toast.success("Antrian (dummy) berhasil dihapus!");
    }
  }, [setAntrian]);

  const tambahPenerimaKeAntrian = useCallback((wargaId) => {
    if (formAntrian.penerima.includes(wargaId)) {
      toast.error("Warga sudah ada dalam antrian bulan ini");
      return;
    }
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

  const movePenerima = useCallback((index, direction) => {
    const newPenerima = [...formAntrian.penerima];
    if (direction === 'up' && index > 0) {
      [newPenerima[index], newPenerima[index - 1]] = [newPenerima[index - 1], newPenerima[index]];
    } else if (direction === 'down' && index < newPenerima.length - 1) {
      [newPenerima[index], newPenerima[index + 1]] = [newPenerima[index + 1], newPenerima[index]];
    }
    setFormAntrian(prev => ({ ...prev, penerima: newPenerima }));
  }, [formAntrian]);

  const tambahBahanPokok = useCallback((e) => {
    e.preventDefault();
    // Pesan ini akan tetap ada sampai backend untuk bahan pokok diimplementasikan
    toast.info("Fungsi 'Tambah Stok Bahan Pokok' belum terhubung ke API backend.");
    const selectedBahan = bahanPokok.find(b => b.id === parseInt(formTambahBahan.jenis));
    if (selectedBahan) {
        setBahanPokok(prev => prev.map(b =>
            b.id === selectedBahan.id ? { ...b, stok: b.stok + parseInt(formTambahBahan.jumlah) } : b
        ));
        setDana(prev => prev - (formTambahBahan.harga * formTambahBahan.jumlah));
        setRiwayatDana(prev => [...prev, {
            id: Date.now(), jenis: "pengeluaran", jumlah: formTambahBahan.harga * formTambahBahan.jumlah,
            keterangan: `Pembelian ${selectedBahan.nama}`, tanggal: currentDate,
            petugas: user.username
        }]);
        toast.success("Bahan pokok (dummy) berhasil ditambahkan!");
    } else {
        toast.error("Bahan tidak ditemukan.");
    }
  }, [formTambahBahan, bahanPokok, user, currentDate, setBahanPokok, setDana, setRiwayatDana]);

  const resetPasswordPetugas = useCallback((id) => {
    if (window.confirm("Apakah Anda yakin ingin mereset password petugas ini? Password akan diubah menjadi 'password'")) {
      toast.info("Fungsi 'Reset Password Petugas' belum terhubung ke API backend.");
      setPetugas(prev => prev.map(p =>
        p.id === id ? { ...p, password: "password" } : p
      ));
      toast.success("Password (dummy) berhasil direset menjadi 'password'");
    }
  }, [setPetugas]);

  const eksporKeCSV = useCallback((data, filename, jenis) => {
    if (!data || data.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    const reportTitle = "LAPORAN SISTEM DISTRIBUSI BANSOS\n";
    const reportSubtitle = `Jenis Laporan: ${jenis}\n`;
    const reportDate = `Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}\n`;
    const reportTime = `Waktu Ekspor: ${new Date().toLocaleTimeString('id-ID')}\n`;
    const reportPetugas = `Diekspor Oleh: ${user?.nama || user?.username} (${user?.role})\n\n`;
    const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], newKey));
            } else {
                acc[newKey] = obj[key];
            }
            return acc;
        }, {});
    };
    const flattenedData = data.map(item => flattenObject(item));
    const headers = Object.keys(flattenedData[0]).join(",");
    const rows = flattenedData.map(item =>
      Object.values(item).map(val => {
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`;
        }
        return val;
      }).join(",")
    );
    const separator = "========================================\n";
    const warning = "PERINGATAN: Data ini bersifat rahasia dan tidak boleh disebarluaskan\n";
    const footer = `Total Data: ${data.length}\n`;
    const csv = reportTitle + reportSubtitle + reportDate + reportTime +
               reportPetugas + headers + "\n" + rows.join("\n") + "\n\n" +
               separator + footer + warning;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Data berhasil diekspor: ${filename}`);
  }, [user]);

  // --- Utility Functions for Forms ---
  const handleNumericInput = (e, setter, field, maxLength) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setter(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNumericAlamat = (e, field) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      setFormWarga(prev => ({
        ...prev,
        alamat: {
          ...prev.alamat,
          [field]: value
        }
      }));
    }
  };

  const resetFormWarga = useCallback(() => {
    setFormWarga({
      nama: "", nik: "", jumlahKeluarga: 1,
      penghasilan: 500000, pekerjaan: "buruh_tani", pekerjaanLain: "",
      status: "Belum Menerima", catatan: "",
      alamat: { rt: "", rw: "", jalan: "", nomor: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: "" }
    });
    setEditingWarga(null);
  }, []);

  const wargaDiAntrian = useMemo(() => {
    const currentAntrian = antrian.find(a =>
      a.bulan === formAntrian.bulan && a.tahun === formAntrian.tahun
    );
    if (!currentAntrian) return [];
    return warga.filter(w => currentAntrian.penerima.includes(w._id));
  }, [antrian, formAntrian.bulan, formAntrian.tahun, warga]);

  const getWargaById = useCallback((id) => {
    return warga.find(w => w._id === id);
  }, [warga]);

  // --- Sorting & Filtering Logic ---
  const sortedWarga = useMemo(() => {
    let sortableItems = [...warga];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj && obj[key], a);
          bValue = keys.reduce((obj, key) => obj && obj[key], b);
        }
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [warga, sortConfig]);

  const filteredWarga = useMemo(() => {
    return sortedWarga.filter((w) => {
      const matchesSearch = searchTerm === "" ||
        Object.values(w).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (w.alamat && Object.values(w.alamat).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ));
      const matchesStatus = filterStatus === "Semua" || w.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sortedWarga, searchTerm, filterStatus]);

  const paginatedWarga = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWarga.slice(startIndex, endIndex);
  }, [filteredWarga, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredWarga.length / itemsPerPage);
  }, [filteredWarga, itemsPerPage]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination-controls">{pages}</div>;
  };

  // --- Render Halaman Berdasarkan State `currentPage` ---
  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="dashboard-grid">
            <div className="welcome-card">
              <h2>Selamat Datang, {user?.nama || user?.username}!</h2>
              <p>Sistem Distribusi Bantuan Sosial Kelurahan Bahagia Makmur</p>
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
                <div className="stat-item">
                  <FaMoneyBill />
                  <span>{formatCurrency(dana)} Dana</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="activity-card">
                <h3>Antrian Terdekat</h3>
                <ul>
                  {antrian.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <span>Antrian {item.bulan}/{item.tahun}</span>
                      <small>{item.penerima.length} Penerima</small>
                    </li>
                  ))}
                  {antrian.length === 0 && (
                    <li className="empty-state">
                      <span>Belum ada antrian</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="activity-card">
                <h3>Riwayat Login Terakhir</h3>
                <ul>
                  {/* Pastikan log.id ada dan unik */}
                  {riwayatLogin.slice(0, 5).map((log) => (
                    <li key={log.id}>
                      <span>{log.nama}</span>
                      <small>{log.waktu}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "pendaftaran":
        return (
          <div className="data-container">
            <div className="form-section">
              <h2>{editingWarga ? "Edit Data Warga" : "Pendaftaran Warga Baru"}</h2>
              <form onSubmit={editingWarga ? updateWarga : tambahWarga}>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Nama Lengkap *</label>
                    <input
                      type="text"
                      value={formWarga.nama}
                      onChange={(e) => setFormWarga({...formWarga, nama: e.target.value})}
                      required
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Jumlah Keluarga *</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formWarga.jumlahKeluarga}
                      onChange={(e) => setFormWarga({...formWarga, jumlahKeluarga: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>NIK (16 digit) *</label>
                    <input
                      type="text"
                      value={formWarga.nik}
                      onChange={(e) => handleNumericInput(e, setFormWarga, "nik", 16)}
                      required
                      placeholder="16 digit NIK"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Pekerjaan *</label>
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
                  </div>
                </div>

                {formWarga.pekerjaan === "lainnya" && (
                  <div className="form-group">
                    <label>Jenis Pekerjaan Lain *</label>
                    <input
                      type="text"
                      placeholder="Tulis pekerjaan"
                      value={formWarga.pekerjaanLain}
                      onChange={(e) => setFormWarga({...formWarga, pekerjaanLain: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Penghasilan per Bulan *</label>
                  <div className="form-row" style={{ alignItems: 'center' }}>
                    <div style={{ flex: 3 }}>
                      <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={formWarga.penghasilan}
                        onChange={(e) => setFormWarga({...formWarga, penghasilan: parseInt(e.target.value)})}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', fontWeight: '500' }}>
                      {formatCurrency(formWarga.penghasilan)}
                    </div>
                  </div>
                </div>

                <h3 className="form-section-title">Alamat Lengkap</h3>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>RT *</label>
                    <input
                      type="text"
                      value={formWarga.alamat.rt}
                      onChange={(e) => handleNumericAlamat(e, "rt")}
                      required
                      placeholder="01"
                      maxLength={3}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>RW *</label>
                    <input
                      type="text"
                      value={formWarga.alamat.rw}
                      onChange={(e) => handleNumericAlamat(e, "rw")}
                      required
                      placeholder="05"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 3 }}>
                    <label>Jalan *</label>
                    <input
                      type="text"
                      value={formWarga.alamat.jalan}
                      onChange={(e) => setFormWarga({
                        ...formWarga,
                        alamat: {...formWarga.alamat, jalan: e.target.value}
                      })}
                      required
                      placeholder="Nama jalan"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Nomor Rumah</label>
                    <input
                      type="text"
                      value={formWarga.alamat.nomor}
                      onChange={(e) => setFormWarga({
                        ...formWarga,
                        alamat: {...formWarga.alamat, nomor: e.target.value}
                      })}
                      placeholder="Nomor"
                    />
                  </div>
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
                      placeholder="Kelurahan"
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
                      placeholder="Kecamatan"
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
                      placeholder="Kabupaten/Kota"
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
                      placeholder="Provinsi"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Catatan</label>
                  <textarea
                    value={formWarga.catatan}
                    onChange={(e) => setFormWarga({...formWarga, catatan: e.target.value})}
                    placeholder="Tambahkan catatan jika perlu"
                    rows={2}
                  />
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      resetFormWarga();
                      setCurrentPage("data-warga");
                    }}
                    disabled={isLoading}
                  >
                    <FaTimes /> Batal
                  </button>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (editingWarga ? "Memperbarui..." : "Menyimpan...") : (editingWarga ? <><FaEdit /> Perbarui Data</> : <><FaUserPlus /> Simpan Data</>)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "data-warga":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Data warga bersifat rahasia. Jangan sebarluaskan informasi ini.</span>
            </div>

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
                <option value="Semua">Semua Status</option>
                <option value="Belum Menerima">Belum Menerima</option>
                <option value="Sudah Menerima">Sudah Menerima</option>
              </select>
              <button
                className="btn-primary"
                onClick={() => {
                  resetFormWarga();
                  setCurrentPage("pendaftaran");
                }}
              >
                <FaUserPlus /> Tambah Warga
              </button>
              <button
                className="btn-secondary"
                onClick={() => eksporKeCSV(warga, "data_warga", "Data Warga")}
              >
                <FaFileCsv /> Ekspor
              </button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => requestSort('nama')}>Nama {getSortIcon('nama')}</th>
                    <th onClick={() => requestSort('nik')}>NIK {getSortIcon('nik')}</th>
                    <th onClick={() => requestSort('alamat.jalan')}>Alamat {getSortIcon('alamat.jalan')}</th>
                    <th onClick={() => requestSort('pekerjaanDisplay')}>Pekerjaan {getSortIcon('pekerjaanDisplay')}</th>
                    <th onClick={() => requestSort('penghasilan')}>Penghasilan {getSortIcon('penghasilan')}</th>
                    <th onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="7" className="text-center">Memuat data...</td></tr>
                  ) : paginatedWarga.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">Tidak ada data warga ditemukan.</td></tr>
                  ) : (
                    paginatedWarga.map(w => (
                      <tr key={w._id}>
                        <td>{w.nama}</td>
                        <td>{w.nik}</td>
                        <td>{`${w.alamat.jalan}, RT: ${w.alamat.rt}/RW: ${w.alamat.rw}`}</td>
                        <td>{w.pekerjaanDisplay || w.pekerjaan}</td>
                        <td>{formatCurrency(w.penghasilan)}</td>
                        <td>
                          <span className={`status-badge ${w.status.toLowerCase().replace(' ', '-')}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            className="btn-icon info"
                            onClick={() => editWarga(w)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => hapusWarga(w._id)}
                          >
                            <FaTrash />
                          </button>
                          {user?.role === "admin" && (
                            <button
                                className={`btn-icon ${w.status === "Belum Menerima" ? "success" : "warning"}`}
                                onClick={() => updateWargaStatus(w._id, w.status === "Belum Menerima" ? "Sudah Menerima" : "Belum Menerima")}
                            >
                                {w.status === "Belum Menerima" ? <FaCheck /> : <FaRedo />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </div>
        );

      case "antrian":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Data antrian bersifat sensitif. Simpan dengan aman dan jangan disebarluaskan.</span>
            </div>

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
                    disabled={formAntrian.penerima.length === 0 || isLoading}
                  >
                    {isLoading ? "Membuat..." : <><FaPlus /> Buat Antrian</>}
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
                      w.status === "Sudah Menerima" &&
                      w.nama.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(w => (
                      <li
                        key={w._id}
                        className={formAntrian.penerima.includes(w._id) ? "selected" : ""}
                      >
                        <div>
                          <strong>{w.nama}</strong>
                          <p>NIK: {w.nik}</p>
                          <p>{w.alamat.jalan}, RT: {w.alamat.rt}/RW: {w.alamat.rw}</p>
                        </div>
                        {formAntrian.penerima.includes(w._id) ? (
                          <button
                            className="btn-icon danger"
                            onClick={() => hapusPenerimaDariAntrian(w._id)}
                          >
                            <FaTimes />
                          </button>
                        ) : (
                          <button
                            className="btn-icon success"
                            onClick={() => tambahPenerimaKeAntrian(w._id)}
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
                    {formAntrian.penerima.map((id, index) => {
                      const wargaItem = warga.find(w => w._id === id);
                      return wargaItem ? (
                        <li key={id}>
                          <div>
                            <strong>{index + 1}. {wargaItem.nama}</strong>
                            <p>NIK: {wargaItem.nik}</p>
                            <p>{wargaItem.alamat.jalan}, RT: {wargaItem.alamat.rt}/RW: {wargaItem.alamat.rw}</p>
                          </div>
                          <div className="antrian-actions">
                            <button
                              className="btn-icon"
                              onClick={() => movePenerima(index, 'up')}
                              disabled={index === 0}
                            >
                              <FaSortUp />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => movePenerima(index, 'down')}
                              disabled={index === formAntrian.penerima.length - 1}
                            >
                              <FaSortDown />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => hapusPenerimaDariAntrian(id)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="antrian-history">
              <div className="section-header">
                <h3>Riwayat Antrian</h3>
                <button
                  className="btn-secondary"
                  onClick={() => eksporKeCSV(antrian, "antrian_bansos", "Riwayat Antrian")}
                >
                  <FaFileCsv /> Ekspor Data
                </button>
              </div>
              <div className="history-grid">
                {antrian.map(item => (
                  <div key={item.id} className="history-item">
                    <div className="history-header">
                      <h4>Antrian {item.bulan}/{item.tahun}</h4>
                      <span>{item.penerima.length} Penerima</span>
                    </div>
                    <div className="history-date">
                      Dibuat: {formatDate(item.tanggalDibuat)} oleh {item.petugas}
                    </div>
                    <div className="history-actions">
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setFormAntrian({
                            bulan: item.bulan,
                            tahun: item.tahun,
                            penerima: [...item.penerima]
                          });
                          toast.info("Antrian berhasil dimuat untuk diedit");
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => hapusAntrian(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                {antrian.length === 0 && (
                  <div className="empty-state">
                    <p>Belum ada riwayat antrian</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "distribusi":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Data distribusi bersifat rahasia. Pastikan penyimpanan yang aman.</span>
            </div>

            <h2>Distribusi Bantuan Sosial</h2>

            <div className="bahan-pokok-section">
              <h3>Stok Bahan Pokok</h3>
              <div className="kategori-filter">
                <div
                  className={`kategori-item ${activeCategory === "semua" ? "active" : ""}`}
                  onClick={() => setActiveCategory("semua")}
                >
                  <div className="kategori-icon">
                    <FaFilter />
                  </div>
                  <span>Semua Kategori</span>
                </div>
                {kategoriBahan.map(kategori => (
                  <div
                    key={kategori.id}
                    className={`kategori-item ${activeCategory === kategori.id ? "active" : ""}`}
                    onClick={() => setActiveCategory(kategori.id)}
                  >
                    <div className="kategori-icon">
                      {kategori.icon}
                    </div>
                    <span>{kategori.label}</span>
                  </div>
                ))}
              </div>

              <div className="bahan-grid">
                {bahanPokok
                  .filter(b => activeCategory === "semua" || b.kategori === activeCategory)
                  .map(bahan => (
                    <div
                      key={bahan.id}
                      className="bahan-item"
                    >
                      <div className="bahan-header">
                        <h4>{bahan.nama}</h4>
                        <span>{bahan.stok} {bahan.satuan}</span>
                      </div>
                      <div className="bahan-kategori">
                        {kategoriBahan.find(k => k.id === bahan.kategori)?.label}
                      </div>
                      <div className="bahan-harga">
                        {formatCurrency(bahan.harga)} / {bahan.satuan}
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
                    <label>Kategori Bahan</label>
                    <select
                      value={formBantuan.kategori}
                      onChange={(e) => {
                        setFormBantuan({
                          ...formBantuan,
                          kategori: e.target.value,
                          jenis: ""
                        });
                      }}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriBahan.map(kategori => (
                        <option key={kategori.id} value={kategori.id}>
                          {kategori.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Jenis Bahan</label>
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
                      disabled={!formBantuan.kategori}
                    >
                      <option value="">Pilih Jenis Bahan</option>
                      {formBantuan.kategori &&
                        kategoriBahan
                          .find(k => k.id === formBantuan.kategori)
                          ?.jenis.map(jenis => (
                            <option key={jenis.id} value={jenis.id}>
                              {jenis.nama} (Stok: {bahanPokok.find(b => b.id === jenis.id)?.stok || 0} {jenis.satuan})
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
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
                      {wargaDiAntrian.map(w => (
                        <option key={w._id} value={w._id}>
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
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Mencatat..." : <><FaShoppingBasket /> Catat Distribusi</>}
                  </button>
                </div>
              </form>
            </div>

            <div className="form-section">
              <h3>Tambah Stok Bahan Pokok</h3>
              <form onSubmit={tambahBahanPokok}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kategori Bahan</label>
                    <select
                      value={formTambahBahan.kategori}
                      onChange={(e) => {
                        setFormTambahBahan({
                          ...formTambahBahan,
                          kategori: e.target.value,
                          jenis: ""
                        });
                      }}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriBahan.map(kategori => (
                        <option key={kategori.id} value={kategori.id}>
                          {kategori.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Jenis Bahan</label>
                    <select
                      value={formTambahBahan.jenis}
                      onChange={(e) => {
                        const selectedBahan = bahanPokok.find(b => b.id === parseInt(e.target.value));
                        setFormTambahBahan({
                          ...formTambahBahan,
                          jenis: e.target.value,
                          harga: selectedBahan ? selectedBahan.harga : 0
                        });
                      }}
                      required
                      disabled={!formTambahBahan.kategori}
                    >
                      <option value="">Pilih Jenis Bahan</option>
                      {formTambahBahan.kategori &&
                        kategoriBahan
                          .find(k => k.id === formTambahBahan.kategori)
                          ?.jenis.map(jenis => (
                            <option key={jenis.id} value={jenis.id}>
                              {jenis.nama} ({formatCurrency(jenis.harga)} / {jenis.satuan})
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jumlah</label>
                    <input
                      type="number"
                      min="1"
                      value={formTambahBahan.jumlah}
                      onChange={(e) => setFormTambahBahan({...formTambahBahan, jumlah: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Harga Satuan</label>
                    <input
                      type="number"
                      min="0"
                      value={formTambahBahan.harga}
                      onChange={(e) => setFormTambahBahan({...formTambahBahan, harga: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>

                <div className="form-footer">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Menambah..." : <><FaPlus /> Tambah Stok</>}
                  </button>
                </div>
              </form>
            </div>

            <div className="distribusi-history">
              <div className="section-header">
                <h3>Riwayat Distribusi</h3>
                <button
                  className="btn-secondary"
                  onClick={() => eksporKeCSV(distribusi, "riwayat_distribusi", "Riwayat Distribusi")}
                >
                  <FaFileCsv /> Ekspor Data
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Bahan</th>
                    <th>Kategori</th>
                    <th>Jumlah</th>
                    <th>Total</th>
                    <th>Penerima</th>
                    <th>Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusi.map(d => (
                    <tr key={d.id}>
                      <td>{formatDate(d.tanggal)}</td>
                      <td>{d.namaBahan || '-'}</td>
                      <td>
                        <span className="bahan-kategori">
                          {kategoriBahan.find(k => k.id === d.kategori)?.label || '-'}
                        </span>
                      </td>
                      <td>{d.jumlah || 0} {d.satuan || ''}</td>
                      <td>{formatCurrency(d.total || 0)}</td>
                      <td>{d.penerimaNama || '-'}</td>
                      <td>{d.petugas || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "pengajuan":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Pengajuan dana bersifat sensitif. Simpan dokumen dengan aman.</span>
            </div>

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
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Mengajukan..." : "Ajukan Dana"}
                  </button>
                </div>
              </form>
            </div>

            <div className="pengajuan-history">
              <div className="section-header">
                <h3>Riwayat Pengajuan</h3>
                {user?.role === "admin" && (
                  <button
                    className="btn-secondary"
                    onClick={() => eksporKeCSV(pengajuanDana, "riwayat_pengajuan_dana", "Riwayat Pengajuan Dana")}
                  >
                    <FaFileCsv /> Ekspor Data
                  </button>
                )}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jumlah</th>
                    <th>Bulan/Tahun</th>
                    <th>Status</th>
                    <th>Tujuan</th>
                    {user?.role === "admin" && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {pengajuanDana.map(item => (
                    <tr key={item.id}>
                      <td>{formatDate(item.tanggal)}</td>
                      <td>{formatCurrency(item.jumlah)}</td>
                      <td>{item.bulan}/{item.tahun}</td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.tujuan}</td>
                      {user?.role === "admin" && item.status === "diproses" && (
                        <td>
                          <button
                            className="btn-icon success"
                            onClick={() => approvePengajuan(item.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Memproses..." : <><FaCheck /> Setujui</>}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "dana":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Data keuangan sangat sensitif. Simpan dengan keamanan maksimal.</span>
            </div>

            <div className="finance-header">
              <h2>Kelola Dana Bantuan Sosial</h2>
              <div className="finance-summary">
                <div className="finance-card">
                  <h3>Saldo Saat Ini</h3>
                  <p>{formatCurrency(dana)}</p>
                </div>
                <div className="finance-card">
                  <h3>Total Pemasukan</h3>
                  <p>{formatCurrency(riwayatDana.filter(d => d.jenis === "pemasukan").reduce((sum, d) => sum + (d.jumlah || 0), 0))}</p>
                </div>
                <div className="finance-card">
                  <h3>Total Pengeluaran</h3>
                  <p>{formatCurrency(riwayatDana.filter(d => d.jenis === "pengeluaran").reduce((sum, d) => sum + (d.jumlah || 0), 0))}</p>
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
                      <option value="pengeluaran">Pengeluaran</option>
                      <option value="pemasukan">Pemasukan</option>
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
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
                  </button>
                </div>
              </form>
            </div>

            <div className="riwayat-dana">
              <div className="section-header">
                <h3>Riwayat Transaksi Dana</h3>
                <button
                  className="btn-secondary"
                  onClick={() => eksporKeCSV(riwayatDana, "riwayat_transaksi_dana", "Riwayat Transaksi Dana")}
                >
                  <FaFileCsv /> Ekspor Data
                </button>
              </div>
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
                    <tr key={d.id}> {/* Menggunakan d.id yang sudah unik */}
                      <td>{formatDate(d.tanggal)}</td>
                      <td>
                        <span className={`status-badge ${d.jenis}`}>
                          {d.jenis}
                        </span>
                      </td>
                      <td>{formatCurrency(d.jumlah)}</td>
                      <td>{d.keterangan}</td>
                      <td>{d.petugas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="data-container">
            <div className="data-security-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>Administrasi sistem hanya untuk petugas berwenang. Jangan berikan akses ke orang lain.</span>
            </div>

            <h2>Manajemen Petugas</h2>

            <div className="admin-actions">
              <button
                className="btn-primary"
                onClick={() => setCurrentPage("register-petugas")} // Navigasi internal MainApp
              >
                <FaUserPlus /> Tambah Petugas Baru
              </button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Terakhir Login</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {petugas.map(p => (
                    <tr key={p.id}>
                      <td>{p.nama}</td>
                      <td>{p.username}</td>
                      <td>{p.role}</td>
                      <td>
                        {riwayatLogin.filter(l => l.userId === p.id).sort((a, b) => new Date(b.waktu) - new Date(a.waktu))[0]?.waktu || 'Belum login'}
                      </td>
                      <td className="actions">
                        {p.role !== "admin" && (
                          <button
                            className="btn-icon warning"
                            onClick={() => resetPasswordPetugas(p.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Memproses..." : <><FaRedo /> Reset Password</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "register-petugas": // Halaman registrasi petugas di dalam admin
        return (
          <div className="data-container">
            <div className="form-section">
              <h2>Registrasi Petugas Baru</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (registerForm.password !== registerForm.confirmPassword) {
                  toast.error("Password dan konfirmasi password tidak cocok!");
                  return;
                }
                setIsLoading(true);
                try {
                  const dataToRegister = {
                    username: registerForm.username,
                    password: registerForm.password,
                    role: "petugas" // Default role untuk registrasi petugas baru
                  };
                  const response = await callApi('/api/auth/register', 'POST', dataToRegister, true); // Admin bisa register petugas, butuh token admin
                  toast.success(response.message || "Registrasi petugas berhasil!");
                  setRegisterForm({ username: "", password: "", confirmPassword: "", nama: "" });
                  // Perbarui daftar petugas lokal jika backend mengembalikan petugas baru
                  setPetugas(prev => [...prev, { id: response.user._id, username: response.user.username, nama: registerForm.nama, role: response.user.role }]);
                  setCurrentPage("admin"); // Kembali ke halaman admin setelah registrasi
                } catch (error) {
                  toast.error(`Registrasi petugas gagal: ${error.message}`);
                } finally {
                  setIsLoading(false);
                }
              }}>
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
                <div className="form-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setRegisterForm({ username: "", password: "", confirmPassword: "", nama: "" });
                      setCurrentPage("admin");
                    }}
                    disabled={isLoading}
                  >
                    <FaTimes /> Batal
                  </button>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Mendaftarkan..." : "Daftar Petugas"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "laporan":
        return (
          <div className="data-container">
            <h2>Laporan dan Statistik</h2>

            <div className="report-filter">
              <div className="form-row">
                <div className="form-group">
                  <label>Bulan</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="report-grid">
              <div className="report-card">
                <div className="report-header">
                  <FaUsers />
                  <h3>Data Warga</h3>
                </div>
                <div className="report-content">
                  <p>Total warga: {warga.length}</p>
                  <p>Warga disetujui: {warga.filter(w => w.status === "Sudah Menerima").length}</p>
                  <p>Warga belum menerima: {warga.filter(w => w.status === "Belum Menerima").length}</p>
                </div>
                <div className="report-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => eksporKeCSV(warga, "laporan_warga", "Laporan Warga")}
                  >
                    <FaFileCsv /> Ekspor Data
                  </button>
                </div>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <FaMoneyBill />
                  <h3>Manajemen Dana</h3>
                </div>
                <div className="report-content">
                  <p>Saldo saat ini: {formatCurrency(dana)}</p>
                  <p>Total pemasukan: {formatCurrency(riwayatDana.filter(d => d.jenis === "pemasukan").reduce((sum, d) => sum + (d.jumlah || 0), 0))}</p>
                  <p>Total pengeluaran: {formatCurrency(riwayatDana.filter(d => d.jenis === "pengeluaran").reduce((sum, d) => sum + (d.jumlah || 0), 0))}</p>
                </div>
                <div className="report-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => eksporKeCSV(riwayatDana, "laporan_dana", "Laporan Dana")}
                  >
                    <FaFileCsv /> Ekspor Data
                  </button>
                </div>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <FaShoppingBasket />
                  <h3>Distribusi Bansos</h3>
                </div>
                <div className="report-content">
                  <p>Total distribusi: {distribusi.length}</p>
                  <p>Bahan pokok didistribusikan: {distribusi.filter(d => d.kategori === "bahan_pokok").length}</p>
                  <p>Obat-obatan didistribusikan: {distribusi.filter(d => d.kategori === "kesehatan").length}</p>
                </div>
                <div className="report-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => eksporKeCSV(distribusi, "laporan_distribusi", "Laporan Distribusi")}
                  >
                    <FaFileCsv /> Ekspor Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>
            <FaUserCircle /> {user?.nama || user?.username}
          </h2>
          <small>{user?.role}</small>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("dashboard");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaHome /></span>
            <span className="label">Dashboard</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "pendaftaran" ? "active" : ""}`}
            onClick={() => {
              resetFormWarga();
              setEditingWarga(null);
              setCurrentPage("pendaftaran");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaUserEdit /></span>
            <span className="label">Pendaftaran</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "data-warga" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("data-warga");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaDatabase /></span>
            <span className="label">Data Warga</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "antrian" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("antrian");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaClock /></span>
            <span className="label">Antrian</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "distribusi" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("distribusi");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaShoppingBasket /></span>
            <span className="label">Distribusi</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "dana" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("dana");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaMoneyBill /></span>
            <span className="label">Kelola Dana</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "pengajuan" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("pengajuan");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaHandHoldingUsd /></span>
            <span className="label">Pengajuan Dana</span>
          </li>

          <li
            className={`sidebar-item ${currentPage === "laporan" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("laporan");
              setSidebarOpen(false);
            }}
          >
            <span className="icon"><FaFileExport /></span>
            <span className="label">Laporan</span>
          </li>

          {user?.role === "admin" && (
            <li
              className={`sidebar-item ${currentPage === "admin" ? "active" : ""}`}
              onClick={() => {
                setCurrentPage("admin");
                setSidebarOpen(false);
              }}
            >
              <span className="icon"><FaUserPlus /></span>
              <span className="label">Admin</span>
            </li>
          )}
        </ul>

        <div className="sidebar-footer">
          <div
            className="sidebar-item"
            onClick={onLogout}
          >
            <span className="icon"><FaSignOutAlt /></span>
            <span className="label">Logout</span>
          </div>
        </div>
      </div>

      <div
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className="main-content">
        <div className="content-header">
          <h1>
            {{
              dashboard: "Dashboard Utama",
              pendaftaran: editingWarga ? "Edit Data Warga" : "Pendaftaran Warga Baru",
              'data-warga': "Data Warga",
              antrian: "Antrian Bansos",
              distribusi: "Distribusi Bantuan",
              dana: "Manajemen Dana Bantuan",
              pengajuan: "Pengajuan Dana",
              laporan: "Laporan dan Statistik",
              admin: "Administrasi Sistem",
              'register-petugas': "Registrasi Petugas Baru" // Tambahkan judul untuk halaman ini
            }[currentPage]}
          </h1>
          <div className="user-profile">
            <span>{user?.nama || user?.username} ({user?.role})</span>
            <div className="avatar">
              <FaUserCircle />
            </div>
          </div>
        </div>
        <div className="content-body">
          {/* Pastikan div ini memiliki key yang unik untuk memaksa React me-remount komponen halaman */}
          <div key={currentPage}>
            {renderPageContent()}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Komponen Utama App ---
export default function App() {
  const [user, setUser] = useLocalStorage("user", null);
  const [appMode, setAppMode] = useState("auth"); // 'auth' or 'main'
  const [authPageMode, setAuthPageMode] = useState("login"); // 'login' or 'register'

  // Effect untuk menentukan mode aplikasi awal berdasarkan status login user
  useEffect(() => {
    if (user && user.token) {
      setAppMode("main"); // Jika user sudah login, tampilkan aplikasi utama
    } else {
      // Jika tidak ada token user, cek hash untuk halaman register, jika tidak default ke login
      if (window.location.hash === "#register") {
        setAuthPageMode("register");
      } else {
        setAuthPageMode("login");
      }
      setAppMode("auth"); // Pastikan mode aplikasi adalah autentikasi
    }
  }, [user]);

  // Callback saat login berhasil dari AuthContainer
  const handleLoginSuccess = useCallback((loggedInUser) => {
    setUser(loggedInUser);
    setAppMode("main");
    window.location.hash = ""; // Bersihkan hash setelah login berhasil
  }, [setUser]);

  // Callback saat registrasi berhasil dari AuthContainer
  const handleRegisterSuccess = useCallback(() => {
    setAuthPageMode("login"); // Kembali ke halaman login setelah registrasi
    window.location.hash = ""; // Bersihkan hash setelah registrasi berhasil
  }, []);

  // Callback saat logout dari MainAppContainer
  const handleLogout = useCallback(() => {
    setUser(null);
    setAppMode("auth");
    setAuthPageMode("login"); // Kembali ke halaman login
    window.location.hash = ""; // Bersihkan hash saat logout
  }, [setUser]);

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {appMode === "main" && user ? (
        <MainAppContainer user={user} onLogout={handleLogout} />
      ) : (
        <AuthContainer
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          mode={authPageMode}
        />
      )}
    </div>
  );
}
