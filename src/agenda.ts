import Agenda from 'agenda';
import mongoose from 'mongoose';
import getEnv from './utils/getEnv';

const { DB_URI } = getEnv();

const agenda = new Agenda({ mongo: mongoose.connection.db });

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

jobTypes.forEach(type => {
  import('./jobs/' + type).then(job => job(agenda));
});

if (jobTypes.length)
  agenda.start().catch(console.error);

module.exports = agenda;