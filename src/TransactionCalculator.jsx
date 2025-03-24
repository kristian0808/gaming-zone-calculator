import React, { useState, useEffect, useRef } from 'react';

const TransactionCalculator = () => {
    // Exchange rates (with LEK as base currency)
    const exchangeRates = {
        LEK: 1,
        EUR: 0.00966, // 1 LEK = 0.00966 EUR (approximately)
        USD: 0.01043  // 1 LEK = 0.01043 USD (approximately)
    };

    // LocalStorage key for saving transaction state
    const STORAGE_KEY = 'arcade_transaction_state';

    // Common currency denominations
    const commonDenominations = {
        LEK: [200, 500, 1000, 2000, 5000],
        EUR: [5, 10, 20, 50, 100],
        USD: [5, 10, 20, 50, 100]
    };

    // Language translations
    const translations = {
        EUR: {
            title: "Arcade Gaming Zone",
            pcUsage: "PC Usage",
            enterDirectCost: "Enter PC cost directly",
            pcCost: "PC Cost",
            hours: "Hours",
            minutes: "Minutes",
            hourlyRate: "Hourly Rate",
            foodAndDrinks: "Food & Drinks",
            searchProducts: "Search products...",
            searchOrEnter: "Search or manually enter items below",
            itemName: "Item name",
            price: "Price",
            add: "Add",
            noItems: "No items added",
            noProductsFound: "No products found",
            each: "each",
            foodTotal: "Food Total",
            payment: "Payment",
            currency: "Currency",
            amountPaid: "Amount Paid",
            quickPayment: "Quick Payment",
            resetAmount: "Reset Amount",
            total: "Total",
            paid: "Paid",
            change: "Change",
            insufficientPayment: "Insufficient payment",
            amountRemaining: "Amount remaining",
            newTransaction: "New Transaction",
            useArrowKeys: "Use ↑↓ keys to navigate, Enter to select",
            dataSaved: "Data automatically saved",
            dataSaved: "Data automatically saved",
            dataSaved: "Data automatically saved"
        },
        USD: {
            title: "Arcade Gaming Zone",
            pcUsage: "PC Usage",
            enterDirectCost: "Enter PC cost directly",
            pcCost: "PC Cost",
            hours: "Hours",
            minutes: "Minutes",
            hourlyRate: "Hourly Rate",
            foodAndDrinks: "Food & Drinks",
            searchProducts: "Search products...",
            searchOrEnter: "Search or manually enter items below",
            itemName: "Item name",
            price: "Price",
            add: "Add",
            noItems: "No items added",
            noProductsFound: "No products found",
            each: "each",
            foodTotal: "Food Total",
            payment: "Payment",
            currency: "Currency",
            amountPaid: "Amount Paid",
            quickPayment: "Quick Payment",
            resetAmount: "Reset Amount",
            total: "Total",
            paid: "Paid",
            change: "Change",
            insufficientPayment: "Insufficient payment",
            amountRemaining: "Amount remaining",
            newTransaction: "New Transaction",
            useArrowKeys: "Use ↑↓ keys to navigate, Enter to select"
        },
        LEK: {
            title: "Arcade Gaming Zone",
            pcUsage: "Përdorimi i PC",
            enterDirectCost: "Vendosni koston e PC-së direkt",
            pcCost: "Kosto e PC",
            hours: "Orë",
            minutes: "Minuta",
            hourlyRate: "Tarifa për orë",
            foodAndDrinks: "Ushqime & Pije",
            searchProducts: "Kërko produktet...",
            searchOrEnter: "Kërko ose fut artikujt manualisht më poshtë",
            itemName: "Emri i artikullit",
            price: "Çmimi",
            add: "Shto",
            noItems: "Asnjë artikull i shtuar",
            noProductsFound: "Asnjë produkt i gjetur",
            each: "secili",
            foodTotal: "Totali",
            payment: "Pagesa",
            currency: "Monedha",
            amountPaid: "Shuma e paguar",
            quickPayment: "Pagesa e shpejtë",
            resetAmount: "Rivendos shumën",
            total: "Totali",
            paid: "Paguar",
            change: "Kusur",
            insufficientPayment: "Pagesë e pamjaftueshme",
            amountRemaining: "Shuma e mbetur",
            newTransaction: "Transaksion i ri",
            useArrowKeys: "Përdorni tastet ↑↓ për të naviguar, Enter për të zgjedhur"
        }
    };

    // Product catalog (predefined list of items - prices in LEK as base currency)
    const productCatalog = [
        // Snacks
        { name: "7 Days Choco", price: 100 },
        { name: "7 Days Qershi", price: 100 },
        { name: "Bake Rolls Pizza", price: 100 },
        { name: "Bake Rolls Salt", price: 100 },
        { name: "Bake Rolls Sour Cream", price: 100 },
        { name: "Bake Rolls Tomato", price: 100 },
        { name: "Lays Oregano", price: 100 },
        { name: "Lays Djath", price: 100 },
        { name: "Lays Salt", price: 100 },
        { name: "Maretti Djath", price: 120 },
        { name: "Maretti Pizza", price: 120 },
        { name: "Maretti Tomato", price: 120 },
        { name: "Kikirik", price: 60 },
        { name: "Snickers", price: 100 },
        { name: "Bueno", price: 120 },

        // Drinks
        { name: "Amita Pjeshke", price: 120 },
        { name: "Amita Qershi", price: 120 },
        { name: "B52", price: 150 },
        { name: "Bravo Molle", price: 120 },
        { name: "Bravo Pjeshke", price: 120 },
        { name: "Cafe Mio", price: 200 },
        { name: "Caj limoni", price: 120 },
        { name: "Caj Pjeshke", price: 120 },
        { name: "Coca-Cola", price: 120 },
        { name: "Fanta Exotic", price: 120 },
        { name: "Fanta Portokall", price: 120 },
        { name: "Golden Eagle", price: 120 },
        { name: "Ivi Limon", price: 120 },
        { name: "Ivi Ricoco", price: 120 },
        { name: "Lemon Soda", price: 120 },
        { name: "Red Bull", price: 200 },

        // Water
        { name: "Qafshtama", price: 60 },
        { name: "Glina", price: 60 },
        { name: "Uje me vitamina", price: 100 }
    ];

    // Load saved state from localStorage if available
    const loadSavedState = () => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error('Error loading state from localStorage:', error);
        }
        return null;
    };

    const savedState = loadSavedState();

    // State management with persistence
    const [hours, setHours] = useState(savedState?.hours || 0);
    const [minutes, setMinutes] = useState(savedState?.minutes || 0);
    const [pcRate, setPcRate] = useState(savedState?.pcRate || 2); // Default PC hourly rate in EUR
    const [directPcCost, setDirectPcCost] = useState(savedState?.directPcCost || '');
    const [useDirectCost, setUseDirectCost] = useState(savedState?.useDirectCost !== undefined ? savedState.useDirectCost : true);
    const [foodItems, setFoodItems] = useState(savedState?.foodItems || []);
    const [newFoodItem, setNewFoodItem] = useState('');
    const [newFoodPrice, setNewFoodPrice] = useState('');
    const [newFoodQuantity, setNewFoodQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductList, setShowProductList] = useState(false);
    const [amountPaid, setAmountPaid] = useState(savedState?.amountPaid || '');
    const [currency, setCurrency] = useState(savedState?.currency || 'LEK');

    // New state for keyboard navigation
    const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const productListRef = useRef(null);

    // Get current language based on currency
    const t = translations[currency];

    // Reset selected index when search term changes
    useEffect(() => {
        setSelectedProductIndex(-1);
    }, [searchTerm]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedProductIndex >= 0 && productListRef.current) {
            const selectedItem = productListRef.current.children[selectedProductIndex];
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedProductIndex]);

    // Handle keyboard navigation
    const handleSearchKeyDown = (e) => {
        if (!showProductList || filteredProducts.length === 0) return;

        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedProductIndex(prev =>
                prev < filteredProducts.length - 1 ? prev + 1 : 0
            );
        }

        // Arrow up
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedProductIndex(prev =>
                prev > 0 ? prev - 1 : filteredProducts.length - 1
            );
        }

        // Enter to select
        if (e.key === 'Enter' && selectedProductIndex >= 0) {
            e.preventDefault();
            const selectedProduct = filteredProducts[selectedProductIndex];
            addFoodItem(selectedProduct.name, selectedProduct.price);
            setSelectedProductIndex(-1);
        }

        // Escape to close product list
        if (e.key === 'Escape') {
            setShowProductList(false);
            setSelectedProductIndex(-1);
        }
    };

    // Filter products based on search term and convert prices to current currency
    const filteredProducts = productCatalog
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(product => {
            // When currency is LEK, use the original price
            // When currency is EUR or USD, convert from LEK
            const convertedPrice = currency === 'LEK'
                ? product.price
                : Math.round(product.price * exchangeRates[currency]);
            return {
                ...product,
                price: convertedPrice
            };
        });

    // Calculate PC usage cost
    const calculatePCCost = () => {
        if (useDirectCost && directPcCost) {
            return Math.round(parseFloat(directPcCost));
        } else {
            const totalMinutes = (hours * 60) + parseInt(minutes);
            const hourlyRate = pcRate; // in selected currency
            return Math.round(hourlyRate * totalMinutes / 60);
        }
    };

    // Add food item to the list
    const addFoodItem = (item = null, price = null) => {
        if (item && price) {
            // Check if item already exists in the list
            const existingItemIndex = foodItems.findIndex(foodItem => foodItem.name === item);

            if (existingItemIndex !== -1) {
                // If item exists, update its quantity instead of adding a new entry
                const updatedItems = [...foodItems];
                updatedItems[existingItemIndex].quantity += newFoodQuantity;
                updatedItems[existingItemIndex].totalPrice = Math.round(updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity);
                setFoodItems(updatedItems);
            } else {
                // Add predefined item with current quantity
                setFoodItems([
                    ...foodItems,
                    {
                        name: item,
                        price: Math.round(price), // Round to whole number
                        quantity: newFoodQuantity,
                        totalPrice: Math.round(price) * newFoodQuantity
                    }
                ]);
            }
            setShowProductList(false);
            setSearchTerm('');
            setNewFoodQuantity(1); // Reset quantity after adding
        } else if (newFoodItem && newFoodPrice) {
            // Check if manually entered item already exists in the list
            const existingItemIndex = foodItems.findIndex(foodItem => foodItem.name.toLowerCase() === newFoodItem.toLowerCase());

            if (existingItemIndex !== -1) {
                // If item exists, update its quantity instead of adding a new entry
                const updatedItems = [...foodItems];
                updatedItems[existingItemIndex].quantity += newFoodQuantity;
                updatedItems[existingItemIndex].totalPrice = Math.round(updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity);
                setFoodItems(updatedItems);
            } else {
                // Add custom item with current quantity
                setFoodItems([
                    ...foodItems,
                    {
                        name: newFoodItem,
                        price: Math.round(parseFloat(newFoodPrice)), // Round to whole number
                        quantity: newFoodQuantity,
                        totalPrice: Math.round(parseFloat(newFoodPrice)) * newFoodQuantity
                    }
                ]);
            }
            setNewFoodItem('');
            setNewFoodPrice('');
            setNewFoodQuantity(1); // Reset quantity after adding
        }
    };

    // Remove food item from the list
    const removeFoodItem = (index) => {
        const updatedItems = [...foodItems];
        updatedItems.splice(index, 1);
        setFoodItems(updatedItems);
    };

    // Update item quantity
    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return; // Prevent quantity less than 1

        const updatedItems = [...foodItems];
        updatedItems[index].quantity = newQuantity;
        updatedItems[index].totalPrice = Math.round(updatedItems[index].price * newQuantity);
        setFoodItems(updatedItems);
    };

    // Calculate food cost
    const calculateFoodCost = () => {
        return Math.round(foodItems.reduce((total, item) => total + item.totalPrice, 0));
    };

    // Calculate total cost
    const calculateTotal = () => {
        const pcCost = parseInt(calculatePCCost());
        const foodCost = parseInt(calculateFoodCost());
        return pcCost + foodCost;
    };

    // Calculate change with insufficient payment feedback
    const calculateChange = () => {
        if (!amountPaid) return { value: 0, insufficient: false };

        const total = calculateTotal();
        const paid = Math.round(parseFloat(amountPaid));

        if (paid < total) {
            return {
                value: total - paid,
                insufficient: true
            };
        }

        return {
            value: paid - total,
            insufficient: false
        };
    };

    // Add denomination to amount paid
    const addDenomination = (value) => {
        const currentAmount = parseFloat(amountPaid) || 0;
        setAmountPaid((currentAmount + value).toString());
    };

    // Format price based on currency
    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        switch (currency) {
            case 'EUR': return `€${roundedPrice}`;
            case 'USD': return `$${roundedPrice}`;
            case 'LEK': return `${roundedPrice} LEK`;
            default: return `€${roundedPrice}`;
        }
    };

    // Handle currency change
    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);

        // Convert all existing food items to the new currency
        if (foodItems.length > 0) {
            const updatedItems = foodItems.map(item => {
                let newPrice;
                if (currency === 'LEK') {
                    // Converting from LEK (base) to another currency
                    newPrice = Math.round(item.price * exchangeRates[newCurrency]);
                } else if (newCurrency === 'LEK') {
                    // Converting from another currency back to LEK (base)
                    newPrice = Math.round(item.price / exchangeRates[currency]);
                } else {
                    // Converting between non-base currencies (EUR to USD or vice versa)
                    // First convert to LEK, then to the new currency
                    const priceInLek = Math.round(item.price / exchangeRates[currency]);
                    newPrice = Math.round(priceInLek * exchangeRates[newCurrency]);
                }

                return {
                    ...item,
                    price: newPrice,
                    totalPrice: newPrice * item.quantity
                };
            });
            setFoodItems(updatedItems);
        }

        // Convert direct PC cost if it exists
        if (directPcCost) {
            let newCost;
            if (currency === 'LEK') {
                newCost = Math.round(parseFloat(directPcCost) * exchangeRates[newCurrency]);
            } else if (newCurrency === 'LEK') {
                newCost = Math.round(parseFloat(directPcCost) / exchangeRates[currency]);
            } else {
                const costInLek = Math.round(parseFloat(directPcCost) / exchangeRates[currency]);
                newCost = Math.round(costInLek * exchangeRates[newCurrency]);
            }
            setDirectPcCost(newCost.toString());
        }

        // Convert hourly rate
        let newRate;
        if (currency === 'LEK') {
            newRate = Math.round(pcRate * exchangeRates[newCurrency]);
        } else if (newCurrency === 'LEK') {
            newRate = Math.round(pcRate / exchangeRates[currency]);
        } else {
            const rateInLek = Math.round(pcRate / exchangeRates[currency]);
            newRate = Math.round(rateInLek * exchangeRates[newCurrency]);
        }
        setPcRate(newRate);

        // Convert amount paid if it exists
        if (amountPaid) {
            let newAmount;
            if (currency === 'LEK') {
                newAmount = Math.round(parseFloat(amountPaid) * exchangeRates[newCurrency]);
            } else if (newCurrency === 'LEK') {
                newAmount = Math.round(parseFloat(amountPaid) / exchangeRates[currency]);
            } else {
                const amountInLek = Math.round(parseFloat(amountPaid) / exchangeRates[currency]);
                newAmount = Math.round(amountInLek * exchangeRates[newCurrency]);
            }
            setAmountPaid(newAmount.toString());
        }
    };

    // Save current state to localStorage
    const saveState = () => {
        try {
            const stateToSave = {
                hours,
                minutes,
                pcRate,
                directPcCost,
                useDirectCost,
                foodItems,
                amountPaid,
                currency
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state to localStorage:', error);
        }
    };

    // Save state whenever relevant values change
    useEffect(() => {
        saveState();
    }, [hours, minutes, pcRate, directPcCost, useDirectCost, foodItems, amountPaid, currency]);

    // Reset form for new transaction
    const resetForm = () => {
        setHours(0);
        setMinutes(0);
        setFoodItems([]);
        setAmountPaid('');
        setDirectPcCost('');
        setSearchTerm('');
        setShowProductList(false);
        setSelectedProductIndex(-1);
        setNewFoodItem('');
        setNewFoodPrice('');
        setNewFoodQuantity(1);

        // Clear localStorage
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    };

    // Get change result
    const changeResult = calculateChange();

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">{t.title}</h1>

            {/* PC Usage Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-semibold mb-2">{t.pcUsage}</h2>

                <div className="mb-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useDirectCost}
                            onChange={() => setUseDirectCost(!useDirectCost)}
                            className="mr-2"
                        />
                        <span className="text-sm">{t.enterDirectCost}</span>
                    </label>
                </div>

                {useDirectCost ? (
                    <div className="mb-2">
                        <label className="block text-sm mb-1">{t.pcCost}</label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={directPcCost}
                            onChange={(e) => setDirectPcCost(e.target.value)}
                            className="w-full border border-gray-300 bg-white p-2 rounded"
                            placeholder={t.pcCost}
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                                <label className="block text-sm mb-1">{t.hours}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={hours}
                                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                                    className="w-full border bg-white border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm mb-1">{t.minutes}</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                    className="w-full p-2 border bg-white border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm mb-1">{t.hourlyRate}</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={pcRate}
                                onChange={(e) => setPcRate(parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-300 p-2 rounded"
                            />
                        </div>
                    </>
                )}

                <div className="text-right font-semibold">
                    {t.pcCost}: {formatPrice(calculatePCCost())}
                </div>
            </div>

            {/* Food Items Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-semibold mb-2">{t.foodAndDrinks}</h2>

                {/* Search and Quick Add */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t.searchProducts}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowProductList(true);
                            }}
                            onFocus={() => setShowProductList(true)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-white border border-gray-300 p-2 rounded mb-1"
                        />
                        {showProductList && searchTerm && (
                            <div>
                                <div className="text-xs text-gray-500 mb-1">{t.useArrowKeys}</div>
                                <div
                                    ref={productListRef}
                                    className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto"
                                >
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product, index) => (
                                            <div
                                                key={index}
                                                className={`p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${selectedProductIndex === index ? 'bg-blue-100' : ''}`}
                                                onClick={() => addFoodItem(product.name, product.price)}
                                                onMouseEnter={() => setSelectedProductIndex(index)}
                                            >
                                                <span>{product.name}</span>
                                                <span className="font-semibold">{formatPrice(product.price)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-gray-500">{t.noProductsFound}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        {t.searchOrEnter}
                    </div>
                </div>

                {/* Manual Entry */}
                <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder={t.itemName}
                            value={newFoodItem}
                            onChange={(e) => setNewFoodItem(e.target.value)}
                            className="w-full border border-gray-300 p-2 bg-white rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            placeholder={t.price}
                            min="0"
                            step="1"
                            value={newFoodPrice}
                            onChange={(e) => setNewFoodPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 bg-white rounded"
                        />
                    </div>
                    <button
                        onClick={() => addFoodItem()}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {t.add}
                    </button>
                </div>

                {/* Custom Scrollbar Styles */}
                <style jsx>{`
                    .custom-scrollbar {
                        scrollbar-width: thin;  /* For Firefox */
                        scrollbar-color: rgba(203, 213, 225, 0.3) transparent;  /* For Firefox */
                        transition: all 0.3s ease;
                    }
                    
                    .custom-scrollbar:hover {
                        scrollbar-color: rgba(148, 163, 184, 0.8) transparent;  /* For Firefox */
                    }
                    
                    /* For Chrome, Safari, and Edge */
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 10px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: rgba(203, 213, 225, 0.3);
                        border-radius: 10px;
                        transition: background-color 0.3s ease;
                    }
                    
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                        background-color: rgba(148, 163, 184, 0.8);
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(100, 116, 139, 0.9);
                    }
                `}</style>

                {/* Food Items List */}
                <div className="max-h-40 overflow-y-auto custom-scrollbar mb-2 relative">
                    {foodItems.length > 0 ? (
                        <ul className="divide-y divide-gray-300">
                            {foodItems.map((item, index) => (
                                <li key={index} className="py-2 grid grid-cols-3 items-center gap-x-[0px]">

                                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="flex items-center rounded w-20">
                                        <button
                                            className="w-6 h-6 bg-gray-200 flex items-center justify-center hover:bg-gray-300 rounded-l"
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <div className="w-8 h-6 bg-white flex items-center justify-center">
                                            {item.quantity}
                                        </div>
                                        <button
                                            className="w-6 h-6 bg-gray-200 flex items-center justify-center hover:bg-gray-300 rounded-r"
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-[100px] justify-end">
                                        <span className="font-semibold text-right">{formatPrice(item.totalPrice)}</span>
                                        <button
                                            onClick={() => removeFoodItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-2">{t.noItems}</p>
                    )}
                </div>
                <div className='p-2'>
                    <div className="flex flex-row justify-end">
                        <span className="font-semibold">{t.foodTotal}:</span>
                        <span className="font-semibold min-w-24 text-right">{formatPrice(calculateFoodCost())}</span>
                    </div>
                </div>
            </div>

            {/* Payment Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-semibold mb-2">{t.payment}</h2>
                <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm mb-1">{t.currency}</label>
                        <select
                            value={currency}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 bg-white rounded"
                        >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="LEK">Lek (ALL)</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm mb-1">{t.amountPaid}</label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="w-full p-2 border border-gray-300 bg-white rounded"
                        />
                    </div>
                </div>

                {/* Quick Payment Buttons */}
                <div className="mb-2">
                    <label className="block text-sm mb-1">{t.quickPayment}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {commonDenominations[currency].map((value, index) => (
                            <button
                                key={index}
                                onClick={() => addDenomination(value)}
                                className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-center"
                            >
                                {formatPrice(value)}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                setAmountPaid('');
                            }}
                            className="px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 text-center"
                        >
                            {t.resetAmount}
                        </button>
                    </div>
                </div>
            </div>

            {/* Totals Section */}
            <div className="p-4 bg-blue-50 rounded-md">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">{t.total}:</span>
                    <span className="font-bold">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">{t.paid}:</span>
                    <span>{formatPrice(amountPaid || 0)}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span className="font-semibold">
                        {changeResult.insufficient ? t.amountRemaining : t.change}:
                    </span>
                    <span className={`font-bold ${changeResult.insufficient ? 'text-red-600' : ''}`}>
                        {formatPrice(changeResult.value)}
                        {changeResult.insufficient && ' ⚠️'}
                    </span>
                </div>
                {changeResult.insufficient && (
                    <div className="mt-2 text-red-600 text-sm font-medium">
                        {t.insufficientPayment}
                    </div>
                )}
            </div>

            {/* Quick Reset Button */}
            <button
                onClick={resetForm}
                className="w-full mt-4 p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
                {t.newTransaction}
            </button>
        </div>
    );
};

export default TransactionCalculator;