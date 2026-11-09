// Hand-written standalone homeowner questions, tagged by situation so coaching fits.
export const CONCERN_LINES: Record<string, string[]> = {
  'breaks': [
    "What if it breaks?", "Who fixes it?", "How long do panels last?", "Do panels go bad?", "What if a rock hits one?",
    "What's the warranty?", "Is there a warranty on labor?", "What if a bird messes it up?", "Who do I call when it stops?",
    '¿Y si se descompone? || And what if it breaks down?', "Do they need replacing?",
  ],
  'outage': [
    "Does it work when the power's out?", "Will I have power in a blackout?", "What about when the grid goes down?",
    "Can I run my AC in an outage?", "Does it keep my fridge on?", "I need power for my oxygen machine.",
    '¿Funciona cuando se va la luz? || Does it work when the power goes out?', "We lose power every monsoon. Would this help?",
  ],
  'battery-care': [
    "Do I need a battery?", "Where does the battery go?", "Is the battery in the garage?", "Can batteries catch fire?",
    "How big is the battery?", "Is the battery loud?", "Does the battery need water or anything?", "What's a Powerwall?",
  ],
  'utility-bill': [
    "Is this SRP?", "Do I still pay APS?", "Do I still get a bill?", "Does SRP know about this?", "Do I cancel APS?",
    "Will I get two bills now?", "What's my APS bill gonna be?", '¿Todavía pago la luz? || Do I still pay the electric bill?',
    "Do I still pay the connection fee?",
  ],
  'roof-repair': [
    "What if I need a new roof?", "Who pulls the panels off for roofers?", "What happens to my roof warranty?",
    "Do you seal the holes?", "Who pays if it leaks?", "Can you walk on tile?", "Do you fix the roof first?",
  ],
  'move': [
    "What if I sell the house?", "Does it transfer to the buyer?", "Can I take the panels with me?", "Will it hurt resale?",
    "Do homes with solar sell faster?", '¿Y si vendo la casa? || And if I sell the house?', "What if the buyer doesn't want it?",
  ],
  'taxes': [
    "Do my taxes go up?", "Will the county raise my assessment?", "Do I pay taxes on this?", "Does it affect my homestead?",
    'Suben los impuestos? || Do the taxes go up?',
  ],
  'install-time': [
    "How long does it take?", "When can you install?", "How long till it's on?", "Is it a one-day install?",
    "How much mess is it?", "Will the crew be loud?", "How long are permits?", "Do I need to be off work?",
  ],
  'credit-req': [
    "What credit do I need?", "Do you check credit?", "Is it a hard pull?", "What if my wife has better credit?",
    "Can I use my husband's credit?", "Do you need my social?", '¿Necesito crédito? || Do I need credit?', "Does an ITIN work?",
  ],
  'insurance': [
    "Do I tell my insurance?", "Does my premium go up?", "Who insures the panels?", "Does insurance cover hail damage?",
    "Will State Farm care?",
  ],
  'add-battery': [
    "Can I add a battery later?", "Can I add more panels?", "Will it charge my Tesla?", "Can I add an EV charger?",
    "Can I add on if my bill goes up?", "Can you add a battery to my old panels?",
  ],
  'underproduce': [
    "How much power will it make?", "What if it doesn't cover my whole bill?", "Is the production guaranteed?",
    "What if it's cloudy all week?", "Do panels work in 115 degrees?", "Does dust mess it up?", "What if the estimate is wrong?",
  ],
  'affiliated': [
    "Are you from SRP?", "Is this through APS?", "Are you guys with the city?", "Is this a government thing?",
    "Is this the federal solar program?", "Is this a state program?", "Did the utility send you?", '¿Es del gobierno? || Is it from the government?',
  ],
  'roof-eligible': [
    "Will it fit on my roof?", "Does it work on a flat roof?", "Do you do tile?", "Is my roof big enough?",
    "Does it work on a mobile home?", "Can it go on the patio cover?", "Can you put it on the ground?",
  ],
  'end-term': [
    "Who owns it after twenty years?", "What happens at the end?", "Can I buy it out?", "Do you take it down after?",
    "Can I renew?", "Does it get old by then?",
  ],
  'monsoon': [
    "What about haboobs?", "What about hail?", "Will wind blow them off?", "Does lightning hit them?",
    "What happens in a monsoon?", '¿Y con las tormentas? || And with the storms?',
  ],
  'dust': [
    "Do I have to clean them?", "Who cleans them?", "Can I hose them off?", "Do pigeons get under them?",
    "Do you guys put bird guards on?", "How often do you clean them?",
  ],
  'net-metering': [
    "Does SRP buy my extra power?", "What happens to extra power?", "Do I get paid for extra?", "Is net metering still a thing?",
    "Does it run my meter backwards?", "Do I need a new meter?",
  ],
  'legit': [
    "Are you licensed?", "Can I see your badge?", "What's your ROC number?", "Are you a subcontractor?",
    "Who actually installs it?", "Do you guys have Google reviews?", "Are you local or out of state?",
  ],
  'equipment': [
    "What brand?", "Are they Chinese panels?", "Are they made in the USA?", "Is it Tesla?", "What inverter is it?",
    "Microinverters or string?", "Do I get an app?",
  ],
  'demand': [
    "Does it help with the 4 to 7 peak?", "What about demand charges?", "We're on the EZ-3 plan. Does it matter?",
    "I'm on time-of-use. Does that change things?", "What about the on-peak hours?",
  ],
  'tax-credit': [
    "Do I get the tax credit?", "Is the 30 percent still a thing?", "What if I don't owe taxes?", "Is there a rebate?",
    "Do I get a check from the government?", '¿Hay crédito de impuestos? || Is there a tax credit?',
  ],
  'home-install': [
    "Do I have to be home?", "Do they come inside?", "Will they mess up my garage?", "What about my dogs?",
    "Do they need the breaker box?", "Do you shut my power off?",
  ],
  'service-area': [
    "Do you do Glendale?", "Do you go to Maricopa?", "Do you cover Mesa?", "Do you service Surprise?", "Do you go to Queen Creek?",
    "Do you cover the West Valley?",
  ],
  'support': [
    "Who do I call if something goes wrong?", "Is there customer service?", "What if you guys go out of business?",
    "Can I see it on my phone?", "Do you monitor it?", "Do I get a person or a robot?",
  ],
  'see-contract': [
    "Can I see the contract?", "Can my kids read it first?", "Is there a cancel period?", "Do I get a copy?",
    "Can I take it to a lawyer?", "Can I read the fine print?", '¿Está en español? || Is it in Spanish?',
  ],
  'how-much-save': [
    "What's the catch?", "How much would I save?", "What's my payment?", "Is it cheaper than APS?", "What's the price per watt?",
    "How much per month?", "Is there money down?", '¿Cuánto me ahorro? || How much do I save?', '¿Cuánto cuesta? || How much does it cost?',
    "What's the rate per kilowatt?",
  ],
  'battery-peak': [
    "Can it run my AC at night?", "Can a battery run the whole house?", "Is a battery worth it?", "How long does a battery last at night?",
    "Can I run the pool pump on battery?",
  ],
  'ownership': [
    "Is this a lease?", "Do I own it?", "Is it a PPA?", "Is it a loan or a lease?", "Who owns the panels?",
    "Can I own it right away?", '¿Es renta o es mío? || Is it a rental or mine?',
  ],
};

// Batch 2
const MORE: Record<string, string[]> = {
  'breaks': [
    "What if an inverter dies?", "Do you replace cracked panels for free?", "Who pays for repairs after ten years?", "Has anyone's ever caught fire?",
    "Do they stop working when they get old?", "What if a roofer cracks one?", '¿Quién lo arregla? || Who fixes it?', "My buddy's panels quit after five years. Why?",
  ],
  'outage': [
    "Will it power the well pump?", "Does it shut off when APS goes down?", "Can I keep the Wi-Fi going in an outage?",
    "Is it like a generator?", '¿Tengo luz si hay apagón? || Do I have power if there is a blackout?', "Can I unplug from the grid totally?",
  ],
  'battery-care': [
    "Do batteries wear out?", "Is it safe in a hot garage?", "Does the battery get hot in July?", "Can the kids mess with it?",
    "Do I have to maintain the battery?", '¿La batería es peligrosa? || Is the battery dangerous?',
  ],
  'utility-bill': [
    "So I'd have two payments?", "Will APS still charge me something?", "What's the minimum SRP bill with solar?",
    "Does my budget billing change?", '¿Me sigue llegando el recibo? || Do I keep getting the bill?', "Why would I still owe TEP anything?",
  ],
  'roof-repair': [
    "Does drilling void anything?", "Will it crack my tiles?", "Who fixes broken tiles after?", "Do you replace the underlayment?",
    '¿Le hacen hoyos al techo? || Do you make holes in the roof?', "What if water gets in during monsoon?",
  ],
  'move': [
    "Does the loan follow me or the house?", "Will a buyer's lender care?", "Do I have to pay it off to sell?",
    "Does it raise my home value?", "What if I rent the house out later?", '¿Me lo puedo llevar si me mudo? || Can I take it if I move?',
  ],
  'taxes': [
    "Do I need to file anything special?", "Will my escrow change?", "Does it count as income?", "Does my accountant need to know?",
  ],
  'install-time': [
    "How long from signing to power?", "Do I need an inspection?", "Who handles the permits?", "Do you need the city's OK?",
    "Will there be a dumpster in my driveway?", '¿Cuánto tarda la instalación? || How long does the installation take?', "Can you do it before summer?",
  ],
  'credit-req': [
    "Is 650 enough?", "I had a bankruptcy. Does that matter?", "Will it ding my score?", "Do I need a co-signer?",
    "Can my retired mom qualify?", '¿Revisan el crédito? || Do you check credit?', "Does it show up as debt?", "What if I'm in collections?",
  ],
  'insurance': [
    "Do I need extra coverage?", "Is it covered if a tree falls on it?", "Will my homeowners drop me?", '¿El seguro lo cubre? || Does insurance cover it?',
  ],
  'add-battery': [
    "We're getting a pool. Can it grow?", "Can I add panels when we build the casita?", "If I buy an EV next year, then what?",
    '¿Puedo poner más paneles después? || Can I put more panels later?',
  ],
  'underproduce': [
    "What if my bill doesn't go down?", "Who checks it's working right?", "What if summer use blows past it?",
    "Do panels lose power every year?", '¿Y si no produce lo suficiente? || And if it does not produce enough?', "What if I use more than you planned?",
  ],
  'affiliated': [
    "Is this the free solar program from TV?", "Are you the electric company?", "Is this an Arizona program?",
    "Why'd you say AZ Power Program? Is that the state?", '¿Usted trabaja para APS? || Do you work for APS?',
  ],
  'roof-eligible': [
    "My roof faces east. Does that work?", "Is a shingle roof okay?", "We've got a two-story. Harder?", "We have foam on the roof. Problem?",
    "Our roof's got a lot of vents. Is that okay?", '¿Mi techo sirve? || Does my roof work?',
  ],
  'end-term': [
    "What if I'm dead before it's paid off?", "Do my kids inherit the payment?", "Does the price go up every year?",
    "Is there an escalator in this?", '¿Qué pasa después de 25 años? || What happens after 25 years?',
  ],
  'monsoon': [
    "Do they rip off in a microburst?", "What if a palm frond hits them?", "Do they get hot enough to start a fire?", "Do they flood the gutters?",
  ],
  'dust': [
    "Do I need to get on the roof?", "Does the dust kill the output?", "Will the birds nest under them?", '¿Hay que limpiarlos? || Do they need cleaning?',
    "Is cleaning included?",
  ],
  'net-metering': [
    "Does APS pay full price for my extra?", "What's the export rate now?", "Do I lose my credits at year end?",
    "Can SRP change the rules on me?", '¿La compañía de luz me paga? || Does the electric company pay me?', "Does it bank power for winter?",
  ],
  'legit': [
    "Why should I trust you?", "Can I call your office right now?", "Why are you knocking and not calling?", "How many homes have you done here?",
    "Can I talk to one of your customers?", '¿Tienen licencia? || Do you have a license?', "Do you guys get paid on commission?",
  ],
  'equipment': [
    "How many panels would I need?", "Which battery brand do you use?", "Are these the black panels?", "Do they look like the ones down the street?",
    "Can I pick the panels?", "What wattage are the panels?",
  ],
  'demand': [
    "Our demand charge is crazy. Can this help?", "Why does SRP charge us for peak?", "We run the AC hard at five. Does that matter?",
    '¿Ayuda con las horas pico? || Does it help with peak hours?',
  ],
  'tax-credit': [
    "Is the credit going away?", "Can I carry the credit over?", "I'm retired. Can I use the credit?", "Who gets the credit, me or you?",
    "Does the state give anything?",
  ],
  'home-install': [
    "Do they need my attic?", "Will they block the driveway?", "Can they work while I'm at work?", "Do I need to move my car?",
    '¿Tengo que estar en la casa? || Do I have to be at home?', "How many guys show up?",
  ],
  'service-area': [
    "Do you go out to Buckeye?", "Do you cover Tucson?", "Do you do Casa Grande?", "Do you service San Tan Valley?", "Is Flagstaff too far?",
    '¿Trabajan en Phoenix? || Do you work in Phoenix?',
  ],
  'support': [
    "Do I deal with you or a call center?", "Will you still be my rep next year?", "How fast do you come out for a problem?",
    '¿Hay alguien que hable español? || Is there someone who speaks Spanish?', "Who pays if monitoring shows a problem?",
  ],
  'see-contract': [
    "How many pages is the contract?", "Can I sign it later online?", "Is everything you said in writing?", "What happens if I cancel?",
    "Is there a penalty to pay it off early?", '¿Me deja una copia? || Will you leave me a copy?',
  ],
  'how-much-save': [
    "What's the total cost?", "Are there hidden fees?", "How long until it pays for itself?", "What's the interest rate?",
    "Does the payment ever go up?", "Is the first payment due right away?", '¿Cuánto es al mes? || How much is it per month?',
    "What's this gonna run me?",
  ],
  'battery-peak': [
    "Does the battery charge from the panels?", "Can the battery save me on peak?", "How many hours of AC from one battery?",
    '¿La batería sirve en la noche? || Does the battery work at night?',
  ],
  'ownership': [
    "Is there a lien on my house?", "Who's on the title?", "Can I pay cash instead?", "Is it financed through a bank?",
    "What's the difference between lease and loan?", '¿Es préstamo? || Is it a loan?',
  ],
};
for (const [k, v] of Object.entries(MORE)) CONCERN_LINES[k] = [...(CONCERN_LINES[k] ?? []), ...v];
