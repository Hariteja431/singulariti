export const randomDb: Record<string, { whyNeed: string; howWorks: string; whenToUse: string }> = {
  'wheel-spinner': {
    whyNeed: 'A random wheel spinner is the perfect tool for making unbiased decisions, selecting raffle winners, or gamifying classroom and team activities without relying on physical props.',
    howWorks: 'Enter your custom slices, and the tool uses a secure cryptographic random number generator to determine the exact angle and landing slice with a visual spinning animation.',
    whenToUse: 'Use this for giveaways, classroom participation, board games, or anytime you are stuck making a group decision and need a fair, visual tie-breaker.'
  },
  'random-number': {
    whyNeed: 'A reliable random number generator is essential for statistical sampling, lotteries, and secure password generation where human bias must be completely eliminated.',
    howWorks: 'It leverages the browser\'s native Math.random() or Crypto API to produce true pseudo-random numbers within your specified min/max range, instantly handling duplicates or unique draws.',
    whenToUse: 'Ideal for teachers picking student numbers, researchers drawing random sample sets, or event organizers selecting winning ticket numbers.'
  },
  'dice-roller': {
    whyNeed: 'Digital dice are incredibly handy when you misplace physical dice for board games, tabletop RPGs, or need to instantly roll multiple dice without clutter.',
    howWorks: 'The tool mathematically simulates rolling perfectly balanced 6-sided dice, ensuring a fair 1-in-6 probability for every face on every single roll.',
    whenToUse: 'Perfect for playing Monopoly, Yahtzee, educational math games, or resolving quick probability disputes on the go.'
  },
  'coin-flipper': {
    whyNeed: 'A digital coin flipper resolves 50/50 decisions instantly without needing physical currency, guaranteeing an unbiased outcome.',
    howWorks: 'Using a strict binary randomization algorithm, it calculates a 50% probability for Heads and 50% for Tails, complete with a 3D flipping animation.',
    whenToUse: 'Use this to settle bets, decide who goes first in a sports match, or make quick "yes or no" choices.'
  }
};
