import { lazyLoadMaps } from './js/map-loader.js';

document.addEventListener('DOMContentLoaded', () => {
    const retailersGrid = document.getElementById('retailersGrid');
    const searchInput = document.getElementById('searchInput');
    const noResultsDiv = document.getElementById('noResults');
    const totalRetailersSpan = document.getElementById('totalRetailers');
    const totalAreasSpan = document.getElementById('totalAreas');
    const visibleRetailersSpan = document.getElementById('visibleRetailers');

    let allStores = [];

    // Function to fetch and parse CSV
    async function fetchCsvData(url) {
        const response = await fetch(url);
        const text = await response.text();
        return parseCsv(text);
    }

    // Function to parse CSV text
    function parseCsv(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCsvLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = values[j];
                }
                data.push(row);
            }
        }
        return data;
    }

    // Function to parse a single CSV line, handling commas within quotes
    function parseCsvLine(line) {
        const values = [];
        let inQuote = false;
        let currentField = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                values.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim()); // Add the last field
        return values;
    }

    // Function to create a retailer card
    function createRetailerCard(store) {
        const card = document.createElement('div');
        card.className = 'retailer-card';
        card.setAttribute('data-store-id', store.ID); // Add data attribute for lazy loading

        // Construct the map URL using the store's Location and address for embedding without an API key
        const mapQuery = encodeURIComponent(`Specsmakers store, ${store.Location}, ${store.address}`);
        const embedSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;

        let mapHtml = '';
        if (mapQuery) {
            mapHtml = `<iframe class="lazy-map" data-src="${embedSrc}" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        } else {
            mapHtml = '<div class="map-error">Map embedding failed. Location/address data missing.</div>';
        }

        // Clean and collect unique contact numbers
        const rawContacts = [store.contact, store.contact2, store.contact3];
        const cleanedContacts = new Set();
        rawContacts.forEach(c => {
            if (c) {
                const cleaned = c.replace(/^tel:/, '').trim(); // Remove 'tel:' only at the beginning
                if (cleaned) { // Only add if not empty after cleaning
                    cleanedContacts.add(cleaned);
                }
            }
        });

        let contactLinksHtml = '';
        if (cleanedContacts.size > 0) {
            contactLinksHtml = Array.from(cleanedContacts).map(number => {
                return `<a href="tel:${number}" class="contact-link">${number}</a>`;
            }).join('');
        }

        card.innerHTML = `
            <span class="retailer-id-badge">${store.ID}</span>
            <h3>${store.Location}</h3>
            <p>${store.address}</p>
            ${contactLinksHtml ? `<div class="contact-numbers">${contactLinksHtml}</div>` : ''}
            <div class="map-container">
                ${mapHtml}
            </div>
            <div class="card-actions">
                <a href="${store.maps}" target="_blank" class="button">Directions</a>
            </div>
        `;
        return card;
    }

    // Function to render stores
    function renderStores(stores) {
        retailersGrid.innerHTML = '';
        if (stores.length === 0) {
            noResultsDiv.classList.remove('hidden');
        } else {
            noResultsDiv.classList.add('hidden');
            stores.forEach(store => {
                const card = createRetailerCard(store);
                retailersGrid.appendChild(card);
            });
            lazyLoadMaps(retailersGrid); // Call lazyLoadMaps after all cards are appended
        }
        visibleRetailersSpan.textContent = stores.length;
    }

    // Function to filter stores based on search input
    function filterStores() {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = allStores.filter(store =>
            store.Location.toLowerCase().includes(searchTerm) ||
            store.address.toLowerCase().includes(searchTerm) ||
            store.ID.toLowerCase().includes(searchTerm)
        );
        renderStores(filtered);
    }

    // Initialize
    fetchCsvData('specsmakers-storedata.csv').then(data => {
        allStores = data;
        renderStores(allStores);

        const uniqueAreas = new Set(allStores.map(store => store.Location.split(',').pop().trim()));
        totalRetailersSpan.textContent = allStores.length;
        totalAreasSpan.textContent = uniqueAreas.size;
    });

    searchInput.addEventListener('input', filterStores);
});