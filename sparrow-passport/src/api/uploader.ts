import Fetcher from '@/common/lib/Fetcher'
import {Translator} from '@/common/lib/TranslatorType'

export interface ImageCropperParam {
    x: number
    y: number
    width: number
    height: number
}

export interface UploadImageParams {
    pathKey: string
    clientFileName: string
    base64Content: string
    crop?: ImageCropperParam
}

export class Uploader {
    public static uploadImage(params: UploadImageParams, translator: Translator) {
        const {crop, ...body} = params
        return Fetcher.post<string>({
            url: '/base64-upload.json',
            body: crop ? {...body, ...crop} : body,
            translator: translator,
        })
    }

    public static modifyUserAvatar(avatar: string, translator: Translator) {
        return Fetcher.post({
            url: '/profile/modify-user-avatar.json',
            body: {avatar: avatar},
            translator: translator,
        })
    }

    public static uploadAvatar(
        base64: string,
        clientFileName: string,
        crop: ImageCropperParam,
        translator: Translator
    ): Promise<string> {
        return Uploader.uploadImage(
            {
                pathKey: 'avatar',
                clientFileName: clientFileName,
                base64Content: base64,
                crop: crop,
            },
            translator
        ).then((res) => {
            const url = res.data
            return Uploader.modifyUserAvatar(url, translator).then(() => url)
        })
    }
}
