'use client'

import { useLocale, useTranslations } from 'next-intl'
import { getProductNavigations } from '@/common/lib/protocol/ProductNavigation'
import SiteBanner from '../../common/components/header/site-banner'
import { WWW_ROOT } from '@/common/lib/Env'
import useAuthSuffix from './use-auth-suffix'

export default function PassportHeader() {
    const locale = useLocale()
    const t = useTranslations('Passport.navigation')
    const product = useTranslations('product')
    const authSuffix = useAuthSuffix()
    return (
        <SiteBanner
            brandName={t('brand')}
            brandCaption="SPARROW PASSPORT"
            logoSrc="/svg/brand/sparrow-logo.svg"
            homeHref={`/${locale}/sign-in/${authSuffix}`}
            navigationLabel={t('label')}
            items={[
                ...getProductNavigations(t, locale, true, product),
                { label: t('signUp'), href: `/${locale}/sign-up/${authSuffix}`, emphasized: true },
                {
                    id: 'study',
                    label: t('study'),
                    href: `${WWW_ROOT}/${locale}/study/`,
                    emphasized: true,
                    icon: 'graduation-cap',
                    group: 'utility',
                },
            ]}
            openMenuLabel={''}
            closeMenuLabel={''}
        />
    )
}
