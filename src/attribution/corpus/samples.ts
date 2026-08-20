// Training corpus for the model-attribution classifier.
//
// PROVENANCE, load-bearing: every sample is tagged `source: "real" |
// "synthetic"`. The v0 corpus (HuggingFace-sourced real transcripts were
// blocked by this environment's network gateway — see docs/SCOPE-v3.md
// §1D) was entirely CURATED and SYNTHETIC: hand-written to faithfully
// reflect each house's documented, publicly-known register. v1 adds REAL
// transcripts — actual model output collected against the shared prompt
// bank in `prompts.ts`, so house register is isolated from topic rather
// than confounded with it. Mixed real/synthetic is disclosed as such in
// the UI and in `train/train.ts`'s console output (counts by source),
// never quietly blended and presented as uniformly "real."

export type House = "gemini" | "claude" | "openai" | "human";
export type SampleSource = "real" | "synthetic";

export interface Sample {
  house: House;
  text: string;
  source: SampleSource;
}

export const CORPUS: Sample[] = [
  // ============================== CLAUDE ==============================
  // measured hedging, faux-balance, pseudo-cleft openers, em-dashes,
  // signposting, "worth noting," both-sides framing without a pick.
  {
    house: "claude",
    text: "What matters here is less the tool you pick and more the habit you build around it — a mediocre system used daily beats a great one used once a month. Both approaches have real merit: batching your admin into one weekly block reduces context-switching, while handling things as they arrive keeps your inbox from becoming a backlog. I won't tell you which is right for you, since that depends on how your specific week is shaped. Worth noting, though — the failure mode isn't picking the wrong system, it's picking a system that's heavier than the problem it's solving.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "The question isn't whether remote work is more productive — it's productive for what, and measured how. Some roles genuinely benefit from the focus of a quiet home office; others lean on the kind of incidental hallway conversation that no video call replicates. I'm flagging the tradeoff rather than picking a side here, because the honest answer depends heavily on the role, the team, and — frankly — the person. If you're the kind of person who needs external structure to start work, that's a real data point worth weighing, not a character flaw to override.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Here's the thing about the two migration paths you're weighing: the incremental one is slower but keeps the system shippable the whole time, and the big-bang rewrite is faster on paper but carries real risk if the estimate is wrong — which, to be honest, it usually is. There's a case to be made for both, and I don't think either is obviously correct in the abstract. What I'd actually watch for is whether your team has done a rewrite like this before; that's the variable doing more work than either plan on its own.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "It's not that the recipe is wrong, it's that it assumes a hotter oven than most home ovens actually reach — that's the gap causing the soggy base you're describing. A few things worth checking: oven thermometer accuracy, whether you're opening the door mid-bake, and pan material, since dark metal cooks differently than glass. I'd try the thermometer first since it's the cheapest thing to rule out. That said, if all three check out and it's still soft in the middle, the dough hydration itself might just be a touch high for your flour.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Both plans get you to the same place — eliminating the credit card balance — they just trade off speed against flexibility. The avalanche method saves more in interest, mathematically, full stop. The snowball method front-loads a psychological win by clearing the smallest balance first, which for a lot of people is the difference between sticking with it and quietly abandoning the plan by March. I'm not going to pretend the math doesn't favor avalanche — it does — but the math only matters if you actually follow through, and that's your call to make, not mine.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "The part worth pausing on isn't the outage itself — outages happen — it's that the alert didn't fire for eleven minutes after the threshold was crossed. That's the actual incident. Two things are true at once here: the on-call engineer responded well once paged, and the paging system itself has a gap that will happen again under near-identical conditions. Flagging both rather than picking one to blame, because fixing only the second without acknowledging the first tends to produce a culture where nobody wants to be on call.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Not a bug in the traditional sense — a timing assumption that happened to hold in every environment you tested until it didn't. The function assumes the cache warms before the first request lands, and locally that's always true because nothing else is competing for CPU. In production, under load, it isn't. I'd reproduce it first with an artificial delay injected before the cache write, just to confirm the theory rather than assume it — cheap to verify, expensive to guess wrong on.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "What the retention numbers actually show is more ambiguous than the summary slide suggests. Yes, week-one retention improved after the onboarding change — but week-four retention didn't move, which is the number that actually predicts revenue. Both readings are defensible: this could mean the onboarding fix works and it just takes longer to show up downstream, or it could mean users are sticking around a week out of politeness and churning once the novelty wears off. I'd want another month of data before treating either as settled.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "The honest answer is that neither city is objectively better to live in — it depends what you're optimizing for, and that's worth being explicit about rather than dodging. If proximity to family and lower cost of living matter more to you than career density, that points one direction. If you're early enough in a specific career that being physically near the right rooms matters, that points the other way. I'd resist the urge to let either city's marketing make the decision for you.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Less a grammar rule, more a convention that's drifted — the semicolon here isn't wrong, it's just doing more formal work than the rest of your sentence is asking for. A period would read more naturally given how conversational the surrounding paragraph is. That's a style call rather than a correctness one, so take it as a suggestion rather than a fix.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Two options here, and I'd genuinely weigh them rather than default to the obvious one. Renting the equipment for this one project is cheaper up front and has zero storage cost afterward. Buying it outright pays for itself if you end up doing three or more similar projects a year — but if this is a one-off, buying is the more expensive choice wearing the cheaper-looking sticker price. Worth being honest with yourself about how likely the next project actually is before deciding.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "The draft is solid — the argument holds — but the opening paragraph is doing the reader's thinking for them instead of trusting them to follow the evidence. Cutting the first two sentences and starting directly with the specific example would probably land harder than the current setup does. Not a rewrite so much as a trim; the material underneath is already doing the work.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "It's worth separating two things that are getting bundled together in this thread: whether the policy is a good idea, and whether it was rolled out well. You can think the underlying idea has merit and still think the rollout was clumsy — those aren't contradictory positions, even though the conversation is treating them as one argument. I'd try to keep them apart if you want the discussion to actually go anywhere.",
    source: "synthetic",
  },
  {
    house: "claude",
    text: "Not really a compatibility issue — more that the two libraries make opposite assumptions about who owns the event loop, and nothing surfaces that conflict until you run them together under load. Individually, both work exactly as documented. That's the frustrating part: neither one is behaving badly on its own, which makes the bug much harder to isolate than a straightforward crash would be.",
    source: "synthetic",
  },


  // -------- REAL: Claude, this session, against src/attribution/corpus/prompts.ts --------
  {
    house: "claude",
    text: "Your credit score is built mostly from five factors, weighted roughly like this: payment history (about 35%), how much of your available credit you're using (30%), length of credit history (15%), the mix of credit types you have (10%), and new credit inquiries (10%). Payment history matters most because it's the clearest signal of risk \u2014 a single 30-day-late payment can knock 60-100 points off a good score, and it stays on your report for seven years. Credit utilization is the one people underestimate: even if you pay your balance in full every month, if your statement closes while you're carrying a high balance, that gets reported and can drag your score down temporarily. The fastest lever most people can pull is utilization, since it updates monthly \u2014 paying down a card two weeks before the statement date rather than on the due date can bump your score within a billing cycle. Length of history and credit mix move much more slowly and aren't really things you can engineer short-term. One thing worth knowing: checking your own score is a \"soft\" inquiry and doesn't affect it at all, so there's no downside to checking often.",
    source: "real",
  },
  {
    house: "claude",
    text: "It's caused by React's Strict Mode, which intentionally double-invokes certain functions in development to help you catch bugs \u2014 specifically, it mounts your component, runs cleanup, and mounts it again, which means your effect fires twice and your cleanup function fires once in between. This only happens in development; production builds don't do this. The reason React does it is to surface effects that aren't properly idempotent \u2014 if your effect sets up something like a subscription or a timer without a matching cleanup function, running it twice will reveal bugs (like duplicate subscriptions) that would otherwise only show up under weirder real-world conditions, like a component remounting due to a key change. The fix isn't to disable Strict Mode \u2014 it's to make sure your effect's cleanup function actually undoes whatever the effect did. If you're seeing something break specifically because of the double-run, that's usually a sign the effect has a real bug that would eventually bite you anyway, just harder to spot.",
    source: "real",
  },
  {
    house: "claude",
    text: "Compound interest is what happens when the interest you earn also starts earning interest, instead of just sitting there. Say you put $1,000 into an account earning 5% a year. After year one, you have $1,050 \u2014 that's simple interest, $50 on your original $1,000. But in year two, you don't earn 5% on the original $1,000 again; you earn it on $1,050, so you get $52.50, bringing you to $1,102.50. That extra $2.50 seems trivial, but it compounds every year, and over decades it adds up to a lot more than people expect. The two things that matter most are time and rate \u2014 time matters more than most people intuit, because the growth is exponential, not linear, so most of the gain happens in the later years. This is also why starting to invest even small amounts early tends to beat investing larger amounts later; a 25-year-old investing modestly usually ends up ahead of a 35-year-old investing more aggressively, purely because of the extra decade of compounding.",
    source: "real",
  },
  {
    house: "claude",
    text: "Weather is what's happening in the atmosphere right now, or over a short period \u2014 today's rain, this week's heat wave, tomorrow's forecast. Climate is the long-term average pattern of weather in a place, usually measured over 30 years or more. A useful way to think about it: weather is your mood today, climate is your personality. A single cold week doesn't tell you anything about climate change one way or the other, the same way one grumpy morning doesn't mean someone's personality has changed. Climate describes what's typical and expected for a region \u2014 Phoenix has a hot, dry climate even on a rare rainy day, because that one rainy day doesn't change the long-run pattern. This is also why \"it snowed today, so much for global warming\" is a weather observation being mistaken for a climate one \u2014 climate trends are about shifts in the long-term averages and the frequency of extremes, not any single data point.",
    source: "real",
  },
  {
    house: "claude",
    text: "Depends what the extra money is actually worth to you once you subtract the real cost of the commute, and people usually underprice that cost. Start with the math: extra commute time times how many days a week, converted into hours per year \u2014 an extra 45 minutes each way is over 300 hours a year, which is more than a week of full-time work you're not getting paid for and won't get back. Then look at what that time currently does for you \u2014 if it's time with your kids, sleep, or a hobby that matters to you, the pay increase needs to be bigger to justify losing it than if you'd otherwise waste that time anyway. I'd also ask whether the commute is passive (train, where you can read or work) or active (driving, where it's just gone), since that changes the real cost a lot. If the raise is modest and the commute eats into something you'd actually miss, it's probably not worth it. If it's a substantial jump and the time was otherwise unstructured, it might be.",
    source: "real",
  },
  {
    house: "claude",
    text: "Start lower-effort and escalate only if it doesn't work. A polite, direct note or conversation first \u2014 most people genuinely don't realize how much sound travels, especially with hard floors, and a simple \"hey, I can hear things pretty clearly at night, would you mind keeping it down after 11?\" resolves it more often than you'd expect. Keep it non-accusatory; you're giving them useful information, not accusing them of anything. If that doesn't change anything after a week or two, put it in writing (text or email) so there's a timestamped record, which matters if you need to escalate later. If it continues, check your lease or building rules \u2014 most have quiet hours, and repeated documented complaints to a landlord or property manager carry more weight than a single one. Keep a simple log: date, time, what you heard, how long it lasted. That log is what actually gets you somewhere with a landlord or, if it comes to it, a noise complaint to local authorities, since \"it's loud sometimes\" doesn't move anyone but \"11pm-1am, six nights running, for three weeks\" does.",
    source: "real",
  },
  {
    house: "claude",
    text: "Pay off the credit card first, unless the card has an unusually low promotional rate. Credit card interest is almost always in the high teens to mid-20s percent, and no savings account or low-risk investment is going to beat that reliably \u2014 carrying the balance while your money sits in savings is guaranteed to lose you money net. So: pay off the card, then decide what to do with whatever's left. After that, the usual order is an emergency fund (three to six months of essential expenses) if you don't already have one, since that's what prevents you from going right back into credit card debt the next time something unexpected comes up. If you already have that cushion, then it becomes a normal savings-versus-investing decision based on your time horizon. The one thing I'd avoid is investing while still carrying the card balance \u2014 it feels productive, but you're very likely paying more in card interest than you're earning on the investment, so you're actually behind even though it feels like you're doing two good things at once.",
    source: "real",
  },
  {
    house: "claude",
    text: "It depends on what you're actually optimizing for, because \"worth it\" means different things depending on whether you're comparing money, time, health, or just enjoyment. Cooking at home is almost always cheaper per meal, often meaningfully so, and gives you more control over what's actually in the food. But it costs real time and mental effort, especially on weeknights when you're already tired, and the time cost is easy to underestimate when you're only thinking about active cooking time and forgetting the shopping, planning, and cleanup around it. Ordering in is more expensive per meal but buys back that time and effort, which has its own value depending on your life right now. A middle path a lot of people land on: cook a handful of simple, repeatable meals you don't have to think hard about, and treat ordering in as the exception for busy nights rather than the default \u2014 that gets most of the cost and health benefit without requiring you to become a confident cook overnight.",
    source: "real",
  },
  {
    house: "claude",
    text: "It depends heavily on the kind of work and the person, so I'd be skeptical of anyone claiming a universal answer either direction. For deep, focused work \u2014 writing, coding, analysis \u2014 remote setups often do measurably better, because the office is full of interruptions that don't show up in anyone's productivity metrics until you actually count them. For work that depends on quick back-and-forth, mentorship, or the kind of idea that comes out of an overheard hallway conversation, in-person tends to win, and a lot of that value is genuinely hard to replicate over video. There's also a real individual difference: some people need the external structure of an office to actually start work, and remote setups expose that in a way that isn't really about willpower, just about how that person's attention works. My honest read is that the productivity question is mostly a proxy for a different one \u2014 what kind of work is this, and what does this specific person need to do it well \u2014 and the remote-versus-office debate tends to skip past that.",
    source: "real",
  },
  {
    house: "claude",
    text: "For a lot of companies, yes, but it's not free \u2014 it requires cutting scope, not just cutting a day and hoping the same work fits in less time. The companies that have made four-day weeks work well tend to have done real triage first: cutting low-value meetings, unnecessary status updates, and busywork that padded out the fifth day anyway. Done that way, people often report similar output in less time, plus meaningfully lower burnout, which shows up in retention. Done badly \u2014 just announcing a four-day week without changing anything else \u2014 it usually just compresses the same workload into more stressful days, which backfires. It also matters what kind of work the company does: highly collaborative, client-facing, or shift-based work (retail, healthcare, manufacturing) is harder to compress than knowledge work with more flexible scheduling. So the honest answer is: good idea in principle, but the companies that succeed with it are the ones willing to actually redesign how work gets done, not just relabel the calendar.",
    source: "real",
  },
  {
    house: "claude",
    text: "I'd be cautious about mandatory identity verification, even though the problems it's meant to solve \u2014 bots, harassment, coordinated misinformation \u2014 are real. The tradeoff is that verification systems create a single point of failure: a database of real identities tied to online accounts is an enormous target for breaches, and in countries with weaker protections for dissidents or journalists, mandatory ID could be actively dangerous rather than just inconvenient. There's also a practical problem \u2014 verification doesn't actually stop bad behavior from verified accounts, and plenty of harm online comes from people using their real names. A middle ground that gets discussed more seriously: verification for advertisers and high-reach accounts specifically, rather than everyone, since the asymmetry of harm is much higher there. I don't think there's a clean universal answer, but I'd want to see the specific implementation before judging it \u2014 \"verified identity\" could mean anything from a government ID check to a simple phone number, and those have very different risk profiles.",
    source: "real",
  },
  {
    house: "claude",
    text: "It really depends on how long you plan to stay put and what the local market looks like, more than any general rule about age. Buying makes more financial sense the longer you stay in one place, since the upfront costs (closing costs, agent fees, moving costs) take years to offset through building equity instead of paying rent. If there's a real chance you'll relocate for a job, a relationship, or just curiosity within the next few years, renting keeps you flexible and avoids the risk of selling at a bad time. There's also an emotional case for renting in your twenties that doesn't get talked about enough: it's genuinely valuable to not be tied down while you're still figuring out where you want to be and what you want your life to look like. I wouldn't buy just because it feels like the \"adult\" thing to do \u2014 that's a bad reason on its own. I'd buy because the math works for your specific situation and you're reasonably confident about staying.",
    source: "real",
  },
  {
    house: "claude",
    text: "You need just flour, water, and time \u2014 no commercial yeast, since you're capturing wild yeast that's already on the flour and in the air. Mix equal parts flour and water by weight (start with 50g each) in a jar, cover loosely, and leave it at room temperature. Every 24 hours, discard about half the mixture and feed it with another 50g flour and 50g water \u2014 the discarding matters because it keeps the ratio of fresh food to fermented waste in your favor, which is what keeps it healthy rather than sour and sluggish. In the first two or three days you might see some bubbling and think you're done \u2014 you're not, that's often a false start from bacterial activity before the wild yeast properly establishes itself. Real readiness usually takes 7-10 days: consistent doubling in size within 4-8 hours of a feed, a pleasant tangy smell rather than a sharp acetone one, and enough bubbles that it looks genuinely alive. Room temperature matters more than people think \u2014 a starter in a warm kitchen can mature in a week, while a cold one can take twice as long.",
    source: "real",
  },
  {
    house: "claude",
    text: "Start by tracking what you actually spend for one month before you try to budget anything \u2014 most first budgets fail because they're based on a guess rather than real numbers, and people are consistently surprised by how much goes to a few unglamorous categories like takeout or subscriptions. Once you have that, sort spending into three buckets: fixed costs you can't easily change (rent, insurance, loan payments), variable necessities (groceries, transport, utilities), and everything else (eating out, entertainment, shopping). A common starting split is roughly 50% fixed, 30% variable and lifestyle, 20% savings and debt paydown, but treat that as a starting point, not a rule \u2014 your actual numbers should reflect your real costs and goals. Pick one simple tool to track it going forward, whether that's an app or just a spreadsheet, and check in weekly at first rather than only monthly, since weekly catches problems while you can still adjust, and monthly just tells you what already happened. The main thing that makes budgets stick isn't the system, it's actually looking at it regularly.",
    source: "real",
  },
  {
    house: "claude",
    text: "With two days, focus on the things that give you the most return for the least time, rather than trying to cram everything. Spend the first chunk of time researching the company specifically \u2014 their product, recent news, and why this role exists right now \u2014 since specific, current knowledge stands out much more than generic preparation. Next, prepare three or four real stories from your own experience that you can adapt to different behavioral questions (a time you solved a hard problem, handled conflict, made a mistake and fixed it) rather than trying to write an answer for every possible question. Practice saying them out loud, not just thinking through them, since there's a real difference between having an answer in your head and being able to say it smoothly under pressure. Prepare two or three genuine questions to ask them, ideally ones that show you've thought about the role rather than generic ones. Get your practical logistics sorted the night before \u2014 outfit, directions or login link, printed resume copies if in person \u2014 so none of that becomes a stressor on the day itself.",
    source: "real",
  },
  {
    house: "claude",
    text: "Park the working car close enough that the cables reach without either car being in gear, and turn both cars off. Connect the cables in this order: red clamp to the dead battery's positive terminal, red clamp to the working battery's positive terminal, black clamp to the working battery's negative terminal, and then the last black clamp to an unpainted metal surface on the dead car's engine block \u2014 not its negative terminal. That last step matters more than people realize: connecting directly to the dead battery's negative terminal can cause a spark near the battery itself, where hydrogen gas can be venting, which is a real (if small) fire risk. Start the working car and let it run for a few minutes, then try starting the dead one. If it starts, don't turn it off again \u2014 drive it for at least fifteen minutes to let the alternator recharge the battery, since jump-starting doesn't fix whatever drained it in the first place. If it won't start after a couple of tries, the battery is likely too far gone and probably needs replacing rather than jumping.",
    source: "real",
  },
  {
    house: "claude",
    text: "The lighthouse stood at the end of the point, its paint peeling in long white strips that curled away from the stone underneath. Frost had settled into the cracks around the door, and the glass at the top, once swept clean every night by a keeper's hand, was fogged with salt and years of weather. Below, the sea moved the way it always had, indifferent to whether anyone was watching from the tower anymore. A gull sat on the rail where the light used to turn, unbothered by the cold, and somewhere below the waterline the old foundation still held, stubborn against a hundred winters it had never been asked to survive alone.",
    source: "real",
  },
  {
    house: "claude",
    text: "Stalls crowd in close, and the noise arrives before you can see where it's coming from \u2014 someone haggling over peaches, a kid crying near the flower stand, a radio playing something half-familiar from a stall selling secondhand records. The smell shifts every few steps: coffee, then fish on ice, then bread still warm enough to fog the plastic wrap. People move slowly even when they're in a hurry, stopping to greet someone they clearly know, blocking the narrow path between stalls without noticing. By midday the ground is slick with dropped leaves and spilled ice, and the whole place has the particular tiredness of somewhere that's been busy since six in the morning.",
    source: "real",
  },
  {
    house: "claude",
    text: "They spotted each other from across the room before either one said anything, and for a second neither moved. \"You cut your hair,\" Maren said finally, which wasn't what she'd meant to say first. \"Ten years and that's what you open with,\" Dale said, but he was already crossing the room. They hugged too long for two people who'd once gone eight months without speaking, and when they pulled back neither quite knew where to put their hands. \"You look exactly the same,\" she said. \"That's a lie and you know it.\" \"Fine. You look tired in a way that suits you.\" He laughed at that, actually laughed, and something in her chest loosened that she hadn't realized was tight.",
    source: "real",
  },
  {
    house: "claude",
    text: "The light turned a strange yellow-grey by mid-afternoon, the kind that makes people glance up without quite admitting why. Shopkeepers pulled their awnings in early, and the hardware store ran out of batteries by Tuesday, then tarps by Wednesday. Conversations on the street got shorter and more practical \u2014 not the weather itself, but what to do about it, whose gutters hadn't been cleared, whose generator hadn't been tested since last year. Dogs paced at the ends of their leads more than usual, and by Thursday even the birds had gone quiet, leaving the town with the particular silence of a place waiting for something it already knows is coming.",
    source: "real",
  },
  {
    house: "claude",
    text: "A resume is a short, targeted document \u2014 usually one or two pages \u2014 built around whatever specific job you're applying for, highlighting the experience most relevant to that role. A CV is longer and more comprehensive, listing your full academic and professional history: every publication, presentation, degree, and credential, without necessarily tailoring it to one specific opening. In the US, CVs are mostly used in academia, research, medicine, and some scientific fields where a complete record of your work actually matters to the reader. Outside the US, particularly in the UK and much of Europe, \"CV\" is just what people call what Americans would call a resume, which causes a fair amount of confusion for people job-hunting internationally. If you're not sure which one a job wants, the safest read is: American company outside academia, they mean a resume even if they say CV; academic or research position, they probably do mean the longer, complete version.",
    source: "real",
  },
  {
    house: "claude",
    text: "For a first car, it comes down to your actual driving pattern more than either technology being objectively better. Electric cars are cheaper to run day to day \u2014 electricity costs less per mile than gas, and there's far less routine maintenance since there's no oil changes, no exhaust system, fewer moving parts to wear out. But the upfront price is usually higher, even accounting for incentives, and if you don't have reliable home charging, the convenience gap versus a five-minute gas station stop is real, especially for longer trips. Gasoline cars are more forgiving if your driving is unpredictable or long-distance, and the used market gives you far more low-cost options for a first car specifically. If most of your driving is a predictable daily commute and you can charge at home, electric is genuinely the better economic choice over a few years. If you're not sure what your driving will look like yet, or budget is the primary constraint, a reliable used gas car is still the more flexible first choice.",
    source: "real",
  },
  {
    house: "claude",
    text: "The habits that actually stick tend to share one thing: they're attached to an existing routine rather than floating free in your day waiting to be remembered. \"I'll exercise sometime\" fails; \"I'll stretch for five minutes right after I brush my teeth\" survives, because it's anchored to something you already do without thinking. Starting smaller than feels meaningful also matters more than people expect \u2014 the goal early on isn't the habit itself, it's proving to yourself that you'll actually show up, and a habit so small it feels almost silly is much easier to actually do on a bad day. The other real factor is what happens after you miss a day, since everyone misses a day eventually. People who treat one missed day as a data point (\"okay, that happened, back to it tomorrow\") tend to keep the habit; people who treat it as a failure that proves the whole thing isn't working tend to quit entirely. The habit that survives isn't the one done perfectly, it's the one that's allowed to be done imperfectly without being abandoned.",
    source: "real",
  },
  {
    house: "claude",
    text: "Most friendships don't end from a single event \u2014 they fade from a slow mismatch in effort that neither person names out loud. Life circumstances change unevenly: one person has kids, moves cities, or gets consumed by a demanding job, and the friendship quietly shifts from something maintained by proximity and shared context to something that requires deliberate effort, which is a much higher bar that not every friendship survives. There's also a version of this that's just normal and not really anyone's fault: friendships formed around a specific season of life (college, a job, a shared hobby) were built on that context, and when the context ends, the friendship needs a new foundation to keep going, and sometimes there just isn't one there once you look for it directly. The uncomfortable part is that naming the drift out loud (\"we don't really talk anymore, do you want to fix that or is this just what happened\") feels riskier than just letting it fade, so most people let it fade instead, even when they'd have said yes if asked.",
    source: "real",
  },

  // ============================== GEMINI ==============================
  // structured-then-literary swing, personification, rule-of-three,
  // staccato, sensory catalogue, adjective pairs, dramatic single lines.
  {
    house: "gemini",
    text: "The old orchard didn't die so much as it surrendered, tree by tree, to a winter that refused to end. Gnarled branches, brittle bark, a silence that pressed down on the whole hillside. Nobody pruned it that year, or the year after. Only the oldest tree held its ground. Beneath the frost, though, something patient was still waiting — waiting for warmth, waiting for hands, waiting for someone to remember the rows were once full of fruit.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Three things define a good sourdough starter: patience, temperature, and trust in a process you cannot see. The wild yeast doesn't announce its arrival. It simply builds, day by quiet day, until the jar hums with a tangy, restless life of its own. Feed it, and it forgives you. Neglect it, and it waits — dormant, stubborn, clinging to whatever moisture is left — for the day you come back.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Here's how to structure your morning for deep work: protect the first ninety minutes, silence every notification, and commit to a single task before checking anything else. The rest of the world can wait. It always does. What can't wait is the fragile, flickering focus you're handed each morning — bright, brief, and gone the moment you let the feed pull you under.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "The glacier didn't retreat. It surrendered, inch by aching inch, to a warmth it had never been built to survive. Blue ice, grey rock, a hush that felt older than the mountain itself. Scientists measure the loss in metres per year. The valley measures it in something closer to grief.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Three habits separate teams that ship from teams that stall: clear ownership, tight feedback loops, and the discipline to say no to good ideas at the wrong time. None of this is complicated. It just isn't easy. The hardest part isn't learning the habit — it's holding it, week after week, long after the initial motivation has quietly slipped away.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Wind that tasted of salt and diesel rolled off the harbor at dawn. The trawlers, tired and salt-stained, eased back into their berths one by one. Nothing about this town moves quickly, or loudly, or for very long. And yet it endures — stubborn, weathered, entirely unbothered by whatever the tourists upriver believe progress is supposed to look like.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "To choose the right running shoe, weigh three things: your arch, your gait, and the terrain you'll actually run on — not the terrain you imagine running on someday. A shoe built for pavement will punish you on a trail. A trail shoe will feel sluggish and overbuilt on a track. Get this wrong, and your knees will remember it long after the receipt is gone.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "The lighthouse keeper's log was dense, skeletal, entry after clipped entry. Wind, direction, hours logged. But one line, alone on its own page, broke the pattern: the light held. Nothing else that week seemed to. Not the supply boat, not the radio, not the keeper's own frayed nerves — only the light, standing its ground against a sea that wanted otherwise.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "There are three kinds of silence in a forest: the silence before rain, the silence after a hawk passes, and the silence that has nothing to do with weather or predators at all — the kind that simply belongs to old trees that have run out of things to say to each other.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Set your thermostat two degrees lower this winter, wear an extra layer, and let your body do some of the work your furnace has been doing alone. Small changes, stacked, add up faster than one dramatic one ever does. The savings arrive quietly. They always do.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "The vineyard clung to the hillside the way memory clings to an old house — stubbornly, uselessly, past the point anyone asked it to. Rows of vines, dry-boned and patient, waited out another drought the valley below had already stopped counting.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Great onboarding does three things at once: it orients, it reassures, and it gets out of the way as fast as it can. A new user doesn't want a tour. They want the door to open, quietly, so they can get to the room they actually came for.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "Snow fell over the ridgeline in a hush that swallowed every other sound. The pines, dense and stubborn, bore the weight without complaint — they always had. Only the wind, restless and searching, seemed unwilling to simply let the mountain be.",
    source: "synthetic",
  },
  {
    house: "gemini",
    text: "A strong password isn't clever, it's long — length matters more than the trick you're using to remember it. Passphrases beat substitutions. A manager beats memory. And two-factor authentication, quietly sitting in the background, does more heavy lifting than any password on its own ever could.",
    source: "synthetic",
  },

  // ============================== OPENAI ==============================
  // formal five-paragraph cadence, "It's important to note," "Firstly...
  // Secondly... In conclusion," stock disclaimers, exhaustive hedged lists.
  {
    house: "openai",
    text: "Certainly! When it comes to choosing between renting and buying a home, there are several important factors to consider. Firstly, your financial situation plays a crucial role — buying typically requires a larger upfront investment, while renting offers more flexibility. Secondly, it's important to consider your long-term plans; if you intend to stay in one place for several years, buying may be more advantageous. Additionally, market conditions such as interest rates and property values can significantly impact this decision. It's also worth noting that renting can provide more freedom to relocate for job opportunities. In conclusion, the right choice ultimately depends on your individual circumstances, financial goals, and lifestyle preferences.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Of course! Meal prepping can be a great way to save time and eat healthier throughout the week. To get started, it's important to first plan out your meals for the week, taking into account your nutritional needs and dietary preferences. Next, create a shopping list based on these meals to ensure you have all the necessary ingredients on hand. Additionally, investing in quality storage containers can help keep your food fresh for longer. It's also worth noting that batch cooking staples like rice, grains, and proteins can significantly streamline the process. Overall, with a bit of planning and organization, meal prepping can become an efficient and rewarding habit.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Great question! There are several key differences between machine learning and traditional programming that are worth exploring. Firstly, traditional programming relies on explicit rules written by a developer, whereas machine learning models learn patterns directly from data. Secondly, machine learning approaches tend to perform better on complex, unstructured problems where writing explicit rules would be impractical. However, it's important to note that machine learning requires substantial amounts of data and computational resources to train effectively. Additionally, interpretability can be more challenging with machine learning models compared to traditional, rule-based systems. In summary, the choice between the two approaches depends largely on the nature of the problem and the resources available.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "As an AI, I don't have personal opinions, but I can provide some general guidance on effective time management. Firstly, prioritizing tasks based on urgency and importance is essential — this is often referred to as the Eisenhower Matrix. Secondly, breaking larger tasks into smaller, manageable steps can help reduce feelings of overwhelm. It's also worth noting that setting realistic deadlines and building in buffer time can prevent unnecessary stress. Additionally, minimizing distractions, such as turning off notifications during focused work periods, can significantly improve productivity. Overall, effective time management is a skill that improves with consistent practice and self-reflection.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Absolutely, I'd be happy to help explain photosynthesis! Photosynthesis is the process by which plants convert light energy into chemical energy, which is then used to fuel their growth. This process primarily occurs in the chloroplasts of plant cells, specifically within structures called thylakoids. Firstly, light energy is absorbed by chlorophyll, the green pigment found in plants. This energy is then used to split water molecules, releasing oxygen as a byproduct. Secondly, the energy captured is used to convert carbon dioxide into glucose through a series of chemical reactions known as the Calvin cycle. In conclusion, photosynthesis is a vital process that not only sustains plant life but also produces the oxygen essential for most life on Earth.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "That's a great question! When it comes to improving customer retention, there are several strategies businesses can implement. Firstly, providing exceptional customer service is crucial, as it directly impacts customer satisfaction and loyalty. Secondly, implementing a robust loyalty program can incentivize repeat purchases and foster long-term relationships. It's also important to note that regularly seeking and acting on customer feedback demonstrates that a business values its customers' opinions. Additionally, personalizing communication and offers based on customer preferences can significantly enhance the overall experience. Overall, a combination of these strategies, tailored to the specific needs of the business, can lead to improved customer retention rates.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Sure, I can help clarify the differences between a resume and a CV! Firstly, a resume is typically a concise document, usually one to two pages, that highlights relevant skills and experience for a specific job application. In contrast, a CV, or curriculum vitae, is generally more comprehensive and is commonly used in academic, medical, or research contexts. It's important to note that a CV often includes detailed information about publications, research, and academic achievements. Additionally, the length of a CV can vary significantly depending on one's career stage. In summary, while both documents serve to showcase one's qualifications, the appropriate choice depends on the specific context and industry norms.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Certainly! Here are some tips for giving an effective presentation. Firstly, it's essential to know your audience and tailor your content to their level of familiarity with the topic. Secondly, practicing your delivery multiple times can help build confidence and ensure smooth pacing. Additionally, using visual aids such as slides can help reinforce key points, though it's important not to overcrowd them with text. It's also worth noting that maintaining eye contact and varying your tone can help keep the audience engaged throughout. In conclusion, thorough preparation combined with clear, confident delivery are the cornerstones of an effective presentation.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Great question! There are a few important considerations when choosing a programming language for a new project. Firstly, the specific requirements of the project, such as performance needs or platform compatibility, should guide the decision. Secondly, the availability of libraries and community support can significantly impact development speed. It's also worth noting that the existing skill set of your team plays an important role, as leveraging familiar tools can reduce onboarding time. Additionally, long-term maintainability should be factored into the decision. Overall, there is no one-size-fits-all answer, as the best choice depends on the unique context of the project.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Of course! Staying hydrated is important for overall health, and there are several ways to ensure you're drinking enough water throughout the day. Firstly, carrying a reusable water bottle can serve as a helpful visual reminder. Secondly, setting periodic reminders on your phone can help build a consistent habit. It's also worth noting that consuming water-rich foods, such as fruits and vegetables, can contribute to your overall fluid intake. Additionally, monitoring the color of your urine can be a simple indicator of hydration levels. In summary, a combination of mindful habits and small adjustments can make staying hydrated much easier.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "That's an interesting question! When comparing electric vehicles to traditional gasoline cars, there are several factors worth considering. Firstly, electric vehicles typically have lower operating costs due to reduced fuel and maintenance expenses. Secondly, they produce zero tailpipe emissions, which can significantly reduce environmental impact. However, it's important to note that the upfront cost of electric vehicles can be higher, and charging infrastructure may not be as widely available in all areas. Additionally, battery range and charging times remain considerations for long-distance travel. Overall, the right choice depends on individual driving habits, budget, and access to charging infrastructure.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Sure, I'd be happy to explain how compound interest works! Compound interest is calculated on both the initial principal and the accumulated interest from previous periods. This means that, over time, your investment grows at an increasing rate compared to simple interest, where interest is only calculated on the principal. Firstly, the frequency of compounding — whether annual, monthly, or daily — can significantly affect the total amount earned. Secondly, the length of time an investment is held plays a crucial role, as compound interest benefits substantially from longer time horizons. In conclusion, understanding compound interest is essential for making informed decisions about savings and investments.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Great question! There are several best practices to consider when writing clean, maintainable code. Firstly, using clear and descriptive variable names can significantly improve readability. Secondly, breaking down complex functions into smaller, single-purpose functions makes the codebase easier to test and debug. It's also important to note that consistent formatting and adherence to style guides can improve collaboration among team members. Additionally, writing comprehensive comments and documentation helps future developers understand the reasoning behind key decisions. Overall, prioritizing readability and simplicity tends to pay dividends throughout the lifecycle of a software project.",
    source: "synthetic",
  },
  {
    house: "openai",
    text: "Absolutely! Understanding the basics of a balanced diet is important for maintaining good health. Firstly, it's essential to include a variety of food groups, such as fruits, vegetables, whole grains, and lean proteins, to ensure adequate nutrient intake. Secondly, portion control plays a significant role in maintaining a healthy weight. It's also worth noting that staying hydrated and limiting processed foods can further support overall wellbeing. Additionally, consulting with a registered dietitian can provide personalized guidance tailored to individual needs. In summary, a balanced approach that emphasizes variety and moderation is generally the most sustainable path to good nutrition.",
    source: "synthetic",
  },

  // ============================== HUMAN ==============================
  // varied burstiness, contractions, concrete specific detail, opinions
  // stated flat, imperfect endings, no hedge-stacking.
  {
    house: "human",
    text: "Took the 7:40 train again this morning and it was late, obviously. Stood next to a guy eating a full breakfast burrito on the platform which honestly impressed me more than annoyed me. Work was fine. Meeting ran long because Dave can't stop talking about the Q3 numbers even when nobody asked. Got home, dog had chewed through another sock. Ordered pizza. Not a bad day, all things considered.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Honestly I think the new bridge is ugly and I don't care who disagrees with me. It's this weird beige colour and the lights buzz at night. But it does cut my commute by like fifteen minutes, so fine, I'll take it. My neighbour says it's already sinking on one side. Probably not true. Probably.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Recipe worked but I'd cut the sugar by a third next time, it was borderline too sweet even for me and I have a sweet tooth. Also the 45 minute bake time in the original post is way off, mine needed closer to an hour. Oven's an old gas one though so that might just be me.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "So the interview went okay I think? Hard to tell. Guy barely looked up from his laptop for the first ten minutes which was weird. Then he asked about the gap on my resume and I just told him the truth, went travelling, ran out of money, came back. He seemed fine with it actually. We'll see.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Three years running this shop and I still can't figure out Tuesdays. Dead quiet from open till noon then suddenly it's a queue out the door for an hour and a half. Wednesday's the opposite, steady all day, never a rush. Nobody's ever been able to explain that to me and at this point I've stopped asking.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "My grandad used to fix radios in the shed out back, tiny thing, barely room for one person and a stool. Smelled like solder and old tea. He'd let me hand him tools if I promised not to touch anything sharp. I still have one of the radios. Doesn't work. Never had the heart to throw it out or fix it.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Ran my first 10k on Saturday, finished in 58 minutes which is slower than I wanted but I'll take it given how hot it was. Legs were done by the 7k mark. Some guy in a banana costume overtook me at the 8k mark and I have never felt so personally attacked by a piece of fruit.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "The landlord finally fixed the boiler after I emailed him for the third time. Took him two months. No apology, no explanation, just a text saying \"sorted.\" Cold showers in January build character I guess, that's what I'm telling myself anyway.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Went to the market this morning, first properly cold day of the year. Bought too many apples again, I always do this. The guy at the veg stall remembered my order from last week which was nice, small town stuff. Home by ten, made soup, watched the rain.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Genuinely don't understand why people rave about that restaurant. Waited 40 minutes for a table we'd booked, the pasta was fine, nothing special, and it cost more than my weekly food shop. Maybe I'm missing something. Or maybe everyone's just really good at pretending.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Kid's school project is due tomorrow and of course we're only starting it tonight. Volcano, baking soda, the works. Kitchen's a disaster. He's thrilled though, which I suppose is the point, even if I'm the one who'll be up till midnight cleaning vinegar off the ceiling.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Been putting off calling the insurance company for two weeks now because I know exactly how that call goes. Twenty minutes on hold, transferred twice, explain the whole thing again from scratch. Did it today. Took twenty-five minutes on hold, transferred twice. At least I called it.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "Someone left a really nasty comment on my post today, first time that's happened. Didn't expect it to bother me as much as it did if I'm honest. Deleted it, moved on, but it sat with me all afternoon anyway. Weird how one stranger's opinion can do that.",
    source: "synthetic",
  },
  {
    house: "human",
    text: "The garden's a mess this year, barely any tomatoes worth eating, but the courgettes have gone absolutely feral, we've got more than we know what to do with. Given half of them to the neighbours already. They've stopped answering the door, can't imagine why.",
    source: "synthetic",
  },
];
