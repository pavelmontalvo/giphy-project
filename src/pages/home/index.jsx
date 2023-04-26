import React, { useState } from 'react';
import './styles.scss';

const URL_GIPHY = 'https://api.giphy.com/v1/gifs/search?api_key=0ESD4POalYRJbLBILvUBaW6ydZESyk16&limit=20&offset={page}&q={value}';

const Home = () => {

    /* Component state */
    const [inputValue, setInputValue] = useState("");
    const [gifsData, setGifsData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeError, setActiveError] = useState(false);
    const [isEmptyData, setIsEmptyData] = useState(false);
    const [isFetching, setisFetching] = useState(false);

    /* Add function to the search bar */
    const searchGif = async (page = 0) => {
        setGifsData([]);
        if(inputValue) {
            setisFetching(true);
            const url = URL_GIPHY.replace('{value}', inputValue).replace('{page}', page);
            const response = await fetch(url);
            const responseJson = await response.json();
            const { data, pagination } = responseJson;
            setPagination(pagination);

            /* Set flag for empty data */
            setIsEmptyData(data.length === 0);

            /* Save gif data to state */
            setGifsData(data.map((item) => {
                item.images.fixed_height.title = item.title;
                item.images.fixed_height.sourceUrl = item.url;
                return item.images.fixed_height;
            }));

            setCurrentPage(page === 0 ? page + 1 : page);
            setisFetching(false);
        } else {
            setActiveError(true);
        }
    };

    /* Set the pagination */

    const setPagination = (pagination) => {
        const { total_count } = pagination;
        setTotalPages(Math.floor(total_count/20));
    };

    return (
        <div className='homePage'>
            <div className='input-container'>
                <input
                    placeholder='Search for GIFs'
                    onChange={(e) => {
                        setActiveError(false);
                        setIsEmptyData(false);
                        setInputValue(e.target.value);
                    }}
                    value={inputValue}
                />
                <button onClick={() => searchGif()}>
                    SEARCH
                </button>
            </div>
            {isFetching && <div className='spin-dark'/>}
            {activeError && <span className='error-text'>Search field empty, please enter your search query.</span>}
            {isEmptyData && <span className='empty-text'>We couldn't find anything for '{inputValue}'</span>}
            <div className='gifs-container'>
                {gifsData.map((item, index) =>
                <a className='gif' target='_blank' href={item.sourceUrl}>
                    <img key={index} src={item.url} />
                    <p className='title'>{item.title}</p>
                </a>
                )}
            </div>
            {gifsData.length > 0 &&
                <div className='pagination-container'>
                    <i  onClick={() => searchGif(currentPage - 1)} className={`arrow-prev ${currentPage > 1 ? 'active': ''}`}/>
                    <div className='pagination-text'>
                        <p>{currentPage}/{totalPages}</p>
                    </div>
                    <i className={`arrow-next ${currentPage < totalPages ? 'active' : ''}`} onClick={() => searchGif(currentPage + 1)} />
                </div>
            }
        </div>
    )
};

export default Home;