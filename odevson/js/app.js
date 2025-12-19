let activeTab = "events";
let selectedCategory = "all";
let searchTerm = "";
let selectedClub = null;

const grid = document.getElementById("contentGrid");
const noResults = document.getElementById("noResults");

/* KULÜPLER */
const clubs = [
    { id: "okculuk", name: "Okçuluk Kulübü", category: "Spor" },
    { id: "gastronomi", name: "Gastronomi Kulübü", category: "Yemek" },
    { id: "tiyatro", name: "Tiyatro ve Gençlik Kulübü", category: "Film ve Tiyatro" },
    { id: "esports", name: "Esports Topluluğu", category: "Teknoloji" },
    { id: "gezginler", name: "Gezginler Topluluğu", category: "Kültür" },
    { id: "muzik", name: "Müzik Topluluğu", category: "Müzik" }
];

/* ETKİNLİKLER – TAMAMI */
const events = [
    {
        id: 1,
        title: "Okçuluk Etkinliği",
        clubId: "okculuk",
        category: "Spor",
        image: "assets/images/okculuk.jpg",
        date: "12 Mart 2025",
        time: "14:00",
        place: "Spor Salonunda Buluşulacaktır",
        rules: "Spor kıyafeti zorunludur."
    },
    {
        id: 2,
        title: "Uzak Doğu Yemek Etkinliği",
        clubId: "gastronomi",
        category: "Yemek",
        image: "assets/images/yemek.jpg",
        date: "18 Mart 2025",
        time: "16:00",
        place: "Uygulama Mutfağı",
        rules: "Hijyen kurallarına uyulacaktır."
    },
    {
        id: 3,
        title: "Mad Max İzleme Etkinliği",
        clubId: "tiyatro",
        category: "Film ve Tiyatro",
        image: "assets/images/madmax.jpg",
        date: "20 Mart 2025",
        time: "18:00",
        place: "Konferans Salonu",
        rules: "Yiyecek ve İçecek Getirimi Yasaktır."
    },
    {
        id: 4,
        title: "MLBB 1V1 Yarışması",
        clubId: "esports",
        category: "Teknoloji",
        image: "assets/images/mlbb.jpg",
        date: "22 Mart 2025",
        time: "19:00",
        place: "Spor Salonunda Buluşulacaktır",
        rules: "Kendi hesabınızla katılınız."
    },
    {
        id: 5,
        title: "Alanya Turu",
        clubId: "gezginler",
        category: "Kültür",
        image: "assets/images/alanya.jpg",
        date: "30 Mart 2025",
        time: "08:00",
        place: "Rafet Kayış Fakültesi Önünde Toplanılacaktır",
        rules: "Kimlik zorunludur."
    },
    {
        id: 6,
        title: "Bağlama Kursu",
        clubId: "muzik",
        category: "Müzik",
        image: "assets/images/baglama.jpg",
        date: "25 Mart 2025",
        time: "17:00",
        place: "Müzik Salonu",
        rules: "Enstrüman getiriniz."
    }
];

/* TAB & FİLTRE */
document.getElementById("eventsTab").onclick = () => switchTab("events");
document.getElementById("clubsTab").onclick = () => switchTab("clubs");

document.getElementById("searchInput").oninput = e => {
    searchTerm = e.target.value.toLowerCase();
    render();
};

document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
        selectedCategory = btn.dataset.category;
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        render();
    };
});

function switchTab(tab) {
    activeTab = tab;
    selectedClub = null;
    render();
}

function selectClub(id) {
    selectedClub = id;
    activeTab = "events";
    render();
}

/* GİRİŞ */
function openLogin() {
    document.getElementById("loginModal").classList.remove("hidden");
    document.getElementById("loginModal").classList.add("flex");
}
function closeLogin() {
    document.getElementById("loginModal").classList.add("hidden");
}
function login() {
    localStorage.setItem("participant", "ok");
    closeLogin();
    alert("Giriş başarılı");
}

/* ETKİNLİK */
function joinEvent() {
    if (!localStorage.getItem("participant")) {
        openLogin();
    } else {
        alert("🎉 Etkinliğe katıldınız!");
    }
}

function showDetail(id) {
    const e = events.find(x => x.id === id);
    document.getElementById("detailTitle").innerText = e.title;
    document.getElementById("detailInfo").innerText =
        `${e.date} | ${e.time} | ${e.place}`;
    document.getElementById("detailRules").innerText =
        "Kurallar: " + e.rules;

    document.getElementById("detailModal").classList.remove("hidden");
    document.getElementById("detailModal").classList.add("flex");
}
function closeDetail() {
    document.getElementById("detailModal").classList.add("hidden");
}

/* RENDER */
function render() {
    const data = activeTab === "events" ? events : clubs;

    const filtered = data.filter(i => {
        const name = i.title || i.name;
        return name.toLowerCase().includes(searchTerm) &&
            (selectedCategory === "all" || i.category === selectedCategory) &&
            (activeTab !== "events" || !selectedClub || i.clubId === selectedClub);
    });

    grid.innerHTML = "";
    noResults.classList.toggle("hidden", filtered.length !== 0);

    filtered.forEach(i => {
        grid.innerHTML += `
        <div class="bg-white rounded-xl shadow overflow-hidden">
            ${i.image ? `<img src="${i.image}" class="w-full h-40 object-cover">` : ""}
            <div class="p-6">
                <h3 class="text-xl font-bold">${i.title || i.name}</h3>
                <p class="text-gray-500 mb-4">${i.category}</p>

                ${activeTab === "events" ? `
                    <div class="flex gap-2">
                        <button onclick="joinEvent()" class="bg-purple-600 text-white px-4 py-2 rounded-xl">Katıl</button>
                        <button onclick="showDetail(${i.id})" class="bg-blue-600 text-white px-4 py-2 rounded-xl">Etkinlik Detay</button>
                    </div>
                ` : `
                    <button onclick="selectClub('${i.id}')" class="bg-blue-600 text-white px-4 py-2 rounded-xl">Etkinlikleri Gör</button>
                `}
            </div>
        </div>`;
    });
}

render();
