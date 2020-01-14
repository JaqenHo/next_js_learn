import { useRouter } from 'next/router'; //引入路由

const DynamicRouting = () => {
    const router = useRouter(); //初始化路由

    return (
        <div>
            <p>This is Dynamic Routing Page</p>
            
            <p>This param from home page by route:{router.query.param}</p>{/* 接收来自home传来的参数 */}
        </div>
    );
}

export default DynamicRouting;