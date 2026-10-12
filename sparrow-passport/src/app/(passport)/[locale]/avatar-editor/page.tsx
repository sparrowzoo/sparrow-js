'use client'
import dynamic from 'next/dynamic'
import { ImageCropperParam, Uploader } from '@/api/uploader'
import { useTranslations } from 'next-intl'
import useNavigating from '@/common/hook/NavigatingHook'
import CrosStorage from '@/common/lib/CrosStorage'
import toast from 'react-hot-toast'
import styles from '@/components/passport/passport.module.css'

const AvatarCutter = dynamic(() => import('@/components/avatar/AvatarCutter'), {
    ssr: false,
})

export default function AvatarEditorPage() {
    const t = useTranslations('AvatarUploader')
    const ui = useTranslations('Passport.ui')
    const Navigations = useNavigating()

    function handleUpload(
        base64: string,
        clientFileName: string,
        crop: ImageCropperParam
    ) {
        Uploader.uploadAvatar(base64, clientFileName, crop, t).then(({token}) => {
            const storage = CrosStorage.getCrosStorage()
            storage.setToken(token).then(() => {
                toast.success(t('upload-success'))
                Navigations.redirectToIndex()
            }).finally(() => storage.destroy())
        })
    }

    return (
        <section className={styles.accountPage}>
            <div className={styles.accountHeading}>
                <p className={styles.eyebrow}>
                    <span />
                    SPARROW ID / PROFILE
                </p>
                <h1>{ui('avatarTitle')}</h1>
                <p>{ui('avatarDescription')}</p>
            </div>
            <AvatarCutter saveAvatar={handleUpload} />
        </section>
    )
}
