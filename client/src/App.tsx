import React, { useState, useEffect } from 'react';
import './App.css';
import AdTemplate from "./components/AdTemplate";
import Navbar from "./components/Navbar";

import LoaderSVG from './img/loader.svg'

interface Ad {
  name: string;
  locality: string;
  price: string;
  image: string;
}

export default function App() {
  const [ads, setAds] = useState<Ad[]>([])
  const [page, setPage] = useState<number>(0)
  const [maxPage, setMaxPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getAds()
  }, [])

  const getAds = async () => {
    const response = await fetch('/api/scrape', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.success) {
      setAds(data.ads)
      setMaxPage(data.maxPages)
      setLoading(false)
    }
  }

  const getPage = async (p: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page: p })
      })

      const data = await response.json()

      if (data.success) {
        setAds(data.ads)
        setPage(p)
        setLoading(false)
      } else {
        console.log(data.error)
      }
    } catch (e) {
      console.log(e)
    }

  }


  return (
    <div className="App">
      <Navbar />
      {
        loading ? <img src={LoaderSVG} alt="Loading..." className="loading" /> :
          <>
            <div className="ads-container">
              {
                ads?.map((ad: Ad, index: number) => {
                  return (
                    <div key={index}>
                      <AdTemplate ad={ad} />
                    </div>
                  )
                })
              }
            </div>

            {
              <div className="pagination">
                {
                  page === 0 ? <button className="disabled" disabled>Previous</button> : <button onClick={() => getPage(page - 1)}>Previous</button>
                }
                <p>{page + 1} / {maxPage}</p>
                {
                  page === maxPage ? <button className="disabled" disabled>Next</button> : <button onClick={() => getPage(page + 1)}>Next</button>
                }
              </div>
            }
          </>
      }

    </div>
  );
}