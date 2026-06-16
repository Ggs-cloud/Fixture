// =============================================
// PREDICTION ENGINE — Scoring y gestión
// =============================================

function calcPredictionScore(prediction, realScore) {
  if (!prediction || !realScore) return null;
  const sign = v => (v > 0) - (v < 0);
  const predResult = sign(prediction.home - prediction.away);
  const realResult = sign(realScore.home  - realScore.away);

  if (prediction.home === realScore.home && prediction.away === realScore.away)
    return { score: 3, label: '¡Exacto!',      cls: 'text-yellow-400' };
  if (predResult === realResult)
    return { score: 1, label: 'Acertó resultado', cls: 'text-blue-400' };
  return   { score: 0, label: 'Falló',          cls: 'text-red-400'  };
}

function getTotalPredictionScore() {
  const matches     = DataStore.getAllMatches();
  const predictions = DataStore.getPredictions();
  let total = 0, evaluated = 0, pending = 0;

  matches.forEach(m => {
    if (predictions[m.id] === undefined) return;
    if (m.status === 'finished' && m.real_score) {
      const r = calcPredictionScore(predictions[m.id], m.real_score);
      total += r ? r.score : 0;
      evaluated++;
    } else {
      pending++;
    }
  });

  return { total, evaluated, pending };
}
