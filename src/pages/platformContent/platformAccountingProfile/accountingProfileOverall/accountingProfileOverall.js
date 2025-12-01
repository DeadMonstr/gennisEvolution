import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Input from "components/platform/platformUI/input"

import styles from "./accountingProfileOverall.module.sass"

const overheadItems = [
    { id: 1, category: "Kommunal Xarajatlar", items: 3, total: 5000000 },
    { id: 2, category: "Sodir Tutar Xarajatlar", items: 3, total: 2300000 },
    { id: 3, category: "Ixcham va Asboblar", items: 2, total: 1800000 },
    { id: 4, category: "Transport", items: 2, total: 3500000 },
    { id: 5, category: "Boshqa Xarajatlar", items: 1, total: 1200000 },
]

const AccountingProfileOverall = () => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState("total")
    const [filterType, setFilterType] = useState("cash")

    const totalSum = overheadItems.reduce((sum, item) => sum + item.total, 0)
    const avgExpense = totalSum / overheadItems.length

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("uz-UZ", {
            style: "currency",
            currency: "UZS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const sortedItems = [...overheadItems].sort((a, b) => {
        if (sortBy === "name") return a.category.localeCompare(b.category)
        return b.total - a.total
    })

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItem}>Qo'shimcha Xarajatlar</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>Umumiy Ma'lumotlar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Umumiy Xarajatlar Ma'lumoti</h1>
                        {/* <p className={styles.subtitle}>Final Summary and Overview</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Xarajat</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>{formatCurrency(totalSum)}</p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>O'rtacha Xarajat</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>{formatCurrency(avgExpense)}</p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardTertiary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Kategoriya Soni</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>{overheadItems.length}</p>
                        </div>
                    </div>
                </div>

                {/* <div className={styles.sortCard}>
                    <div className={styles.sortHeader}>
                        <h3 className={styles.sortTitle}>Xarajatlarni Saralash</h3>
                        <div className={styles.sortButtons}>
                            <button
                                onClick={() => setSortBy("name")}
                                className={`${styles.sortBtn} ${sortBy === "name" ? styles.sortBtnActive : ""}`}
                            >
                                Nomi bo'yicha
                            </button>
                            <button
                                onClick={() => setSortBy("total")}
                                className={`${styles.sortBtn} ${sortBy === "total" ? styles.sortBtnActive : ""}`}
                            >
                                Summasi bo'yicha
                            </button>
                        </div>
                    </div>
                </div> */}

                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Filtrlash</h3>
                    </div>
                    <div className={styles.filterButtons}>
                        <div className={styles.filterButtons__btns}>
                            <button
                                onClick={() => setFilterType("cash")}
                                className={`${styles.filterBtn} ${filterType === "cash" ? styles.filterBtnActive : ""}`}
                            >
                                Cash
                            </button>
                            <button
                                onClick={() => setFilterType("bank")}
                                className={`${styles.filterBtn} ${filterType === "bank" ? styles.filterBtnActive : ""}`}
                            >
                                Bank
                            </button>
                            <button
                                onClick={() => setFilterType("click")}
                                className={`${styles.filterBtn} ${filterType === "click" ? styles.filterBtnActive : ""}`}
                            >
                                Click
                            </button>
                        </div>
                        <Input clazzLabel={styles.filterButtons__input} onChange={() => { }} type={"date"} />
                    </div>
                    <div className={styles.sortButtons}>
                        <button
                            onClick={() => setSortBy("name")}
                            className={`${styles.sortBtn} ${sortBy === "name" ? styles.sortBtnActive : ""}`}
                        >
                            Nomi bo'yicha
                        </button>
                        <button
                            onClick={() => setSortBy("total")}
                            className={`${styles.sortBtn} ${sortBy === "total" ? styles.sortBtnActive : ""}`}
                        >
                            Summasi bo'yicha
                        </button>
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Xarajat Kategoriyalari</h3>
                    </div>
                    <div className={styles.tableContent}>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tableHeaderRow}>
                                        <th className={styles.tableHeaderCell}>Kategoriya</th>
                                        <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellCenter}`}>Element Soni</th>
                                        <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Umumiy Xarajat</th>
                                        <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Foiz</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedItems.map((item) => {
                                        const percentage = ((item.total / totalSum) * 100).toFixed(1)
                                        return (
                                            <tr key={item.id} className={styles.tableRow}>
                                                <td className={styles.tableCell}>{item.category}</td>
                                                <td className={`${styles.tableCell} ${styles.tableCellCenter} ${styles.tableCellMuted}`}>
                                                    {item.items}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                                                    {formatCurrency(item.total)}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                                                    <div className={styles.progressContainer}>
                                                        <div className={styles.progressBar}>
                                                            <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                                                            <span className={styles.progressBar__string}>{percentage}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={styles.footerButtons}>
                    <button onClick={() => navigate("../../")} className={styles.homeBtn}>
                        Bosh Sahifaga
                    </button>
                </div>
            </div>
        </main>
    )
}

export default AccountingProfileOverall