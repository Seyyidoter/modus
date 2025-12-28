import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            common: {
                add: 'Add',
                cancel: 'Cancel',
                save: 'Save',
                delete: 'Delete',
                actions: 'Actions',
                loading: 'Loading...'
            },
            menu: {
                products: 'Products',
                stock: 'Stock Overview',
                movements: 'Movements & Transfer'
            },
            products: {
                title: 'Product Management',
                addProduct: 'Add Product',
                table: {
                    sku: 'SKU',
                    name: 'Name',
                    unit: 'Unit',
                    price: 'Price'
                },
                form: {
                    createTitle: 'Add New Product',
                    sku: 'SKU',
                    name: 'Product Name',
                    unit: 'Unit (e.g. PCS, KG)',
                    price: 'Unit Price',
                    desc: 'Description'
                },
                success: 'Product created successfully',
                error: 'Failed to create product'
            },
            stock: {
                title: 'Stock Overview',
                selectWarehouse: 'Select Warehouse:',
                placeholder: 'Choose a warehouse',
                alert: 'Please select a warehouse to view stock.',
                table: {
                    sku: 'SKU',
                    product: 'Product',
                    quantity: 'Quantity'
                }
            },
            movements: {
                title: 'Stock Movements',
                type: {
                    in: 'Stock IN',
                    out: 'Stock OUT',
                    transfer: 'Transfer'
                },
                form: {
                    product: 'Product',
                    selectProduct: 'Select a product',
                    warehouse: 'Warehouse',
                    selectWarehouse: 'Select Warehouse',
                    source: 'Source Warehouse',
                    target: 'Target Warehouse',
                    from: 'From...',
                    to: 'To...',
                    quantity: 'Quantity',
                    note: 'Note',
                    submitMovement: 'Record Movement',
                    submitTransfer: 'Execute Transfer'
                },
                success: 'Movement recorded successfully!',
                error: 'Error recording movement'
            },

            customers: {
                title: 'Customer & Supplier Management',
                add: 'Add Customer',
                edit: 'Edit',
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                address: 'Address',
                taxId: 'Tax ID',
                type: 'Type',
                types: {
                    CUSTOMER: 'Customer',
                    SUPPLIER: 'Supplier',
                    BOTH: 'Both'
                },
                success: 'Customer saved',
                deleteConfirm: 'Are you sure you want to delete this customer?'
            },
            demands: {
                title: 'Internal Demands',
                add: 'New Demand',
                status: 'Status',
                priority: 'Priority',
                requester: 'Requester',
                dueDate: 'Due Date',
                items: 'Items',
                createOffer: 'Create Offer'
            },
            offers: {
                title: 'Customer Offers',
                create: 'Create Offer',
                add: 'New Offer',
                customer: 'Customer',
                total: 'Total Amount',
                status: 'Status',
                validUntil: 'Valid Until',
                convertFromDemand: 'Create Offer from this Demand'
            },
            dashboard: {
                title: 'Dashboard',
                totalProducts: 'Total Products',
                totalCustomers: 'Total Customers',
                pendingDemands: 'Pending Demands',
                totalRevenue: 'Accepted Offers',
                lowStock: 'Low Stock Alert (< 10)',
                recentActivity: 'Recent Activity',
                product: 'Product',
                quantity: 'Quantity'
            }
        }
    },
    tr: {
        translation: {
            common: {
                add: 'Ekle',
                cancel: 'İptal',
                save: 'Kaydet',
                delete: 'Sil',
                actions: 'İşlemler',
                loading: 'Yükleniyor...'
            },
            menu: {
                products: 'Ürünler',
                stock: 'Stok Durumu',
                movements: 'Hareketler & Transfer'
            },
            products: {
                title: 'Ürün Yönetimi',
                addProduct: 'Ürün Ekle',
                table: {
                    sku: 'Stok Kodu',
                    name: 'Ürün Adı',
                    unit: 'Birim',
                    price: 'Fiyat'
                },
                form: {
                    createTitle: 'Yeni Ürün Ekle',
                    sku: 'Stok Kodu',
                    name: 'Ürün Adı',
                    unit: 'Birim (Örn: ADET)',
                    price: 'Birim Fiyat',
                    desc: 'Açıklama'
                },
                success: 'Ürün başarıyla oluşturuldu',
                error: 'Ürün oluşturulamadı'
            },
            stock: {
                title: 'Stok Durumu',
                selectWarehouse: 'Depo Seçin:',
                placeholder: 'Bir depo seçin',
                alert: 'Stok durumunu görmek için lütfen bir depo seçin.',
                table: {
                    sku: 'Stok Kodu',
                    product: 'Ürün',
                    quantity: 'Miktar'
                }
            },
            movements: {
                title: 'Stok Hareketleri',
                type: {
                    in: 'Stok GİRİŞ',
                    out: 'Stok ÇIKIŞ',
                    transfer: 'Transfer'
                },
                form: {
                    product: 'Ürün',
                    selectProduct: 'Ürün seçin',
                    warehouse: 'Depo',
                    selectWarehouse: 'Depo Seçin',
                    source: 'Kaynak Depo',
                    target: 'Hedef Depo',
                    from: 'Buradan...',
                    to: 'Buraya...',
                    quantity: 'Miktar',
                    note: 'Not',
                    submitMovement: 'Hareketi Kaydet',
                    submitTransfer: 'Transferi Gerçekleştir'
                },
                success: 'Hareket başarıyla kaydedildi!',
                error: 'Hareket kaydedilirken hata oluştu'
            },
            customers: {
                title: 'Müşteri & Tedarikçi Yönetimi',
                add: 'Müşteri Ekle',
                edit: 'Düzenle',
                name: 'İsim',
                email: 'E-posta',
                phone: 'Telefon',
                address: 'Adres',
                taxId: 'Vergi No',
                type: 'Tip',
                types: {
                    CUSTOMER: 'Müşteri',
                    SUPPLIER: 'Tedarikçi',
                    BOTH: 'İkisi de'
                },
                success: 'Müşteri kaydedildi',
                deleteConfirm: 'Silmek istediğinize emin misiniz?'
            },
            demands: {
                title: 'Talep Yönetimi',
                add: 'Yeni Talep',
                status: 'Durum',
                priority: 'Öncelik',
                requester: 'Talep Eden',
                dueDate: 'Bitiş Tarihi',
                items: 'Ürünler',
                createOffer: 'Teklif Oluştur'
            },
            offers: {
                title: 'Teklif Yönetimi',
                create: 'Teklif Oluştur',
                add: 'Yeni Teklif',
                customer: 'Müşteri',
                total: 'Toplam Tutar',
                status: 'Durum',
                validUntil: 'Geçerlilik Tarihi',
                convertFromDemand: 'Bu talepten Teklif oluştur'
            },
            dashboard: {
                title: 'Kontrol Paneli',
                totalProducts: 'Toplam Ürün',
                totalCustomers: 'Toplam Müşteri',
                pendingDemands: 'Bekleyen Talepler',
                totalRevenue: 'Kabul Edilen Teklifler',
                lowStock: 'Kritik Stok Uyarısı (< 10)',
                recentActivity: 'Son Aktiviteler',
                product: 'Ürün',
                quantity: 'Miktar'
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
