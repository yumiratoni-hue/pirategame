// --- DATABASE LOKAL (Kamus Harga Retail) ---
const databaseHarga = [
    { keywords: ["iphone 11", "64gb"], price: 6500000 },
    { keywords: ["iphone 11", "128gb"], price: 7500000 },
    { keywords: ["iphone 13", "128gb"], price: 11000000 },
    { keywords: ["samsung a54"], price: 5999000 },
    { keywords: ["poco x5", "pro"], price: 3799000 },
    { keywords: ["redmi note 12"], price: 2599000 },
    { keywords: ["vario 150"], price: 24500000 },
    { keywords: ["beat", "2023"], price: 18000000 },
    { keywords: ["nmax", "connected"], price: 32800000 },
    { keywords: ["scoopy", "2023"], price: 21900000 }
];

const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const autoFillInfo = document.getElementById('autofill-info');

// 1. Logika Auto-Fill Harga
productInput.addEventListener('input', function() {
    const userInput = this.value.toLowerCase();
    let foundPrice = null;

    for (let item of databaseHarga) {
        const matchAll = item.keywords.every(kw => userInput.includes(kw));
        if (matchAll) {
            foundPrice = item.price;
            break;
        }
    }

    if (foundPrice) {
        priceInput.value = foundPrice;
        autoFillInfo.innerText = "✨ Harga retail otomatis terdeteksi dari database!";
        autoFillInfo.style.color = "#059669";
    } else {
        autoFillInfo.innerText = "Ketik manual atau tambah nama seri secara spesifik.";
        autoFillInfo.style.color = "var(--text-muted)";
    }
});

// 2. Logika Hitung Estimasi
document.getElementById('btn-estimate').addEventListener('click', function() {
    const product = productInput.value;
    const price = parseFloat(priceInput.value);
    const location = document.getElementById('location').value;
    const conditionMultiplier = parseFloat(document.getElementById('condition').value);

    if (!product || isNaN(price) || price <= 0) {
        alert("Harap isi nama barang dan pastikan harga retail nominal angka yang benar.");
        return;
    }

    const estimatedPrice = price * conditionMultiplier;
    const margin = estimatedPrice * 0.10; 

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(number);
    };

    const priceLower = estimatedPrice - (estimatedPrice * 0.05);
    const priceUpper = estimatedPrice + (estimatedPrice * 0.05);
    
    document.getElementById('estimated-price').innerText = 
        `${formatRupiah(priceLower)} - ${formatRupiah(priceUpper)}`;
        
    document.getElementById('margin-info').innerText = 
        `Potensi margin/selisih aman: ${formatRupiah(margin)}`;

    document.getElementById('result').classList.remove('hidden');

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
        const fbTerms = `"${product}" "${location}"`;
        const query = encodeURIComponent(`site:facebook.com/marketplace ${fbTerms}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };
});
