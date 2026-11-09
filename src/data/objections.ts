import { buildCategory, type Theme } from './gen';
import { HOUSEHOLD } from './contexts';
import { coreObjections } from './core';
import { CARDS_PER_CATEGORY } from './types';

const OBJ = 'Objection';
const th = (key: string, classification: string, phrasings: string[], meaning: string, questions: string[], responses: string[], feeling: string, topic: string, need: string, extra: Partial<Theme> = {}): Theme =>
  ({ key, classification, phrasings, meaning, questions, responses, feeling, topic, need, ...extra });

// Situations drawn from the objections D2D and solar trainers most often list as the most common at the door.
export const OBJECTION_THEMES: Theme[] = [
  th('not-interested', 'Objection — could be a clear refusal', [
    "Nah, we're not interested.", "Not interested, thanks.", "We're good, not interested.", "Honestly, I'm just not interested.", "Not for us, we're not interested.", "Thanks, but no interest here.",
  ], 'Often a reflex before they know why you knocked, but it can be a real no.',
  ['Fair enough. Is it solar in general, or just not a good time?', 'Totally fine. Quick question before I go: is your bill something you ever think about?'],
  ["No problem. I'm just letting neighbors know what folks on this street are looking at. If it's a firm no, I'll head out. Have a good one.", "Totally fair. I'm not here to push anything. If you ever want to see whether it even makes sense for your home, I'm around. Otherwise, have a great day."],
  'guarded about being sold to', "the 'not interested'", 'a no-pressure answer about their bill'),
  th('have-solar', OBJ, [
    'We already have panels.', 'We got solar a couple years ago.', "We've already got solar, thanks.", 'Our house already has a system.', "We went solar already.",
  ], "They may be done, or they may have questions about performance, batteries, or their bill.",
  ['How has it been working? Is your bill where you expected?', 'Did you ever look into adding a battery?'],
  ["Nice! If it's working well, I won't take your time. Some owners with existing systems ask about batteries or performance checks, so that's the only reason I'd mention it.", "That's great. Are you happy with it? If so, awesome. If not, we can talk about what's going on."],
  'already invested and maybe protective of that decision', 'their existing system', 'confidence that their system is doing its job'),
  th('another-bill', OBJ, [
    "Last thing I need is one more bill.", "I'm not adding another bill to the pile.", "We've got enough bills already.", "One more bill? No thanks.", "I don't want to pay another company every month.",
  ], "They're worried about stacking a new payment on top of their utility bill.",
  ['Makes sense. What does your power bill run in the summer right now?', 'Is it the idea of two bills that bugs you, or the total you pay?'],
  ["Totally understand. The only question is whether any program option could replace part of what you already pay instead of adding to it, and that depends on your usage, roof, and qualification.", "Nobody wants more bills. We'd look at your real numbers. If it doesn't lower or stabilize what you pay, it's not for you."],
  'worried about stacking up bills', 'adding a bill', 'one simpler, predictable monthly cost'),
  th('no-loan', OBJ, [
    "I don't do loans.", "We're not taking on any debt.", "I won't finance anything.", "We paid off our debts and we're not going back.", "No financing for me.",
  ], 'They dislike debt, or had a bad financing experience.',
  ['Is it debt in general, or did a loan burn you before?', 'What happened that made you feel that way about financing?'],
  ["I respect that. There may be different options depending on program terms, and some aren't loans. The consultant can explain exactly what each one is, in writing, so you can decide.", "Totally fair. Nothing is decided at the door, and you'd see exactly what each option is in writing before anything else."],
  'protective of being debt-free', 'financing', 'no surprises and full clarity'),
  th('expensive', OBJ, [
    "That stuff costs a fortune.", "Solar's way too pricey for us.", "We can't afford solar.", "I priced it out once, and it was crazy expensive.", "Isn't it like thirty grand?", "We don't have that kind of money.",
  ], "They're picturing a big upfront price or an old quote.",
  ['Compared to what: a quote you got, or what you heard?', 'When you say expensive, is that the upfront cost or the monthly?'],
  ["Fair concern. Pricing depends on program terms, your roof, and your usage, so I can't give a number at the door. We can look at your actual bill so you know for sure either way.", "I hear you. Some options are structured differently than people expect, but it all depends on qualification and program terms. The only way to know is to look at real numbers."],
  'worried about the cost', 'the cost', 'knowing the real number instead of guessing'),
  th('trust', OBJ, [
    "I don't trust any of these solar outfits.", "Solar companies are shady.", "You guys all say the same thing.", "How do I know you're not like the last company?", "Too many solar companies lie.",
  ], "They've heard horror stories or were misled before.",
  ['What have you heard, or what happened?', 'What would a company have to do to earn your trust?'],
  ["Honestly, I get it. This industry has some bad actors. That's why I'd rather show you everything in writing and let you take your time.", "Fair. Check our license and reviews, get everything in writing, and never sign at the door. That goes for any company."],
  'burned or skeptical', 'trust', 'a company that tells the truth in writing'),
  th('roof-damage', OBJ, [
    "I don't want holes drilled in my roof.", "Panels cause leaks.", "You're not putting anything up there.", "I'm worried about my roof getting damaged.", "Nobody is walking on my roof.",
  ], 'Worried about leaks, damage, or looks.',
  ['Is it leaks you worry about, or how it looks?', 'Have you had roof problems before?'],
  ["Totally fair. It's your home. The roof gets checked first, and you can ask exactly how penetrations are sealed and what warranty covers them.", "Understood. If the roof isn't a good fit, it isn't a fit. You'd see the plan and the warranty terms before anything happens."],
  'protective of their roof', 'the roof', 'peace of mind about their roof'),
  th('wont-save', OBJ, [
    "I don't see how this saves anybody money.", "The savings are never real.", "It doesn't actually pay off.", "My cousin's bill didn't go down.", "Those savings numbers are made up.",
  ], 'Skeptical of savings claims; probably heard overpromises.',
  ['What would you need to see to know if it makes sense for you?', "What happened with your cousin's system?"],
  ["You might be right. It doesn't make sense for every home. That's why we look at real usage and bills first, and if it doesn't pencil out, we'll tell you.", "I'd never promise savings at the door. It depends on your usage, utility plan, roof, and program terms. Let's look at facts."],
  'skeptical of savings claims', 'savings', 'an honest yes-or-no on whether it pencils out'),
  th('bad-experience', OBJ, [
    "The last solar company was a nightmare.", "We got burned by a solar company before.", "Our old system never worked right.", "A rep lied to my mom about solar.", "The installer ghosted us.",
  ], 'They may have been oversold or had poor service.',
  ['I am sorry. What happened?', 'What would have needed to go differently?'],
  ["That's frustrating, and I appreciate you telling me. Whatever happens, I want you to have everything explained up front and in writing.", "I'm sorry that happened. If you ever look again, ask hard questions and get everything in writing. You deserve that."],
  'burned and frustrated', 'their bad experience', 'being treated honestly this time'),
  th('long-term', OBJ, [
    "Twenty-five years is way too long.", "I'm not signing a long contract.", "I don't like being locked in.", "Those agreements last forever.", "What if I want out later?",
  ], 'They want flexibility or fear being locked in.',
  ['Is it the length itself, or what happens if plans change?', 'What would you want to know about getting out early?'],
  ["Makes sense. Terms vary by option, and the consultant can show exactly what happens if you move or sell. Nothing gets signed at the door.", "Fair. Ask for the exact terms in writing, including what happens at the end and if you sell."],
  'afraid of being locked in', 'the agreement length', 'flexibility and clear terms'),
  th('dont-believe', OBJ, [
    "Solar is just hype.", "I don't buy into the whole solar thing.", "It's a fad.", "Green energy is a racket.", "I'm not a solar guy.",
  ], 'Could be skepticism of the tech or just fatigue with pitches.',
  ["What makes you feel that way?", "Is it the technology itself, or the way it's sold?"],
  ["Fair enough. I'm not here to change your beliefs. Most neighbors just treat it as a math question on their bill. If it's a no, no worries.", "Totally respect that. For most people here, it's purely about the electric bill, not politics. If that's not interesting, I'll head out."],
  'skeptical of the whole idea', 'solar in general', 'a straight math answer'),
  th('selling', OBJ, [
    "We might sell in a few years.", "We're putting the house on the market soon.", "Won't solar make it harder to sell?", "What happens when we sell?", "I'm not staying here forever.",
  ], "They don't want to be trapped if they move.",
  ['How soon are you thinking of selling?', 'What would you want to know about selling with panels?'],
  ["Good question. Depending on the agreement there are usually options, like transferring or paying it off. The consultant can show what applies, in writing.", "If you're selling soon, this may not be for you, and that's okay. If it's a few years out, it's worth knowing the options."],
  'worried about selling the home', 'selling the house', 'not being stuck when they move'),
  th('monthly', OBJ, [
    "I don't want another monthly payment.", "No more payments for us.", "We're trying to cut payments, not add them.", "Another payment? Pass.", "Our budget can't take a new payment.",
  ], 'Budget is tight or they value simplicity.',
  ['Does your power bill swing a lot in summer?', "What's your bill like now, roughly?"],
  ["Totally get it. The question is just whether part of what you already pay could shift, and that depends on qualification and terms. If it doesn't help, you keep things as they are.", "Understood. If it doesn't make your monthly picture better or more predictable, it's not for you."],
  'protective of the monthly budget', 'a monthly payment', 'a predictable monthly budget'),
  th('scam', OBJ, [
    "Isn't this one of those solar scams?", "My friend says it's all a scam.", "I saw a news story about solar scams.", "Free solar is a scam.", "This sounds like a scam.",
  ], "They've seen bad stories, and some are real.",
  ['What did you hear? I would honestly like to know.', 'What would make you feel sure something is legit?'],
  ["Some companies earned that reputation. Ask anyone for everything in writing, verify their license, and never sign at the door. That's how we do it.", "Fair. And you're right to be careful about anything called 'free.' It isn't free. Costs and terms depend on the program and qualification."],
  'suspicious of a scam', 'scams', 'protection from bad actors'),
  th('happy-utility', OBJ, [
    "We like our electric company.", "APS treats us fine.", "SRP has always been good to us.", "No complaints about our power company.", "We're fine with the utility.",
  ], 'No pain yet, or they have not looked at summer bills.',
  ['Glad to hear it. How do summer bills compare to winter?', 'Has your rate changed much in the last few years?'],
  ["Great. You'd still stay with your utility either way. This is just about whether some of your power could come from your roof.", "That's good to hear. If your bill isn't an issue, no worries at all."],
  'content with the status quo', 'their utility', 'stability'),
  th('bill-low', OBJ, [
    "Our bill's tiny.", "We barely use any power.", "Our electric bill is like eighty bucks.", "We're really careful with power.", "We don't run the AC much.",
  ], 'Low usage may mean it is genuinely not a fit.',
  ['What does it run in July?', 'Is it low all year, or just right now?'],
  ["If it's low all year, this probably isn't for you, and that's fine.", "Then you might not need anything. If summer is different, it might be worth a look. Otherwise, you're doing great."],
  'not feeling any pain', 'a low bill', 'confirming they are already in good shape', { exclude: ['bill-high', 'ac-74', 'pool', 'ev', 'bill-swing', 'parents'] }),
  th('wait-tech', OBJ, [
    "Panels are getting better every year. I'll wait.", "I'll wait till the price drops.", "Next year's panels will be better.", "Batteries aren't there yet.", "I'm waiting on new technology.",
  ], 'Afraid of buying something that will soon be outdated.',
  ["What would 'better' look like for you?", 'What would you be waiting for specifically?'],
  ["Makes sense. Tech always improves. Meanwhile the bill keeps coming. Looking at your numbers today doesn't commit you to anything.", "Fair. If waiting is right for you, great. It's still worth knowing your options so you choose on facts."],
  'afraid of buying too early', 'waiting for better tech', 'making a well-timed decision'),
  th('ugly', OBJ, [
    "Panels look terrible.", "I don't want my house looking like that.", "They're an eyesore.", "My wife hates how panels look.", "It'll ruin the curb appeal.",
  ], 'Aesthetics matter to them.',
  ['Is it the street view you care about most?', 'Have you seen the newer all-black panels?'],
  ["Fair point. Designs often use back or side roof faces when possible, and you'd see a layout before deciding anything.", "Totally valid. It's your home. If the layout doesn't look right to you, it's a no."],
  'proud of their home', 'how panels look', 'a home they are proud of'),
  th('quotes', OBJ, [
    "I'm going to shop around.", "I'll get a few other quotes.", "We're comparing companies.", "I've got two other quotes coming.", "I always get three bids.",
  ], 'Smart shopper; wants a fair deal.',
  ['What will you compare: price, terms, or the company?', 'What would make one quote stand out?'],
  ["Smart. I'd encourage it. Get everything in writing so you can compare apples to apples.", "Great idea. When you compare, look at the terms, warranties, and who services it, not just the price."],
  'wanting a fair deal', 'comparing quotes', 'confidence they chose right'),
  th('hoa', OBJ, [
    "My HOA will never approve it.", "The HOA is strict.", "Our HOA doesn't allow panels.", "I don't want to fight the HOA.", "The HOA board will freak out.",
  ], 'They assume the HOA can block solar.',
  ['Have you checked with them, or is that what you heard?', 'What has the HOA pushed back on before?'],
  ["Arizona law generally limits HOAs from banning solar outright, though they can have design rules. The team can help with the HOA paperwork if you move forward.", "Good thing to raise. HOAs usually have design guidelines, and the paperwork is part of the process."],
  'worried about HOA hassle', 'the HOA', 'avoiding HOA headaches', { exclude: ['hoa'] }),
  th('too-old', OBJ, [
    "At my age, why bother?", "I won't be around long enough.", "I'm too old for a project like that.", "That's for younger folks.", "I'm not starting anything new at seventy.",
  ], "They think it won't benefit them in their timeframe.",
  ['Is it the agreement length, or the hassle?', 'What matters most to you about the house these days?'],
  ["I appreciate the honesty. Some neighbors your age look at it for predictability; others pass. Both are completely okay.", "Totally understand. Nothing happens unless it makes sense for you, and family is welcome to be part of any conversation."],
  'not wanting a hassle late in life', 'their age and timeline', 'simplicity and predictability'),
  th('roof-old', OBJ, [
    "My roof needs replacing.", "The roof's in rough shape.", "We need a new roof first.", "My shingles are falling apart.", "We have an old tile roof.",
  ], 'They fear extra roof costs.',
  ['Roughly how old is it?', 'Have you gotten any roof quotes?'],
  ["That's exactly what the site survey checks. If the roof needs work first, you'd know before anything moves forward.", "Good call. A roof in rough shape should be handled first. The survey would tell you honestly."],
  'worried about roof costs', 'the roof condition', 'knowing where the roof stands', { exclude: ['roof-new'] }),
  th('shade', OBJ, [
    "We get too much shade.", "Our roof faces the wrong way.", "The neighbor's tree shades everything.", "We don't get much sun on the roof.", "Our house sits under big trees.",
  ], 'They think their roof will not produce.',
  ['Which side gets the most sun?', 'Is it shaded all day, or just part of it?'],
  ["You might be right. Shade matters, and the design team checks it honestly. Not every roof is a fit.", "Good point. That's what the design review is for. If it isn't a fit, we'll tell you."],
  'doubting their roof', 'shade', 'an honest answer about their roof'),
  th('credit', OBJ, [
    "I don't want my credit run.", "My credit isn't great.", "We're not doing a credit check.", "We just had a credit hit.", "I don't want any hard inquiries.",
  ], 'Worried about qualifying or about privacy.',
  ['Do you have a rough idea of your credit range?', 'Is it the inquiry itself you are worried about?'],
  ["Nothing gets run at the door, and any credit check only happens with your permission. Most options have requirements, often around 650 or higher, but it depends on the program.", "Understood. We'd never run anything without your OK, and it's fine if it's not the right time."],
  'worried about credit', 'credit', 'privacy and no surprises'),
  th('cash-later', OBJ, [
    "When I go solar, I'll pay cash.", "I'll buy panels myself someday.", "I'd rather install it myself.", "I'm saving up to do it right.", "My buddy can install it for cheap.",
  ], 'DIY-minded or prefers to own outright.',
  ['Have you priced out doing it yourself?', 'What would doing it yourself look like?'],
  ["Love that. Some folks compare a DIY plan with a program option side by side. Happy to help you have both.", "Respect it. If you ever want to compare, we can lay out what an option looks like so you have the full picture."],
  'independent and hands-on', 'doing it themselves', 'owning the decision'),
  th('rates', OBJ, [
    "Electric rates aren't going up that much.", "Our rates are pretty stable.", "The bill is the bill.", "Rates go up a little, who cares.", "Power is cheap here.",
  ], 'They doubt rising-cost claims.',
  ['How has your bill changed over the last few years?', 'Have you compared this summer to three summers ago?'],
  ["You might be right. I can't predict rates. What I can do is look at your actual history with you.", "Fair. No predictions from me, just your real numbers."],
  'unconvinced there is a problem', 'electric rates', 'clarity on their own bill trend'),
  th('fatigue', OBJ, [
    "You're the fifth solar guy this month.", "We get solar people every week.", "Solar reps won't leave us alone.", "Another solar guy, really?", "Everybody's selling solar.",
  ], 'Tired of being pitched.',
  ["Ha, I believe it. What did the others get wrong?", 'What would make this the last knock you ever get about it?'],
  ["I believe it, and I'm sorry for the repeat. I'll keep it to thirty seconds, or I'll head out. Your call.", "Totally fair. If it's a no, I'll make a note so we don't bother you again."],
  'annoyed by repeat pitches', 'all the knocks', 'being left alone or getting a straight answer'),
  th('refusal', 'Clear refusal — respect it', [
    "Get off my porch.", "Leave now, please.", "I'm asking you to leave.", "Don't come back here.", "You need to go.", "We don't want it, goodbye.", "Please leave my property.", "I said no. Leave.", "Not interested. Please go.", "Do not knock on this door again.", "Off my lawn, please.", "Goodbye. Don't come back.", "We're done here.", "I'm closing the door now.", "No means no.",
  ], 'This is a clear no. It is not an objection to overcome.',
  ['None. Do not ask a follow-up.'],
  ['You got it. Sorry to bother you. Have a good day.', 'Understood. Thanks for your time.', 'No problem at all. Have a good one.'],
  'done with the conversation', 'their refusal', 'to be left alone', { refusal: true, contexts: 'none' }),
  th('renter', 'Objection — not qualified (homeownership)', [
    "We just rent here.", "The landlord owns the house.", "We're tenants.", "This is a rental.", "I don't own the place.", "My landlord handles that stuff.", "We lease this house.", "The owners live out of state.",
  ], "They aren't the homeowner, so they can't decide.",
  ['Got it. Do you know if the owner lives nearby?'],
  ['Thanks for letting me know! The program is for homeowners, so I will not keep you. Have a great day.'],
  'not the decision-maker', 'renting', 'a quick, polite exit', { contexts: 'none' }),
];

// Each situation is only paired with homeowner details that read naturally with it.
const ALLOW: Record<string, string[]> = {
 'not-interested': [
  'recent-rep',
  'retired',
  'kids',
  'neighbor'
 ],
 'have-solar': [
  'bill-high',
  'bill-swing',
  'pool',
  'ev',
  'tou',
  'srp',
  'aps'
 ],
 'another-bill': [
  'fixed-income',
  'tight',
  'retired',
  'kids',
  'refi',
  'bill-high'
 ],
 'no-loan': [
  'refi',
  'retired',
  'fixed-income',
  'tight',
  'long-time'
 ],
 'expensive': [
  'fixed-income',
  'tight',
  'retired',
  'kids',
  'refi',
  'recent-rep',
  'neighbor'
 ],
 'trust': [
  'reviews',
  'recent-rep',
  'neighbor',
  'relative-sells',
  'retired'
 ],
 'roof-damage': [
  'roof-new',
  'roof-15',
  'long-time',
  'contractor',
  'hoa'
 ],
 'wont-save': [
  'neighbor',
  'reviews',
  'bill-swing',
  'tou',
  'srp',
  'aps',
  'tep'
 ],
 'bad-experience': [
  'reviews',
  'recent-rep',
  'long-time',
  'retired'
 ],
 'long-term': [
  'retired',
  'downsize',
  'new-home',
  'long-time'
 ],
 'dont-believe': [
  'neighbor',
  'relative-sells',
  'contractor',
  'long-time'
 ],
 'selling': [
  'downsize',
  'new-home',
  'kids',
  'parents',
  'retired'
 ],
 'monthly': [
  'fixed-income',
  'tight',
  'retired',
  'refi',
  'kids'
 ],
 'scam': [
  'reviews',
  'recent-rep',
  'retired',
  'neighbor'
 ],
 'happy-utility': [
  'long-time',
  'retired',
  'bill-swing',
  'new-home'
 ],
 'bill-low': [
  'retired',
  'new-home',
  'long-time'
 ],
 'wait-tech': [
  'ev',
  'contractor',
  'new-home',
  'relative-sells',
  'neighbor'
 ],
 'ugly': [
  'hoa',
  'long-time',
  'new-home',
  'roof-new',
  'spouse-decides'
 ],
 'quotes': [
  'recent-rep',
  'relative-sells',
  'contractor',
  'neighbor',
  'reviews'
 ],
 'hoa': [
  'new-home',
  'long-time',
  'roof-new',
  'retired'
 ],
 'too-old': [
  'retired',
  'long-time',
  'fixed-income',
  'parents'
 ],
 'roof-old': [
  'long-time',
  'tight',
  'fixed-income',
  'hoa'
 ],
 'shade': [
  'hoa',
  'long-time',
  'new-home',
  'neighbor'
 ],
 'credit': [
  'refi',
  'tight',
  'new-home',
  'retired'
 ],
 'cash-later': [
  'contractor',
  'relative-sells',
  'neighbor',
  'long-time'
 ],
 'rates': [
  'aps',
  'srp',
  'tep',
  'long-time',
  'retired'
 ],
 'fatigue': [
  'recent-rep',
  'kids',
  'wfh',
  'retired'
 ]
};

export const cards = buildCategory({ category: 'objections', prefix: 'o', core: coreObjections, themes: OBJECTION_THEMES, contexts: HOUSEHOLD, target: CARDS_PER_CATEGORY, allow: ALLOW });
