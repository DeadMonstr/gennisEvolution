import { useNavigate, useParams } from "react-router-dom"
import styles from "./accountingProfileCategory.module.sass"

const categoryData = {
    1: {
        name: "Kommunal Xarajatlar",
        total: 5000000,
        items: [
            { name: "Elektr", amount: 2500000 },
            { name: "Suv", amount: 1500000 },
            { name: "Gaz", amount: 1000000 },
        ],
    },
    2: {
        name: "Sodir Tutar Xarajatlar",
        total: 2300000,
        items: [
            { name: "Qog'oz", amount: 800000 },
            { name: "Siyoh va Qalam", amount: 500000 },
            { name: "Boshqa Materiallar", amount: 1000000 },
        ],
    },
    3: {
        name: "Ixcham va Asboblar",
        total: 1800000,
        items: [
            { name: "Asboblar Saqlash", amount: 1000000 },
            { name: "Ixcham", amount: 800000 },
        ],
    },
    4: {
        name: "Transport",
        total: 3500000,
        items: [
            { name: "Taksi", amount: 2000000 },
            { name: "Benzin", amount: 1500000 },
        ],
    },
    5: {
        name: "Boshqa Xarajatlar",
        total: 1200000,
        items: [{ name: "Turli Xarajatlar", amount: 1200000 }],
    },
}

const AccountingProfileCategory = () => {
    const navigate = useNavigate()
    const { categoryId } = useParams()

    const data = categoryData[categoryId] || categoryData["1"]

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("uz-UZ", {
            style: "currency",
            currency: "UZS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItem}>Qo'shimcha Xarajatlar</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>{data.name} - Summa</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{data.name}</h1>
                        {/* <p className={styles.subtitle}>Item Total Sum</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.totalCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardLabel}>Umumiy Xarajat Summasi</h3>
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.cardValue}>{formatCurrency(data.total)}</p>
                    </div>
                </div>

                <div className={styles.detailsCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Xarajat Tafsiloti</h3>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.itemsList}>
                            {data.items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemAmount}>{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* <button onClick={() => router.push("/category/overhead/overall")} className={styles.navButton}>
                    Umumiy Ma'lumotlarni Ko'rish
                </button> */}
            </div>
        </main>
    )
}

export default AccountingProfileCategory