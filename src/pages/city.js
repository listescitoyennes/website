import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

class CityPage extends React.Component {

    static getInitialProps({ req: { data }, query }) {
        return { query, data };
    }

    constructor(props) {
        super(props);
    }

    render() {
        console.log(">>> this.props.data", this.props.data);
        const { city, lists } = this.props.data;
        // const total = data.total;
        const totalLists = Object.keys(lists).length;
        if (totalLists === 0) {
            return (
                <div>
                    <h1>Désolé, nous n'avons pas de données pour cette commune</h1>
                    <p>Vous pouvez nous aider en contribuant à <a href="https://docs.google.com/spreadsheets/d/1tdnQS234_Zpw4XpbkbAISI6XM0jzw8w7IKe-PLMLj6Y/edit#gid=440894185">ce fichier public</a>. Merci!</p>
                </div>
            )
        }
        return (
          <div className="content">
            <Head>
              <title>Pour qui voter à {city}?</title>
            </Head>
            <style jsx>{`
                .stats {
                  margin-bottom: 0.5rem;
                }
            `}</style>
            <h1>Pour qui voter à {city}?</h1>
            <h2>{totalLists} listes</h2>
            <ul className="list">
              { Object.keys(lists).map((listname, index) => (
                <li key={index}>
                  <h3 className="listname">
                    <Link href={`/listes/${city}/${listname}`}><a>{listname}</a></Link>
                  </h3>
                  <div className="stats">
                    <span className="col"><Link href={`/listes/${city}/${listname}`}><a>{lists[listname].candidates.length} candidats</a></Link></span>
                    { lists[listname].totalPoliticians ? <span className="col"> – {lists[listname].totalPoliticians} sont des politiciens</span> : '' }
                  </div>
                  { lists[listname].party.toLowerCase() === listname.toLowerCase() &&
                    <p>⚠️ En votant pour n'importe quel candidat de cette liste, vous votez également pour la <a href="https://fr.wikipedia.org/wiki/Particratie">particratie</a>.</p>
                  }
                  { (lists[listname].totalCumuls || lists[listname].totalYearsInPolitics)
                    ? <div className="col">Ensemble, ils cumulent plus de {lists[listname].totalCumuls} mandats et ont déjà passé plus de {lists[listname].totalYearsInPolitics} années en politique. Pour mettre fin à la particratie, favorisez plutôt une autre liste!</div>
                    : '' }
                </li>
              ))}
            </ul>
          </div>
        )
    }

}

export default CityPage;