import { NextPage } from 'next';
import Link from 'next/link';

const linkStyle = {
    marginRight: 15
  };

const Header: NextPage<{ pageName: string }> = (props:any) => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
    <div>这里是:{props.pageName}</div>
  </div>
);

export default Header;