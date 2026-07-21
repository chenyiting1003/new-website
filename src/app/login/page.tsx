import Link from "next/link";
export default function Login() { return <main className="login"><p className="eyebrow">MONDAYS / PRIVATE ACCESS</p><h1>登录工作区</h1><p>Supabase Auth 配置后，此处将使用受限登录。开发环境使用演示审核流程，不连接生产数据。</p><Link className="button" href="/admin/review">进入开发演示 →</Link></main> }
