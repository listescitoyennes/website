import React from 'react';
import Link from 'next/link';
import parties from '../../data/parties.json';
import Head from 'next/head';

class ListPage extends React.Component {

    static getInitialProps({ req: { data }, query }) {
        return { query, data };
    }

    constructor(props) {
        super(props);
    }

    render() {
        console.log(">>> this.props.data", this.props.data);
        const { list, stats, city } = this.props.data;
        // const total = data.total;
        const totalCandidates = Object.keys(list.candidates).length;
        if (totalCandidates === 0) {
            return (
                <div>
                    <h1>Désolé, nous n'avons pas de données pour cette liste</h1>
                    <h2>Vous pouvez nous aider en contribuant à <a href="https://docs.google.com/spreadsheets/d/1tdnQS234_Zpw4XpbkbAISI6XM0jzw8w7IKe-PLMLj6Y/edit#gid=440894185">ce fichier public</a>. Merci!</h2>
                </div>
            )
        }
        const partyInfo = parties[list.name.toLowerCase()];
        return (
          <div className="content">
            <Head>
              <title>Pour qui voter à {city}? A propos de la liste {list.name.toUpperCase()}...</title>
            </Head>
            <h1>Pour qui voter à {city}?</h1>
            <h2>A propos de la liste {list.name.toUpperCase()}</h2>
            {  partyInfo && partyInfo.year_established < 2000 &&
              <div>
                <p>
                  ⚠️ En votant pour n'importe quel candidat de cette liste, vous votez également pour la <a href="https://fr.wikipedia.org/wiki/Particratie">particratie</a>.
                </p>
                <p>
                  ⚠️ Ce parti a été créé au {Math.floor(partyInfo.year_established / 100)}e siècle (<a href={partyInfo.wikipedia}>Wikipedia</a>).<br />
                  Êtes-vous sûr que c'est cela dont on a encore besoin pour faire face aux défis du 21e siècle?
                </p>
              </div>
            }
            
            <p><br />
              <Link href={`/listes/${city}`}><a>Voir les autres listes à {city}</a></Link>
            </p>

            <p>
              { stats.totalPoliticians ? <div>{stats.totalPoliticians} sont des politiciens appartenant au {Object.keys(stats.parties).join(', ')}.</div> : '' }
              { (stats.totalCumuls || stats.totalYearsInPolitics) ? <div>Ensemble, ils cumulent plus de {stats.totalCumuls} mandats et ont déjà passé plus de {stats.totalYearsInPolitics} années en politique.</div> : '' }
            </p>

            <table>
              <tr>
                <th>position</th>
                <th>sexe</th>
                <th>candidat</th>
                <th>parti politique</th>
                <th>mandats</th>
                <th>années en politique</th>
              </tr>
              { list.candidates.map((candidate, index) => (
                <tr key={index}>
                  <td>{candidate.position}</td>
                  <td>{candidate.gender}</td>
                  <td>{candidate.firstname} {candidate.lastname}</td>
                  <td>{candidate.party}</td>
                  { candidate.cumuls_2017 && <td><a href={candidate.cumuleo_url}>{candidate.cumuls_2017}</a></td> }
                  { candidate.politicalYears && <td><a href={candidate.cumuleo_url}>{candidate.politicalYears}</a></td> }
                </tr>
              ))}
            </table>
          </div>
        )
    }

}

export default ListPage;