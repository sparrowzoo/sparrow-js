'use client'

import type { ReactNode } from 'react'
import { ArrowUpRight, KeyRound, Layers3, Mail, ShieldCheck, } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { WWW_ROOT } from '@/common/lib/Env'
import styles from './passport.module.css'

type AuthShellProps = {
    variant: 'sign-in' | 'sign-up' | 'reset'
    title: string
    description: string
    children: ReactNode
}

export default function AuthShell({
    variant,
    title,
    description,
    children,
}: AuthShellProps) {
    const t = useTranslations('Passport.shell')
    const locale = useLocale()
    const features = [
        { id: 'identity', icon: ShieldCheck },
        { id: 'connected', icon: Layers3 },
        { id: 'recovery', icon: Mail },
    ] as const
    return (
        <div className={styles.authLayout}>
            <aside className={styles.story}>
                <p className={styles.eyebrow}>
                    <span />
                    SPARROW PASSPORT
                </p>
                <p className={styles.storyTitle}>
                    {t(`${variant}.title`)}
                    <br />
                    <span>{t(`${variant}.highlight`)}</span>
                </p>
                <p className={styles.storyDescription}>
                    {t(`${variant}.description`)}
                </p>
                <ul className={styles.benefits}>
                    {features.map(({ id, icon: Icon }) => (
                        <li key={id}>
                            <span className={styles.benefitIcon}>
                                <Icon
                                    size={20}
                                    strokeWidth={1.6}
                                    aria-hidden="true"
                                />
                            </span>
                            <div>
                                <h2>{t(`${id}.title`)}</h2>
                                <p>{t(`${id}.description`)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <a href={`${WWW_ROOT}/${locale}/products/passport/`} className={styles.storyLink}>
                    {t('about')}
                    <ArrowUpRight size={15} aria-hidden="true" />
                </a>
            </aside>
            <section className={styles.authCard} aria-labelledby="auth-title">
                <div className={styles.cardTop}>
                    <span className={styles.cardMark}>
                        <KeyRound
                            size={20}
                            strokeWidth={1.6}
                            aria-hidden="true"
                        />
                    </span>
                    <span>SPARROW ID</span>
                </div>
                <div className={styles.formHeading}>
                    <h1 id="auth-title">{title}</h1>
                    <p>{description}</p>
                </div>
                {children}
            </section>
        </div>
    )
}
