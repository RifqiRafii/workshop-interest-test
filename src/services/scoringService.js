const CATEGORY_LABELS = {
  ALGORITMA: 'Algoritma & Pemrograman Dasar',
  WEBSITE: 'Website Dasar',
  UIUX: 'UI/UX'
};

function calculateScores(questions, answers) {
  const scores = { ALGORITMA: 0, WEBSITE: 0, UIUX: 0 };

  for (const question of questions) {
    scores[question.kategori] += answers.get(question.id);
  }

  const highest = Math.max(...Object.values(scores));
  const dominantCategories = Object.entries(scores)
    .filter(([, score]) => score === highest)
    .map(([category]) => category);

  return {
    scores,
    dominantCategories,
    dominantLabel: dominantCategories.length > 1
      ? 'SEIMBANG'
      : CATEGORY_LABELS[dominantCategories[0]]
  };
}

module.exports = { CATEGORY_LABELS, calculateScores };
