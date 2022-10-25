import Link from 'next/link';
import headerStyles from '../styles/header.module.css';

export default function Header() {

  
  return (
    <div className={headerStyles.container}>
      <div><Link href="/">LOGO</Link></div>
      <div><Link href="/login">로그인</Link></div>
    </div>
  );
}
