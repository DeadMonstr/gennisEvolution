import { useNavigate } from "react-router-dom"
import styles from "./accountingProfileOverhead.module.sass"

const categories = [
    { id: 1, name: "Kommunal Xarajatlar", description: "Elektr, Suv, Gaz", total: 5000000 },
    { id: 2, name: "Sodir Tutar Xarajatlar", description: "Ofis materiallar", total: 2300000 },
    { id: 3, name: "Ixcham va Asboblar", description: "Saqlash xarajatlari", total: 1800000 },
    { id: 4, name: "Transport", description: "Taksi, benzin", total: 3500000 },
    { id: 5, name: "Boshqa Xarajatlar", description: "Turli xarajatlar", total: 1200000 },
]

const AccountingProfileOverhead = () => {
    const navigate = useNavigate()

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
                        <span className={styles.breadcrumbItemActive}>Qo'shimcha Xarajatlar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Xarajat Kategoriyalarini Tanlang</h1>
                        {/* <p className={styles.subtitle}>Select category to view details</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.cardsGrid}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={styles.categoryCard}
                            onClick={() => navigate(`${category.id}`)}
                        >
                            <div className={styles.categoryCardHeader}>
                                <h3 className={styles.categoryCardTitle}>{category.name}</h3>
                            </div>
                            <div className={styles.categoryCardContent}>
                                <p className={styles.categoryCardDescription}>{category.description}</p>
                                <div className={styles.categoryCardTotal}>
                                    <p className={styles.categoryCardTotalLabel}>Umumiy Xarajat</p>
                                    <p className={styles.categoryCardTotalValue}>{formatCurrency(category.total)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate("overall")} className={styles.navButton}>
                    Umumiy Ma'lumotlarni Ko'rish
                </button>
            </div>
        </main>
    )
}

export default AccountingProfileOverhead