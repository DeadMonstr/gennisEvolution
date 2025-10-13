import styles from "./teacherEquipment.module.sass"

function parseText(text) {
  const parts = text?.split(" ta ")
  return {
    quantity: parts[0] || "",
    itemName: parts[1] || text,
  }
}

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CommentIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

export function TeacherEquipment({ order, onChange, onDelete, statuses, isDelete }) {
    
  const { quantity, itemName } = parseText(order.text)

  return (
    <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.userInfo}>
              <div className={styles.avatar}>
                  <UserIcon />
              </div>
              <div className={styles.userDetails}>
                  <div className={styles.userName}>{order.teacher_name}</div>
                  <div className={styles.branchName}>{order.branch_name}</div>
              </div>
          </div>
          {
            !isDelete &&
            <div className={styles.cardTop__inner}>
              <div onClick={onChange} className={`${styles.status} ${styles[order.status]}`}>{statuses?.filter(item => item.id === order.status)[0]?.name}</div>
              <i
                className="fas fa-trash"
                onClick={onDelete}
              /> 
            </div>
          }
        </div>

        <div className={styles.orderDetails}>
            <div className={styles.quantity}>
                <div className={styles.quantityNumber}>{quantity}</div>
                <div className={styles.quantityUnit}>Soni</div>
            </div>
            <div className={styles.itemInfo}>
                <div className={styles.itemLabel}>Nomi</div>
                <div className={styles.itemName}>{itemName}</div>
            </div>
        </div>
        <div className={styles.priceLocation}>
          <div>
            <p>Narxi</p>
            <p>{order.price.toLocaleString("ru-RU")} so'm</p>
          </div>
          <div>
            <p>Addres</p>
            <p>{order.address}</p>
          </div>
        </div>

        <div className={styles.commentBox}>
            <CommentIcon/>
            <div>
                <p className={styles.title}>Koment</p>
                <p className={styles.text}>{order.comment}</p>
            </div>
        </div>

        <div className={styles.dates}>
            <div className={styles.dateItem}>
                <CalendarIcon />
                <span className={styles.dateLabel}>Yaratilgan:</span>
                <span className={styles.dateValue}>{new Date(order.created_at).toLocaleDateString("ru-RU")}</span>
            </div>
            <div className={styles.dateItem}>
                <CalendarIcon />
                <span className={styles.dateLabel}>Yangilangan:</span>
                <span className={styles.dateValue}>{new Date(order.updated_at).toLocaleDateString("ru-RU")}</span>
            </div>
        </div>
    </div>
  )
}