import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  // Criar variavel para definir de é para aparecer ou não o background preto, na rolagem da página.
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {

    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length))
      let chonse = originals[0].items.results[randomChosen];
      let chonseInfo = await Tmdb.getMovieInfo(chonse.id, 'tv');
      setFeaturedData(chonseInfo);

    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <div className="page">

      <Header black={blackHeader} />
      
      {featuredData && 
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por <a href='/'>Glauber Bandeira</a> com o auxílio do B7WEB <br/>
        Direito de imagens para Netflix <br/>
        Dados pegos do site Themoviedb.org
      </footer>

       {movieList.length <= 0 &&   
        <div className='loading'>
          <img src='https://hips.hearstapps.com/pop.h-cdn.co/assets/16/48/1600x800/landscape-1480516731-4f155204-7266-486d-88a5-2018ff11f947.gif?resize=768:*' alt='Garregando' />
        </div>
       }
    </div>
  )
}