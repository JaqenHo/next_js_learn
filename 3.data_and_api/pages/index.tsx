import Header from '../components/Header';
import Link from 'next/link';


const Home = () => (
  <div>
      <Header pageName='home'/>
      <p>Hello Next.js</p>


      <Link href={`/about?param=from_home`}>
        <a>to about page</a>
      </Link>

      <br/><br/>
      <Link href="/p/[param]" as={`/p/from_home`}>
        <a>to about page by route </a>
      </Link>
      
    </div>
);

export default Home;
