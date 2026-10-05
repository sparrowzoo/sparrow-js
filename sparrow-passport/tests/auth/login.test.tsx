import React, {act} from 'react';
import {createRoot, Root} from 'react-dom/client';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import SignInPage from '@/app/(passport)/[locale]/sign-in/page';

const api = vi.hoisted(() => ({signIn:vi.fn(), redirect:vi.fn(), success:vi.fn(), error:vi.fn()}));
vi.mock('@/api/signin', () => ({default:api.signIn}));
vi.mock('next-intl', () => ({useLocale:()=> 'zh', useTranslations:()=> (key:string)=>key}));
vi.mock('react-hot-toast', () => ({default:{success:api.success,error:api.error}}));
vi.mock('@/common/hook/NavigatingHook', () => ({default:()=>({redirectTo:api.redirect})}));
vi.mock('@/common/hook/CaptchaHook', () => ({default:()=>({current:null})}));
vi.mock('@/components/passport/use-auth-suffix', () => ({default:()=>''}));
vi.mock('@/components/password/Find', () => ({default:()=>null}));
vi.mock('@/components/passport/captcha-image', () => ({default:()=>null}));
vi.mock('@/components/passport/auth-shell', () => ({default:({children}:React.PropsWithChildren)=> <main>{children}</main>}));
vi.mock('@/components/ui/button', () => ({Button:({children,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>)=><button {...props}>{children}</button>}));
vi.mock('@/components/ui/label', () => ({Label:({children,...props}:React.LabelHTMLAttributes<HTMLLabelElement>)=><label {...props}>{children}</label>}));
vi.mock('@/components/ui/input', () => ({Input:React.forwardRef<HTMLInputElement,React.InputHTMLAttributes<HTMLInputElement>>((props,ref)=><input {...props} ref={ref}/>)}));
vi.mock('@/components/ui/checkbox', () => ({Checkbox:({onCheckedChange,...props}:any)=><input type="checkbox" {...props} onChange={e=>onCheckedChange(e.target.checked)}/>}));
vi.mock('@/common/lib/Env', () => ({
    TOKEN_KEY:'login-test',TOKEN_STORAGE:'COOKIE',STORAGE_PROXY:'https://passport.sparrowzoo.com/cros-storage/',
    COOKIE_DOMAIN:'sparrowzoo.com',COOKIE_DAYS:'14',COOKIE_SAME_SITE:'Lax',COOKIE_SECURE:'true',
    CROS_DEBUG:false,NODE_ENV:'test',USER_INFO_KEY:'sparrow_user_info',
}));
let root:Root, container:HTMLDivElement;
beforeEach(async () => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
    vi.useFakeTimers();api.signIn.mockReset().mockResolvedValue({data:{token:'opaque.%25==token'}});
    api.redirect.mockClear();api.success.mockClear();api.error.mockClear();
    document.cookie='login-test=; Max-Age=0; Path=/; Domain=sparrowzoo.com; Secure';
    container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);
    await act(async()=>root.render(<SignInPage/>));
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.restoreAllMocks();vi.useRealTimers();});
async function submit(remember:boolean) {
    for(const [id,value] of [['userName','alice'],['password','Password1!'],['captcha','abcd']]) {
        const input=container.querySelector<HTMLInputElement>(`#${id}`)!;
        await act(async()=>{
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);
            input.dispatchEvent(new Event('input',{bubbles:true}));
        });
    }
    if(remember) await act(async()=>container.querySelector<HTMLInputElement>('#rememberMe')!.click());
    await act(async()=>{container.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
}
describe('S09 sign-in remember option and save ordering',()=>{
    it.each([false,true])('preserves the login payload and saves remember=%s before redirect',async remember=>{
        const writes=vi.spyOn(document,'cookie','set');
        await submit(remember);
        expect(api.signIn).toHaveBeenCalledWith({userName:'alice',password:'Password1!',captcha:'abcd',rememberMe:remember},expect.any(Function));
        expect(document.cookie).toContain('login-test=opaque.%2525%3D%3Dtoken');
        const assignment=writes.mock.calls.at(-1)![0];
        if(remember) expect(assignment).toContain('Max-Age=1296000');
        else expect(assignment).not.toMatch(/Expires|Max-Age/);
        expect(api.success).toHaveBeenCalledOnce();expect(api.redirect).not.toHaveBeenCalled();
        await act(async()=>vi.advanceTimersByTime(2000));expect(api.redirect).toHaveBeenCalledOnce();
    });
    it('does not report success or redirect when Cookie persistence fails',async()=>{
        vi.spyOn(document,'cookie','set').mockImplementation(()=>{});
        await submit(true);
        expect(api.signIn).toHaveBeenCalledOnce();expect(api.error).toHaveBeenCalledOnce();
        expect(api.success).not.toHaveBeenCalled();
        await act(async()=>vi.advanceTimersByTime(3000));expect(api.redirect).not.toHaveBeenCalled();
    });
});
