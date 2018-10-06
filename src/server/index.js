import '../env';

import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import next from 'next';
import { get } from 'lodash';
import * as api from './api';
import routes from '../routes';
import logger from '../logger';
import { titleCase } from '../lib/utils';
import { registerToNewsletter } from '../lib/mailchimp';

const {
  PORT,
} = process.env;


const port = parseInt(PORT, 10) || 3000;

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
});

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const server = express();

  server.use(
    favicon(path.join(path.dirname(__dirname), 'static', 'favicon.ico')),
  );

  server.use(express.json());

  server.post('/api/newsletter/register', (req, res) => {
    const email = get(req, 'body.email');
    const newsletter = get(req, 'body.newsletter');
    registerToNewsletter(email, newsletter).then(data => res.json(data));
  });

  server.get('/api/data/:csvfile', api.getDataFromCSV);

  const inc = (obj, key, increment = 1) => {
    obj[key] = obj[key] || 0;
    obj[key] += increment;
  }

  server.get('/listes/:city', async (req, res, next) => {
    const city = req.params.city.toLowerCase();
    console.log(">>> getting candidates for", city);
    const csv = await api.getJSONFromCSVFile('candidates_with_cumuleo');
    console.log(">>> loading", csv.length, "rows from candidates_with_cumuleo.csv");
    const lists = {};
    const candidates = csv.filter(r => {
      if (r.city.toLowerCase() !== city) return false;
      // console.log(">>> keeping", r.firstname, r.lastname, r.list, r.zipcode, r.city);
      lists[r.list] = lists[r.list] || { candidates: [], totalPoliticians: 0, totalCumuls: 0, totalYearsInPolitics: 0 };
      lists[r.list].candidates.push(r);
      if (!lists[r.list].party) {
        lists[r.list].party = r.party;
      }
      if (r.cumuleo_url) {
        inc(lists[r.list], 'totalPoliticians');
        inc(lists[r.list], 'totalCumuls', parseInt(r.cumuls_2017));
        for (let i = 2004; i < 2016; i++ ) {
          if (r[i]) {
            inc(lists[r.list], 'totalYearsInPolitics');
          }
        }
      }
      return true;
    });
    req.data = {
      city: titleCase(city),
      lists
    };
    console.log(">>> data", req.data);
    next();
  });

  server.get('/listes/:city/:listname', async (req, res, next) => {
    const city = req.params.city.toLowerCase();
    const listname = req.params.listname.toLowerCase();
    console.log(">>> getting candidates for", city, listname);
    const csv = await api.getJSONFromCSVFile('candidates_with_cumuleo');
    const list = { name: listname, candidates: [] };
    const stats = { totalPoliticians: 0, totalCumuls: 0, parties: {} };
    const candidates = csv.filter(r => {
      if (r.city.toLowerCase() !== city) return false;
      if (r.list.toLowerCase() !== listname) return false;
      console.log(">>> keeping", r.firstname, r.lastname, r.list, r.zipcode, r.city, r.cumuleo_url);
      if (r.cumuleo_url) {
        inc(stats, 'totalPoliticians');
        inc(stats, 'totalCumuls', parseInt(r.cumuls_2017));
        inc(stats.parties, r.party);
        r.politicalYears = 0;
        for (let i = 2004; i < 2016; i++ ) {
          if (r[i]) {
            inc(stats, 'totalYearsInPolitics');
            r.politicalYears++;
          }
        }
      }
      list.candidates.push(r);
      return true;
    });
    list.candidates.sort((a, b) => (parseInt(a.position) > parseInt(b.position) ? 1 : -1));
    // we define list.party using using the first politician on the list
    list.candidates.map(c => {
      if (!list.party) {
        list.party = c.party;
      }
    })
    req.data = {
      city: titleCase(city),
      list,
      stats
    };
    console.log(">>> data.stats", req.data.stats);
    next();
  });

  server.use('/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });

  server.use('/_next/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });

  server.get('*', handler);

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    logger.info(`> Ready on http://localhost:${port}`);
  });
});