import mongoose from 'mongoose';

const FixtureSchema = new mongoose.Schema({
  fixture_mid: { type: String, required: true, unique: true },
  season: { type: Number, required: true },
  competition_name: { type: String, required: true },
  fixture_datetime: { type: Date, required: true },
  fixture_round: { type: Number, required: true },
  home_team: { type: String, required: true },
  away_team: { type: String, required: true },
});

export default mongoose.models.Fixture || mongoose.model('Fixture', FixtureSchema);