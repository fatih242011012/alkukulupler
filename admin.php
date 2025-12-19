<?php
session_start();

// 1. GİRİŞ KONTROLÜ (Kullanıcı giriş yapmaya çalışıyorsa)
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Bilgiler doğruysa oturumu başlat
    if ($username === "admin" && $password === "admin123") {
        $_SESSION['loggedin'] = true;
    } else {
        $error = "Hatalı kullanıcı adı veya şifre!";
    }
}

// 2. ÇIKIŞ KONTROLÜ
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// 3. VERİ KAYDETME (Etkinlik Ekleme)
if (isset($_POST['add_event']) && isset($_SESSION['loggedin'])) {
    $newEvent = [
        'title' => $_POST['title'],
        'club'  => $_POST['club'],
        'detail' => $_POST['detail']
    ];
    
    // Mevcut etkinlikleri al veya yeni dizi oluştur
    $events = json_decode(file_get_contents('events.json'), true) ?: [];
    array_unshift($events, $newEvent); // Yeni etkinliği başa ekle
    file_put_contents('events.json', json_encode($events));
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Alkü Kampüs - Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

<?php if (!isset($_SESSION['loggedin'])): ?>
    <div class="min-h-screen flex items-center justify-center">
        <form method="POST" class="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-200">
            <h2 class="text-2xl font-bold mb-6 text-center text-purple-700">Yönetici Girişi</h2>
            <?php if(isset($error)): ?>
                <p class="text-red-500 text-sm mb-4"><?php echo $error; ?></p>
            <?php endif; ?>
            <input type="text" name="username" placeholder="Kullanıcı Adı" class="w-full mb-4 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500" required>
            <input type="password" name="password" placeholder="Şifre" class="w-full mb-6 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500" required>
            <button type="submit" name="login" class="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">Giriş Yap</button>
        </form>
    </div>

<?php else: ?>
    <header class="bg-purple-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 class="font-bold text-xl">Alkü Kampüs Admin Paneli</h1>
        <a href="?logout=1" class="bg-red-500 px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition">Güvenli Çıkış</a>
    </header>

    <div class="max-w-4xl mx-auto mt-10 p-4">
        <div class="bg-white p-6 rounded-xl shadow-md mb-10 border-t-4 border-purple-600">
            <h2 class="text-xl font-bold mb-4">Yeni Etkinlik Paylaş</h2>
            <form method="POST" class="space-y-4">
                <input type="text" name="title" placeholder="Etkinlik Adı" class="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-purple-500" required>
                <select name="club" class="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Okçuluk Kulübü</option>
                    <option>Gastronomi Kulübü</option>
                    <option>Esports Topluluğu</option>
                    <option>Müzik Topluluğu</option>
                </select>
                <textarea name="detail" placeholder="Detaylar (Gün, Saat, Yer...)" class="w-full p-2 border rounded h-32 outline-none focus:ring-2 focus:ring-purple-500" required></textarea>
                <button type="submit" name="add_event" class="bg-purple-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-purple-700 transition">Yayınla</button>
            </form>
        </div>

        <h2 class="text-xl font-bold mb-4 text-gray-700">Yayındaki Etkinlikler</h2>
        <div class="space-y-3">
            <?php
            $events = json_decode(file_get_contents('events.json'), true) ?: [];
            foreach ($events as $index => $e): ?>
                <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 border-purple-500">
                    <div>
                        <h4 class="font-bold"><?php echo htmlspecialchars($e['title']); ?></h4>
                        <p class="text-sm text-purple-600"><?php echo htmlspecialchars($e['club']); ?></p>
                    </div>
                    <span class="text-xs text-gray-400">Aktif</span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>

</body>
</html>