'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { WWW_ROOT } from '@/common/lib/Env'
import styles from './passport.module.css'

export default function PassportFooter() {
    const locale = useLocale()
    const t = useTranslations('Passport.navigation')
    return (
        <footer className={styles.footer}>
            <p>
                © {new Date().getFullYear()} Sparrow Zoo{' '}
                <span>· {t('footer')}</span>
            </p>
            <a href={`${WWW_ROOT}/${locale}/`}>
                {t('backHome')}
                <ArrowUpRight size={13} aria-hidden="true" />
            </a>
        </footer>
    )
}
