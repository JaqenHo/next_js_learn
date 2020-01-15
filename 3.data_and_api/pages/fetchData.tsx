import { NextPage,NextPageContext } from 'next';
import fetch from 'isomorphic-unfetch';


interface Show extends NextPageContext {
    id: number; 
    name: string;
  }

const FetchData: NextPage<{ shows: Array<Show> }> = (props) => (
    <div>
        <h1>Batman TV Shows</h1>
        <ul>
            {props.shows.map(show => (
                <li key={show.id}>
                    id=>{show.id};
                    <br/>
                    name=>{show.name}
                </li>
            ))}
        </ul>
    </div>
);

FetchData.getInitialProps = async (ctx: Show) => {
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.length}`);

    return {
        shows: data.map((entry: any) => entry.show)
    };
};

export default FetchData;