const productInput = document.getElementById('product');
const locationInput = document.getElementById('location');

// Tombol Pintas Membuka Pasaran Eksternal
document.getElementById('btn-olx').addEventListener('click', function() {
    const prod = productInput.value || "Barang";
    const loc = locationInput.value || "Indonesia";
    const query = encodeURIComponent(`site:olx.co.id "${prod}" "${loc}"`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
});

document.getElementById('btn-fb').addEventListener('click', function() {
    const prod = productInput.value || "Barang";
    const loc = locationInput.value || "Indonesia";
    const query = encodeURIComponent(`site:facebook.com/marketplace "${prod}" "${loc}"`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
});

// Kalkulator Harga Pantas
document.getElementById('btn-calculate').addEventListener('click', function() {
    const p1 = parseFloat(document.getElementById('price1').value) || 0;
    const p2 = parseFloat(document.getElementById('price2').value) || 0;
    const p3 = parseFloat(document.getElementById('price3').value) || 0;

    const validPrices = [p1, p2, p3].filter(p => p > 0);

    if (validPrices.length === 0) {
        alert("Harap masukkan setidaknya satu sampel harga dari pasaran.");
        return;
    }

    // Hitung Rata-rata Pasaran (Harga Pantas)
    const total = validPrices.reduce((acc, curr) => acc + curr, 0);
    const marketAvg = total / validPrices.length;

    // Batas Maksimal Beli (Amankan margin 15% untuk tawar menawar / operasional COD)
    const maxBuy = marketAvg * 0.85;

    // Target Jual Kembali (Wajar di pasaran)
    const targetSell = marketAvg;

    // Estimasi Profit Bersih
    const estProfit = targetSell - maxBuy;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(number);
    };

    document.getElementById('market-avg').innerText = formatRupiah(marketAvg);
    document.getElementById('max-buy').innerText = formatRupiah(maxBuy);
    document.getElementById('target-sell').innerText = formatRupiah(targetSell);
    document.getElementById('est-profit').innerText = formatRupiah(estProfit);

    document.getElementById('result').classList.remove('hidden');
});
