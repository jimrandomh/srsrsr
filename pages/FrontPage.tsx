import React, {useState} from 'react'
import {TopBar} from '../components/TopBar';
import {LeftSidebar} from '../components/LeftSidebar';
import {CardChallenge} from '../components/CardChallenge';
import {RSSCard} from '../components/RSSCard';
import {Loading} from '../components/Loading';
import {useGetApi} from '../lib/apiUtil';
import {ApiCardsDue,ApiLoadFeed} from '../lib/apiTypes';
import map from 'lodash/map';

export function FrontPage() {
  const {data:cardsDue, loading} = useGetApi<ApiCardsDue>({
    endpoint: "/api/cards/due",
    query: {}, body: {},
  });
  const {data:xkcdFeed, loading: loadingXkcd} = useGetApi<ApiLoadFeed>({
    endpoint: "/api/feed/load/:feedUrl",
    query: {feedUrl: "https://xkcd.com/atom.xml"}, body: {},
  });
  console.log(xkcdFeed);
  
  const [cardPos,setCardPos] = useState(0);
  
  const combinedCards = [
    ...(map(cardsDue?.cards, card=>({type:"card", ...card}))),
    ...(map(xkcdFeed?.feedItems, rssEntry=>({type:"rss", ...rssEntry}))),
  ];
  const currentCard = (combinedCards && cardPos<combinedCards.length) ? combinedCards[cardPos] : undefined;
  
  return <div className="frontPage">
    <TopBar/>
    <LeftSidebar/>
    
    <div className="mainPane">
      {loading && <Loading/>}
      {!loading && cardPos>=combinedCards.length && <div>
        You're all caught up!
      </div>}
      {currentCard && currentCard.type==="card" && <CardChallenge
        key={cardPos}
        card={{
          front: currentCard.front,
          back: currentCard.back,
        }}
        onFinish={() => {
          setCardPos(cardPos+1)
        }}
      />}
      {currentCard && currentCard.type==="rss" && <RSSCard
        key={cardPos}
        card={currentCard}
        onFinish={() => {
          setCardPos(cardPos+1)
        }}
      />}
    </div>
  </div>
}