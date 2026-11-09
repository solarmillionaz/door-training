import { buildCategory, type Theme } from './gen';
import { TIMING } from './contexts';
import { coreSmokescreens } from './core';
import { CARDS_PER_CATEGORY } from './types';

const SMOKE = 'Smokescreen';
const POSS = 'Possible smokescreen';
const TIMING_C = 'Genuine timing issue (probably)';
const REFUSAL = 'Clear refusal — NOT a smokescreen';
const th = (key: string, classification: string, phrasings: string[], meaning: string, questions: string[], responses: string[], feeling: string, topic: string, need: string, extra: Partial<Theme> = {}): Theme =>
  ({ key, classification, phrasings, meaning, questions, responses, feeling, topic, need, ...extra });

// Brush-offs trainers commonly flag at the door: no time, think about it, spouse, send info, call you, etc.
export const SMOKESCREEN_THEMES: Theme[] = [
  th('busy', POSS, ["Now's not a good time.", "I'm slammed right now.", "Can't talk right now.", "I've got a lot going on.", "You caught me at a bad time.", "I don't have time for this today."],
    'Could be truly busy, or a polite exit.', ['No problem. Is later today or tomorrow evening better?', 'Totally get it. What time usually works for you?'],
    ["I'll keep it short or come back. What works better for you?", "No worries at all. When is a better time to catch you?"], 'short on time', 'their schedule', 'a better time that actually works'),
  th('come-back', POSS, ["Try me next week.", "Come back some other time.", "Swing by later.", "Catch me another day.", "Stop by this weekend."],
    'Real scheduling, or a way to end the chat.', ['Sure. What day and time is best?', 'Happy to. Who should I ask for?'],
    ["Happy to. Let's pick a time so I don't bug you at a bad moment.", "Sounds good. Is morning or evening better?"], 'wanting to end the conversation politely', 'coming back later', 'a specific time they actually agreed to'),
  th('flyer', SMOKE, ["Just leave something in the door.", "Leave a card.", "Do you have a pamphlet?", "Put it in the mailbox.", "Just drop off some info."],
    'Ending the chat without saying no.', ['Sure. What would you want that flyer to answer?', 'Of course. Is your bill with APS, SRP, or TEP?'],
    ["Of course. So I leave the right info, what matters most to you?", "Happy to. Quick question so it is useful: what does your summer bill run?"], 'avoiding a conversation', 'the flyer', 'information that actually answers their question'),
  th('send-info', SMOKE, ["Email me something.", "Just send me the details.", "Can you mail me the info?", "Shoot me an email.", "Send it to me and I'll look."],
    'Polite brush-off, or real interest in reading.', ['Happy to. What would you most want to know?', 'Sure. What would make it worth reading?'],
    ["Absolutely. What is most important to you, so I send what is actually useful?", "Sure thing. Is there one question you'd want answered first?"], 'not ready to engage', 'the information', 'the one answer they care about'),
  th('call-you', SMOKE, ["I'll reach out if I'm interested.", "I'll give you a call.", "Leave your number, I'll call.", "If I want it, I'll let you know.", "Don't call me, I'll call you."],
    'Usually a soft no.', ['Sounds good. What would you want to know before you call?', 'Sure. Is it okay if I check back once?'],
    ["Perfect. Here is my card. Is it okay if I check back once, just in case?", "Great. If you don't call, would a quick check-in Thursday be okay?"], 'politely closing the door', 'calling later', 'control over the timing'),
  th('think', SMOKE, ["Let me sleep on it.", "I'll think it over.", "I need some time to think.", "Give me a few days.", "Let me mull it over."],
    "There's usually a specific doubt they haven't voiced.", ['Of course. What part would you be thinking over?', 'Fair. Is it the cost, the company, or the timing?'],
    ["Totally fair. Usually when I hear that, there's one piece that doesn't sit right. What is it for you?", "Of course. What is the main thing you'd want to feel sure about?"], 'unsure about one piece', 'the hidden question', 'clarity on their real concern'),
  th('spouse', TIMING_C, ["My husband's at work.", "My wife isn't here.", "I'd need my partner here.", "My husband makes those decisions.", "My wife would kill me if I did this without her."],
    'A real decision-maker issue, since both owners should be present.', ['When are you both usually home?', 'What evening works for both of you?'],
    ["That's important. We always want both of you there. What evening works for you both?", "Absolutely. Let's set a time when you are both home."], 'not wanting to decide alone', 'the other decision-maker', 'both decision-makers together'),
  th('leaving', TIMING_C, ["I'm walking out the door.", "I'm on my way out.", "I've got to run.", "I'm late already.", "We're heading out."],
    'Probably true.', ["No worries. When's a better time?", 'Want me to swing back later?'],
    ["Go ahead! When should I come back?", "I won't hold you up. Is tomorrow better?"], 'in a rush', 'leaving', 'a better time', { exclude: ['church','pickup'] }),
  th('talked', POSS, ["We already talked to a solar company.", "Somebody already came by.", "We had a consultation last month.", "Another company already gave us a quote.", "We've heard the pitch."],
    'Could have a quote, or got burned by a pushy rep.', ['Oh nice. How did that go?', 'What did you think of what they showed you?'],
    ["Got it. What did you like, and what didn't sit right?", "Okay! Did you end up moving forward, or did something hold you back?"], 'already pitched', 'the earlier pitch', 'a clear comparison'),
  th('no-door-decisions', SMOKE, ["I never buy anything at the door.", "I don't do business on my porch.", "I'm not deciding anything right now.", "I don't sign stuff at the door.", "I don't buy from door knockers."],
    'Worried about pressure.', ['Totally fair. What would you need to make a decision?', 'Makes sense. What would a good next step look like?'],
    ["You shouldn't! Nobody makes a decision today. I'm only seeing if it's worth setting a time.", "Agreed. Nothing gets decided here. We'd just set a time to look at details."], 'worried about pressure', 'deciding at the door', 'no pressure'),
  th('cooking', TIMING_C, ["I'm in the middle of cooking.", "I've got food in the oven.", "I'm making dinner.", "Dinner's almost ready.", "I'm cooking for the family."],
    'Probably true; act accordingly.', ['Is later tonight or tomorrow better?', 'When should I come back?'],
    ["I won't keep you! When's better?", "Enjoy dinner! I'll come back another time."], 'busy with family', 'dinner', 'respect for their evening', { exclude: ['stove','eating'] }),
  th('working', TIMING_C, ["I'm working.", "I'm on the clock.", "I work from home and I'm busy.", "I'm in the middle of work.", "I've got deadlines today."],
    'Working from home; a real constraint.', ['When do you usually wrap up?', 'Is the weekend better?'],
    ["Sorry for interrupting! When's your day usually done?", "Got it. I'll swing by after work hours."], 'focused on work', 'their workday', 'a time after work', { exclude: ['zoom','meeting','lunch'] }),
  th('guests', TIMING_C, ["We have company.", "We've got people over.", "We're hosting tonight.", "Family's in town.", "We're having a party."],
    'Real timing issue.', ['Would tomorrow evening work better?', 'What day is calmer?'],
    ["Enjoy your company! I'll come back another time.", "No worries at all. Have fun!"], 'hosting', 'their guests', 'a calmer day', { exclude: ['visitor'] }),
  th('research', POSS, ["I want to look into it first.", "I'll do my homework.", "I need to read up on it.", "Let me check some reviews.", "I'll google it."],
    'Wants to verify, or a soft exit.', ['Great. What would you look up first?', 'What would you want to verify?'],
    ["Smart. What specifically do you want to research? I can make sure you get accurate info.", "Love it. Check licensing and reviews. What else would you look for?"], 'wanting to verify', 'their research', 'trustworthy facts'),
  th('later', POSS, ["Maybe after summer.", "Check back in the fall.", "Maybe after the holidays.", "Next year, maybe.", "Not this month."],
    'Delaying; may have a reason.', ['What changes by then?', 'Is something happening right now?'],
    ["Sure. Is something going on now, or just timing?", "Okay. What would make later better than now?"], 'putting it off', 'the timing', 'knowing why later is better'),
  th('decision-maker', POSS, ["I'm not the one who decides.", "Talk to the homeowner.", "I'm just house-sitting.", "My dad owns the house.", "The owner isn't home."],
    'May not be the owner, or deflecting.', ['Who would be the best person to talk to?', 'When is the owner usually around?'],
    ["No problem. When is the homeowner usually around?", "Got it. Thanks! I'll catch the owner another time."], 'not the right person', 'the decision-maker', 'the right person in the conversation'),
  th('moving', POSS, ["We might move.", "We're thinking about selling.", "We might not be here long.", "We could relocate for work.", "We might downsize soon."],
    'Could be real, or an easy out.', ['How soon are you thinking?', 'Is it a sure thing, or just a maybe?'],
    ["If you're moving soon, this probably isn't for you. If it's a ways off, there may still be options.", "Makes sense. What's the timeline looking like?"], 'uncertain about the future', 'moving', 'an honest fit check'),
  th('not-ready', POSS, ["We're not ready.", "It's not the right time for us.", "We're not there yet.", "Maybe when things settle down.", "Too much going on right now."],
    "Something's missing: info, money, or trust.", ['What would make you feel ready?', 'What would need to happen first?'],
    ["Totally fair. What would need to happen first?", "Makes sense. Is there anything that would make it easier?"], 'not ready', 'readiness', 'the right timing'),
  th('text', POSS, ["Just text me.", "Text me the info.", "I'm better over text.", "Can you message me instead?", "Send a text."],
    'Wants to avoid face time, or genuinely prefers text.', ['Sure. What would you want in the text?', 'Happy to, with your OK. What should it cover?'],
    ["Happy to, only if you're okay with it. What would be most helpful to include?", "Sure. I'll keep it short. What's the one thing you want to know?"], 'preferring a different channel', 'texting', 'communication on their terms'),
  th('website', POSS, ["Do you have a website?", "Where can I look you up?", "What's the company name again?", "Are you guys online?", "Got a website I can check?"],
    "Wants to verify you're legit, or a brush-off.", ['Sure. What would you want to check?', 'What would you look for, reviews or licensing?'],
    ["Of course. What would you look for: reviews, licensing?", "Absolutely. Check us out, and ask me anything that comes up."], 'cautious', 'legitimacy', 'proof you are legit'),
  th('refusal', REFUSAL, ["Please don't knock here again.", "We don't talk to salespeople, goodbye.", "Read the sign. No soliciting.", "I'm not interested, please leave.", "Remove us from your list.", "We said no last time.", "Stop knocking on our door.", "Please go away.", "Don't ever come back.", "I'm calling the HOA if you don't leave.", "No thank you. Goodbye.", "We've asked you people to stop.", "Put us on your do-not-knock list.", "I'm not opening the door. Go away.", "Not now, not ever.", "Leave. Now.", "Please respect the sign.", "Don't bother us.", "We are not interested in any way.", "This conversation is over."],
    'A clear request not to be contacted. Respect it.', ['None. Do not ask.'],
    ["Understood. Sorry to bother you. Have a good day.", "Absolutely. I'll make a note so no one knocks again.", "You got it. Thanks for your time."], 'done', 'the refusal', 'to be left alone', { refusal: true, contexts: 'none' }),
];

// Each situation is only paired with homeowner details that read naturally with it.
const ALLOW: Record<string, string[]> = {
 'busy': [
  'dog',
  'meeting',
  'practice',
  'lunch',
  'stove',
  'delivery',
  'contractor-here',
  'zoom',
  'pickup',
  'long-day',
  'eating',
  'baby'
 ],
 'come-back': [
  'just-home',
  'pajamas',
  'game',
  'practice',
  'nap',
  'visitor',
  'vacation',
  'long-day',
  'eating',
  'heat'
 ],
 'flyer': [
  'dog',
  'meeting',
  'zoom',
  'baby',
  'pickup',
  'stove',
  'heat',
  'pajamas'
 ],
 'send-info': [
  'zoom',
  'meeting',
  'lunch',
  'pickup',
  'vacation',
  'long-day'
 ],
 'call-you': [
  'dog',
  'baby',
  'stove',
  'pickup',
  'meeting',
  'game'
 ],
 'think': [
  'long-day',
  'vacation',
  'just-home'
 ],
 'spouse': [
  'practice',
  'pickup',
  'baby',
  'visitor'
 ],
 'leaving': [
  'meeting',
  'lunch',
  'practice',
  'delivery'
 ],
 'talked': [
  'just-home',
  'long-day'
 ],
 'no-door-decisions': [
  'pajamas',
  'long-day',
  'heat'
 ],
 'cooking': [
  'baby',
  'practice',
  'visitor',
  'game',
  'long-day',
  'just-home'
 ],
 'working': [
  'dog',
  'delivery',
  'baby',
  'long-day'
 ],
 'guests': [
  'game',
  'stove',
  'eating',
  'heat'
 ],
 'research': [
  'long-day',
  'vacation',
  'meeting'
 ],
 'later': [
  'vacation',
  'practice',
  'visitor',
  'long-day',
  'contractor-here'
 ],
 'decision-maker': [
  'dog',
  'baby',
  'visitor'
 ],
 'moving': [
  'contractor-here',
  'vacation',
  'long-day'
 ],
 'not-ready': [
  'vacation',
  'contractor-here',
  'long-day',
  'visitor'
 ],
 'text': [
  'zoom',
  'meeting',
  'baby',
  'dog',
  'pickup',
  'lunch'
 ],
 'website': [
  'zoom',
  'meeting',
  'pickup',
  'stove'
 ]
};

export const cards = buildCategory({ category: 'smokescreens', prefix: 's', core: coreSmokescreens, themes: SMOKESCREEN_THEMES, contexts: TIMING, target: CARDS_PER_CATEGORY, allow: ALLOW });
