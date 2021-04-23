import React, {useState} from 'react'
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries} from 'react-vis'

const percentChangeIcons = [
    <svg xmlns="http://www.w3.org/2000/svg" id="down-arrow" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
</svg>,
<svg xmlns="http://www.w3.org/2000/svg" id="up-arrow" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
</svg>
]
export default function IndividualAsset({asset}) {
    
    const [prices, setPrices] = useState([])
const [graph, showGraph] = useState(false)
const fetchData = (e,asset) => {
    e.preventDefault();
    fetch(`https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=usd&days=7&interval=hourly`)
    .then(res => res.json())
    .then(data => { 
        setPrices(data.prices)
        showGraph(!graph)
    })

}
const loopData = () => {
    let data = []
    for(let i = 0; i < prices.length; i++) {
        data.push({x:i, y:prices[i][1]})
    }
   return data
}
 const data = graph ? loopData() 
  : []

  const numberFormat = (number) => {
    return  number.toLocaleString()
  }

  const percentChange = (percent) => {
  
   let s = percent.toString()
   
  return  s.includes("-") ? <p className="price-change-neg">{percentChangeIcons[0]}{s.replace("-", "")}%</p> : <p className="price-change-pos">{percentChangeIcons[1]}{s}%</p>
  }

    return (
        <tr>
        <td className="name">
        <p><img src={asset.image}></img>{asset.id} <button onClick={(e) => fetchData(e,asset.id)}>See Chart</button></p>
        </td>
        <div>
        {graph === true ? <XYPlot height={300} width={300}><LineSeries data={data}/></XYPlot>: '' }
        </div>
        <td>
            <p> $ {numberFormat(asset.current_price)}</p>
        </td>
        <td>
            {percentChange(asset.price_change_percentage_24h)}
        </td>
        <td>
            {numberFormat(asset.market_cap)}
        </td>
        <td>
            {numberFormat(asset.circulating_supply)} {asset.symbol.toUpperCase()}
        </td>
        
    </tr>
    )
}