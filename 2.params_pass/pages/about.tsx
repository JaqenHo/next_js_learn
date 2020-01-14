import Header from '../components/Header';
import { useRouter } from 'next/router'; //引入路由

const About = () => {
    const router = useRouter(); //初始化路由

    return (
        <div>
            <Header pageName='about'/>
            <p>This is the about page</p>
            
            <p>This param from home page:{router.query.param}</p>{/* 接收来自home传来的参数 */}
            
            <p>This param from home page by route:{router.query.id}</p>{/* 接收来自home传来的参数 */}

        </div>
    );
}

export default About;