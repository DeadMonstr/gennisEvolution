import React, {useState} from "react"
import { AlertCircle, DeleteIcon, Trash2 } from "lucide-react"

import Button from "components/platform/platformUI/button"
import Input from "components/platform/platformUI/input"

import styles from "./deleteForm.module.sass"
import logo from "assets/logo/Gennis logo.png";

export const DeleteAccountForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmText: "",
  })
  const [confirmations, setConfirmations] = useState({
    dataLoss: false,
    irreversible: false,
    understand: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.username || !formData.password) {
      setError("Пожалуйста, заполните все поля")
      return
    }

    if (!confirmations.dataLoss || !confirmations.irreversible || !confirmations.understand) {
      setError("Пожалуйста, подтвердите все пункты")
      return
    }

    if (formData.confirmText !== "УДАЛИТЬ") {
      setError('Введите "УДАЛИТЬ" для подтверждения')
      return
    }

    setIsSubmitting(true)

    // Here you would make an API call to delete the account
    try {
      // await fetch('/api/delete-account', { method: 'POST', body: JSON.stringify(formData) })
      console.log("Account deletion requested:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Запрос на удаление аккаунта отправлен. Вы получите подтверждение на email.")
    } catch (err) {
      setError("Произошла ошибка. Попробуйте позже.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const allConfirmed = confirmations.dataLoss && confirmations.irreversible && confirmations.understand
  const canSubmit = formData.username && formData.password && formData.confirmText === "УДАЛИТЬ" && allConfirmed

  console.log(formData.username && formData.password && formData.confirmText === "УДАЛИТЬ" && allConfirmed)
  console.log(formData.username)
  console.log(formData.password)
  console.log(formData.confirmText === "УДАЛИТЬ")
  console.log(allConfirmed)
  console.log(confirmations.dataLoss);
  console.log(confirmations.irreversible);
  console.log(confirmations.understand);
  

  return (
    <div className={styles.container}>
        <img src={logo}/>
        <div className={styles.card}>
            {/* Logo and Header */}
            <div className={styles.header}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>
                    <Trash2/>
                </div>
            </div>
            <h1 className={styles.title}>Удаление аккаунта</h1>
            <p className={styles.subtitle}>
                Эта страница позволяет вам безвозвратно удалить ваш аккаунт и все связанные с ним данные
            </p>
            </div>

            {/* Warning Section */}
            <div className={styles.warning}>
            <AlertCircle className={styles.warningIcon} />
            <div className={styles.warningContent}>
                <h3 className={styles.warningTitle}>Внимание!</h3>
                <p className={styles.warningText}>
                Удаление аккаунта является необратимым действием. Все ваши данные, включая профиль, настройки и историю,
                будут безвозвратно удалены.
                </p>
            </div>
            </div>

            {/* Description Section */}
            <div className={styles.description}>
            <h3 className={styles.descriptionTitle}>Что будет удалено:</h3>
            <ul className={styles.descriptionList}>
                <li>Ваш профиль и личная информация</li>
                <li>Все ваши данные и контент</li>
                <li>История активности</li>
                <li>Настройки и предпочтения</li>
                <li>Подписки и связанные сервисы</li>
            </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <Input
                    title={"Имя пользователя или Email"}
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e })}
                    placeholder="Введите ваше имя пользователя"
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <Input
                    title={"Пароль"}
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e })}
                    placeholder="Введите ваш пароль"
                    className={styles.input}
                    required
                />
            </div>

            {/* Confirmations */}
            <div className={styles.confirmations}>
                <div className={styles.checkboxGroup}>
                    <Input
                        clazzLabel={styles.checkboxGroup__inner}
                        type={"checkbox"}
                        title={"Я понимаю, что все мои данные будут удалены"}
                        name={"dataLoss"}
                        value={confirmations.dataLoss}
                        onChange={(checked) => setConfirmations({ ...confirmations, dataLoss: checked })}
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <Input
                        clazzLabel={styles.checkboxGroup__inner}
                        type={"checkbox"}
                        title={"Я понимаю, что это действие необратимо"}
                        name={"irreversible"}
                        value={confirmations.irreversible}
                        onChange={(checked) => {
                            setConfirmations({ ...confirmations, irreversible: checked })
                            console.log(checked, "checked")
                        }}
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <Input
                        clazzLabel={styles.checkboxGroup__inner}
                        type={"checkbox"}
                        title={"Я хочу удалить свой аккаунт навсегда"}
                        name={"understand"}
                        value={confirmations.understand}
                        onChange={(checked) => setConfirmations({ ...confirmations, understand: checked })}
                    />
                </div>
            </div>

            {/* Final Confirmation */}
            <div className={styles.formGroup}>
                <Input
                    title={"Введите 'УДАЛИТЬ' для подтверждения"}
                    id="confirmText"
                    type="text"
                    value={formData.confirmText}
                    onChange={(e) => setFormData({ ...formData, confirmText: e })}
                    placeholder="УДАЛИТЬ"
                    className={styles.input}
                    required
                />
            </div>

            {error && (
                <div className={styles.error}>
                <AlertCircle className={styles.errorIcon} />
                <span>{error}</span>
                </div>
            )}

            <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={styles.submitButton}
                variant="destructive"
            >
                {isSubmitting ? "Обработка..." : "Удалить аккаунт навсегда"}
            </Button>
            </form>

            {/* Footer */}
            <div className={styles.footer}>
            <p className={styles.footerText}>
                Если у вас возникли проблемы или вопросы, пожалуйста, свяжитесь с нашей{" "}
                <a href="/support" className={styles.footerLink}>
                службой поддержки
                </a>
            </p>
            </div>
        </div>
    </div>
  )
}