import Link from "next/link";
export default function NotFound(){
 return <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center bg-background-full text-text-primary"><p className="text-title-2-medium text-text-secondary">404</p><h1 className="text-title-1-medium">找不到这个页面</h1><p className="text-body-regular text-text-secondary">链接可能已变更，请返回组件目录继续浏览。</p><Link prefetch={false} href="/zh-hans/components" className="rounded-2lg bg-button-primary px-4 py-2 text-body-medium text-white">返回组件目录</Link></main>;
}
