document.getElementById('btn-estimate').addEventListener('click', function() {
    const product = document.getElementById('product').value;
    const price = parseFloat(document.getElementById('price').value);
    const location = document.getElementById('location').value;
    const conditionMultiplier = parseFloat(document.getElementById('condition').value);

    if (!product || isNaN(price) || price <= 0) {
        alert("Harap isi nama barang dan harga retail baru dengan nominal angka yang benar.");
        return;
    }

    // 1. Kalkulasi Depresiasi Harga
    // Rumus: Harga Baru * Pengali Kondisi
    const estimatedPrice = price * conditionMultiplier;
    
    // Potensi profit jika membeli di harga bawah dan menjual di harga atas (10% selisih)
    const margin = estimatedPrice * 0.10; 

    // Fungsi Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(number);
    };

    // Tampilkan Estimasi Range (Harga Bawah - Harga Atas)
    const priceLower = estimatedPrice - (estimatedPrice * 0.05);
    const priceUpper = estimatedPrice + (estimatedPrice * 0.05);
    
    document.getElementById('estimated-price').innerText = 
        `${formatRupiah(priceLower)} - ${formatRupiah(priceUpper)}`;
        
    document.getElementById('margin-info').innerText = 
        `Potensi margin/selisih aman: ${formatRupiah(margin)}`;

    // Tampilkan Elemen UI
    document.getElementById('result').classList.remove('hidden');

    // 2. Generator Google Dorks (Pencarian Spesifik)
    // Kata kunci ditambah istilah lapangan seperti BU (Butuh Uang) atau COD
    const searchTerms = `"${product}" "${location}" BU OR COD OR Nego`;
    
    document.getElementById('btn-olx').onclick = () => {
        const query = encodeURIComponent(`site:olx.co.id ${searchTerms}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    document.getElementById('btn-carousell').onclick = () => {
        const query = encodeURIComponent(`site:carousell.co.id ${searchTerms}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    document.getElementById('btn-fb').onclick = () => {
        // Facebook Marketplace butuh perlakuan sedikit berbeda karena strukturnya
        const fbTerms = `"${product}" "${location}"`;
        const query = encodeURIComponent(`site:facebook.com/marketplace ${fbTerms}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };
});
