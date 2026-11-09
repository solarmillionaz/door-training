// Hand-written standalone homeowner lines, tagged by situation so coaching fits.
// Spanish/Spanglish lines use "Spanish || English meaning".
export const OBJECTION_LINES: Record<string, string[]> = {
  'not-interested': [
    'Not interested, man.', "We're good.", "Nope, we're all set.", 'Pass.', 'No thanks, bud.', "We're fine, thank you.",
    "Eh, I'll pass.", "Nah, I'm good.", "We don't need anything.", "I'm gonna pass on that.", 'Sorry, we\'re not looking for anything.',
    "Whatever it is, we don't want it.", "Thanks, but we're all set over here.", "Appreciate it, but nah.", "Not something we need.",
    'No me interesa. || I am not interested.', 'Estamos bien, gracias. || We are fine, thanks.', 'Nah, no gracias, mijo. || Nah, no thanks, son.',
  ],
  'have-solar': [
    'We have panels, see?', "Look up, we've got 'em.", 'Already did it. Three years ago.', 'Our house is already solar.',
    "We're leasing panels already.", "Got solar with another company.", "We've had panels since 2019.", "Yeah, they're on the back of the house.",
    'Ya tenemos paneles. || We already have panels.', "We already went with Tesla.", "We already have a system and a battery.",
    "We bought our panels outright.", "Our solar is paid off.",
  ],
  'another-bill': [
    "I already pay enough bills.", "Every company wants a piece of my check.", "Nope, not another bill.", "I'm trying to get rid of bills.",
    "We just cut cable to save money.", "I don't need one more thing to pay.", 'Ya tengo muchos biles. || I already have a lot of bills.',
    "My mailbox is nothing but bills.", "Bills, bills, bills. No more.",
  ],
  'no-loan': [
    "We pay cash for everything.", "Debt-free and staying that way.", "I'm not borrowing for panels.", "No loans. Dave Ramsey would kill me.",
    "I don't finance stuff.", "We just got out of debt.", "Is this a loan? Then no.", 'No quiero préstamos. || I do not want loans.',
    "I don't sign anything with interest.", "My credit card is enough debt.",
  ],
  'expensive': [
    'How much does it cost?', "That's gotta be expensive.", "We can't swing that right now.", "Sounds pricey.",
    "We don't have money for that.", "Ain't nobody got thirty grand.", "We're broke, bro.", "My buddy paid like forty thousand.",
    'Eso cuesta mucho, ¿no? || That costs a lot, right?', "We're saving for a car right now.", "Too rich for my blood.",
    "Groceries cost too much already.", "We're on a budget.", 'No tenemos dinero. || We do not have money.',
  ],
  'trust': [
    "Who are you with, anyway?", "I don't trust door knockers.", "How do I know you're legit?", "You all say the same stuff.",
    "Every solar guy lies.", "Show me your badge first.", "I don't trust any of you.", "Salespeople always have an angle.",
    "Why should I believe you?", 'No confío en vendedores. || I do not trust salespeople.', "You're all scammers until proven otherwise.",
  ],
  'roof-damage': [
    "Panels make roofs leak.", "My buddy's roof leaked after solar.", "Nobody's drilling into my roof.", "I just fixed my roof.",
    "Tile roofs crack when they walk on them.", "My roof isn't strong enough.", "Our roof leaked last monsoon.", "Last thing I want is a leak.",
    'Mi techo es nuevo. || My roof is new.', "The roof guy said no solar.",
  ],
  'wont-save': [
    "My neighbor got solar and he hates it.", "My neighbor's bill went up.", "Solar doesn't save you squat.", "It takes twenty years to pay off.",
    "The math never works.", "Savings are a sales pitch.", "My sister still pays APS every month.", "Show me one person who saved.",
    'Eso no ahorra nada. || That does not save anything.', "I'd still have a power bill, so what's the point?",
  ],
  'bad-experience': [
    "We had solar people mess up our attic.", "The last guy never came back.", "We got sold a bad deal before.", "Our old system died.",
    "They promised savings and lied.", "We're still fighting the last solar company.", "My parents got ripped off.", "Never again.",
    "That company went bankrupt on us.", 'Nos robaron la última vez. || They ripped us off last time.',
  ],
  'long-term': [
    "Twenty years? No way.", "I don't commit to anything that long.", "I don't sign contracts.", "That's longer than my mortgage.",
    "I'll probably be dead by then.", "No contracts. Period.", "Can I cancel anytime?", "I'm not marrying a solar company.",
    'No firmo contratos. || I do not sign contracts.',
  ],
  'dont-believe': [
    "Solar is a gimmick.", "I'm old school.", "Coal works fine.", "I don't buy the hype.", "That green stuff isn't for me.",
    "Panels don't do much.", "It's all politics.", "I'll believe it when I see it.", "Solar's overrated.",
  ],
  'selling': [
    "We're moving in a year.", "Selling next spring.", "We're house hunting already.", "Buyers hate solar contracts.",
    "Our realtor said no solar.", "It's a starter home.", "We're flipping this house.", "Nos vamos a mudar pronto. || We are moving soon.",
    "Gonna sell when the kids graduate.", "We're relocating to Texas.",
  ],
  'monthly': [
    "Another payment? Nope.", "We've got a car payment already.", "No more monthly anything.", "Our budget is maxed.",
    "We're paying off the truck first.", "I hate subscriptions.", "Every month something new.", 'Otro pago no. || Not another payment.',
    "Can't add a single payment right now.",
  ],
  'scam': [
    "This is a scam, right?", "Sounds like a scam to me.", "Nothing's free. What's the catch?", "Is this one of those free solar deals?",
    "My grandma got scammed by solar.", "I saw this on the news.", "Scam alert.", "The government doesn't give free panels.",
    'Eso es una estafa. || That is a scam.', "Too good to be true.",
  ],
  'happy-utility': [
    "We're fine with SRP.", "APS is fine by me.", "Our power company is great.", "My bill is what it is.",
    "TEP's never given us problems.", "I like paying APS, honestly.", "Never had a problem with the utility.", "We're loyal SRP customers.",
  ],
  'bill-low': [
    "Our bill's like a hundred bucks.", "We hardly use electricity.", "We keep the AC off.", "Our bill's fine.", "Ours is low, we have swamp coolers.",
    "We're never home, so the bill's small.", "Just me here, bill's tiny.", 'Mi bil es bajito. || My bill is low.',
  ],
  'wait-tech': [
    "I'll wait for better panels.", "Prices will come down.", "Batteries will get cheaper.", "Give it five years.",
    "I'm waiting for Elon's roof tiles.", "New tech every year, I'll wait.", "Solar paint is coming.", "Not until it's cheaper.",
  ],
  'ugly': [
    "They look ugly.", "Not on the front of my house.", "My wife says no, they're ugly.", "I don't like the look.",
    "They'd ruin my view from the street.", "Panels are hideous.", "Only if you can hide them.", 'Se ven feos. || They look ugly.',
  ],
  'quotes': [
    "Got any references?", "I'm getting three quotes.", "I already have a quote from SunPower.", "My nephew can get me a better price.",
    "Can you beat this price?", "I'll compare you guys.", "Costco has a solar program.", "I'm talking to two other companies.",
  ],
  'hoa': [
    "Will my HOA let me?", "HOA won't approve it.", "My HOA is a nightmare.", "The HOA fined us for a mailbox.",
    "HOA says no panels in front.", "I'd have to ask the HOA.", "Our HOA hates everything.",
  ],
  'too-old': [
    "I'm 82, I don't need this.", "Not at my age, honey.", "I'm too old for twenty years.", "My kids handle all that now.",
    "I'm just trying to live out my days.", "Ask me when I was forty.", 'Ya estoy muy viejo para eso. || I am too old for that.',
  ],
  'roof-old': [
    "Our roof's old.", "Roof needs work first.", "The roof is original from '85.", "We've got leaks already.",
    "We're redoing the roof next year.", "Roof's shot.", "It's an old shingle roof.",
  ],
  'shade': [
    "We've got too many trees.", "Our roof faces north.", "We don't get sun back there.", "That palm shades the whole roof.",
    "Not enough roof space.", "The neighbor's house blocks the sun.", "Our roof is tiny.",
  ],
  'credit': [
    "My credit's bad.", "We just filed bankruptcy.", "I'm not giving you my social.", "Don't pull my credit.",
    "We don't have credit.", "My score is like 580.", "I'm rebuilding my credit.", 'No tengo crédito. || I do not have credit.',
  ],
  'cash-later': [
    "I'll do it myself.", "I can buy panels on Amazon.", "I'm an electrician, I'll do it.", "I'd rather pay cash later.",
    "My cousin installs panels.", "I'll DIY it someday.", "I'll just buy a generator.",
  ],
  'rates': [
    "Rates are fine.", "My bill hasn't changed in years.", "Power's cheap compared to California.", "Rates barely move.",
    "SRP rates are low.", "I'm not worried about rates.",
  ],
  'fatigue': [
    "Y'all were just here last week.", "Another one?", "You guys come every day.", "How many of you are there?",
    "The last one left an hour ago.", "Come on, again?", "Y'all need to stop knocking.", "Third solar guy today.",
    'Otra vez ustedes. || You guys again.',
  ],
  'refusal': [
    "No soliciting, can't you read the sign?", "Get off my property.", "Leave or I'm calling the cops.", "Go away.",
    "Don't make me ask twice.", "Bye.", "Shut the gate on your way out.", "Váyase, por favor. || Please leave.",
    "We don't want anything. Goodbye.", "I'm calling the HOA.", "Take a hike.",
  ],
  'renter': [
    'We rent.', "I'm just renting.", "Talk to my landlord.", "Not my house.", "This is my mom's house.",
    "I'm the tenant.", 'Rentamos. || We rent.', "It's a rental, sorry.", "The property manager handles that.",
  ],
};

// Batch 2
const MORE: Record<string, string[]> = {
  'not-interested': [
    "Nah, we're all set.", "I'm good, thanks though.", "We don't need anything.", "Solar's not my thing.", "Thanks, but no thanks.",
    'No gracias, estamos bien. || No thanks, we are fine.', "Appreciate it, but nope.",
  ],
  'have-solar': [
    "Look up. We already have panels.", "We got ours two years ago.", "Our panels are already paid off.", "My dad already put solar on this house.",
    'Ya tenemos paneles. || We already have panels.',
  ],
  'another-bill': [
    "We just paid off the car. No new bills.", "I don't need one more thing to pay.", "Every company wants a payment. No.",
  ],
  'no-loan': [
    "We don't borrow money.", "I'm not financing a roof thing.", "I'm debt free and staying that way.", 'No quiero préstamos. || I do not want loans.',
  ],
  'expensive': [
    "Solar costs a fortune.", "That's way out of our budget.", "We can't swing that right now.", "My neighbor paid like forty grand.",
    'Es muy caro. || It is very expensive.',
  ],
  'trust': [
    "I don't trust door-to-door guys.", "Salespeople always lie.", "Everybody's got an angle.", "How do I know you're not lying to me?",
  ],
  'roof-damage': [
    "I don't want holes in my roof.", "Panels make roofs leak.", "Last time someone was on my roof, it leaked.",
  ],
  'wont-save': [
    "Solar doesn't save you anything.", "The math never works out.", "My bill won't really go down.", "You still pay the utility anyway.",
  ],
  'bad-experience': [
    "My sister got screwed by a solar company.", "We had a terrible install at our old house.", "The last company ghosted us.",
    'Ya nos estafaron una vez. || We already got scammed once.',
  ],
  'long-term': [
    "Twenty-five years? I'll be gone by then.", "That's way too long to be tied up.", "I'm not signing a contract that long.",
  ],
  'dont-believe': [
    "Those numbers are made up.", "That sounds too good to be true.", "I've heard all that before.", "Prove it.",
  ],
  'selling': [
    "We're putting it on the market soon.", "We're selling next year.", "This isn't our forever home.",
  ],
  'monthly': [
    "I can't add anything to my monthly budget.", "I'm on a fixed income.", 'No me alcanza para otro pago. || I cannot afford another payment.',
  ],
  'scam': [
    "My friend said it's all a scam.", "It's a racket.", "Free panels, right? That's a scam.", 'Eso es fraude. || That is a fraud.',
  ],
  'happy-utility': [
    "SRP's been good to us.", "We're on equal pay, it's fine.", "I like my power company.",
  ],
  'bill-low': [
    "We're barely home, the bill's nothing.", "Our bill's only like eighty bucks.", "We keep the AC at 80.",
  ],
  'wait-tech': [
    "Panels are getting cheaper every year.", "I'll wait for the next generation.", "Batteries are gonna get better.",
  ],
  'ugly': [
    "Panels make the house look cheap.", "My wife hates how they look.", "They're an eyesore.",
  ],
  'quotes': [
    "I'm getting three bids first.", "I'm gonna compare you with Tesla.", "Costco has a solar deal, I'll check that.",
  ],
  'hoa': [
    "The HOA will fine us.", "Our HOA is a nightmare.", "The HOA president lives next door.",
  ],
  'too-old': [
    "I'm eighty-two, son.", "I won't live long enough for it to pay off.", 'Ya estoy muy viejo para eso. || I am too old for that.',
  ],
  'roof-old': [
    "The roof's original from '98.", "We need a new roof first.", "Our roof's falling apart.",
  ],
  'shade': [
    "That big mesquite shades everything.", "Our house faces the wrong way.", "The neighbor's two-story blocks the sun.",
  ],
  'credit': [
    "Our credit's shot.", "I don't want anyone pulling my credit.", "We just had a foreclosure.", 'No tengo buen crédito. || I do not have good credit.',
  ],
  'cash-later': [
    "I'd rather save up and pay cash.", "I'll buy it outright someday.",
  ],
  'rates': [
    "Interest rates are crazy right now.", "I'm waiting for rates to drop.",
  ],
  'fatigue': [
    "You're the fifth solar guy this week.", "Another one? Seriously?", "Every day there's a solar guy here.", "I'm so tired of you guys.",
    'Otra vez ustedes. || You guys again.',
  ],
  'refusal': [
    "I said no. Please go.", "Do not come to my house again.", "We're not interested, and don't come back.", "Leave my property, please.",
  ],
  'renter': [
    "I'm a renter, man.", "Landlord owns it.", "Talk to the property management company.", 'Nomás rentamos. || We only rent.',
  ],
};
for (const [k, v] of Object.entries(MORE)) OBJECTION_LINES[k] = [...(OBJECTION_LINES[k] ?? []), ...v];
