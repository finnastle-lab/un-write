// v0 training corpus for the model-attribution classifier.
//
// HONESTY NOTE, load-bearing: real, scraped multi-model transcripts (e.g.
// LMSYS Chatbot Arena conversations, which label responses by model) were
// the first choice, but HuggingFace is blocked at this environment's
// network gateway (403 on huggingface.co and datasets-server.huggingface.co)
// — see docs/SCOPE-v3.md §1D. This corpus is instead CURATED and SYNTHETIC:
// samples hand-written to faithfully reflect each house's documented,
// publicly-known register (the uploaded "Structural Fingerprints" research,
// plus widely observed per-model habits — Claude's measured hedging and
// faux-balance, Gemini's structured-then-literary swing, GPT's formal
// five-paragraph-essay cadence and stock disclaimers). It is a real
// limitation, disclosed in the UI as "v0, trained on a curated sample set,"
// not a hidden one. The trainer and feature pipeline are built so swapping
// in real transcripts later is a data change, not a code change.

export type House = "gemini" | "claude" | "openai" | "human";

export interface Sample {
  house: House;
  text: string;
}

export const CORPUS: Sample[] = [
  // ============================== CLAUDE ==============================
  // measured hedging, faux-balance, pseudo-cleft openers, em-dashes,
  // signposting, "worth noting," both-sides framing without a pick.
  {
    house: "claude",
    text: "What matters here is less the tool you pick and more the habit you build around it — a mediocre system used daily beats a great one used once a month. Both approaches have real merit: batching your admin into one weekly block reduces context-switching, while handling things as they arrive keeps your inbox from becoming a backlog. I won't tell you which is right for you, since that depends on how your specific week is shaped. Worth noting, though — the failure mode isn't picking the wrong system, it's picking a system that's heavier than the problem it's solving.",
  },
  {
    house: "claude",
    text: "The question isn't whether remote work is more productive — it's productive for what, and measured how. Some roles genuinely benefit from the focus of a quiet home office; others lean on the kind of incidental hallway conversation that no video call replicates. I'm flagging the tradeoff rather than picking a side here, because the honest answer depends heavily on the role, the team, and — frankly — the person. If you're the kind of person who needs external structure to start work, that's a real data point worth weighing, not a character flaw to override.",
  },
  {
    house: "claude",
    text: "Here's the thing about the two migration paths you're weighing: the incremental one is slower but keeps the system shippable the whole time, and the big-bang rewrite is faster on paper but carries real risk if the estimate is wrong — which, to be honest, it usually is. There's a case to be made for both, and I don't think either is obviously correct in the abstract. What I'd actually watch for is whether your team has done a rewrite like this before; that's the variable doing more work than either plan on its own.",
  },
  {
    house: "claude",
    text: "It's not that the recipe is wrong, it's that it assumes a hotter oven than most home ovens actually reach — that's the gap causing the soggy base you're describing. A few things worth checking: oven thermometer accuracy, whether you're opening the door mid-bake, and pan material, since dark metal cooks differently than glass. I'd try the thermometer first since it's the cheapest thing to rule out. That said, if all three check out and it's still soft in the middle, the dough hydration itself might just be a touch high for your flour.",
  },
  {
    house: "claude",
    text: "Both plans get you to the same place — eliminating the credit card balance — they just trade off speed against flexibility. The avalanche method saves more in interest, mathematically, full stop. The snowball method front-loads a psychological win by clearing the smallest balance first, which for a lot of people is the difference between sticking with it and quietly abandoning the plan by March. I'm not going to pretend the math doesn't favor avalanche — it does — but the math only matters if you actually follow through, and that's your call to make, not mine.",
  },
  {
    house: "claude",
    text: "The part worth pausing on isn't the outage itself — outages happen — it's that the alert didn't fire for eleven minutes after the threshold was crossed. That's the actual incident. Two things are true at once here: the on-call engineer responded well once paged, and the paging system itself has a gap that will happen again under near-identical conditions. Flagging both rather than picking one to blame, because fixing only the second without acknowledging the first tends to produce a culture where nobody wants to be on call.",
  },
  {
    house: "claude",
    text: "Not a bug in the traditional sense — a timing assumption that happened to hold in every environment you tested until it didn't. The function assumes the cache warms before the first request lands, and locally that's always true because nothing else is competing for CPU. In production, under load, it isn't. I'd reproduce it first with an artificial delay injected before the cache write, just to confirm the theory rather than assume it — cheap to verify, expensive to guess wrong on.",
  },
  {
    house: "claude",
    text: "What the retention numbers actually show is more ambiguous than the summary slide suggests. Yes, week-one retention improved after the onboarding change — but week-four retention didn't move, which is the number that actually predicts revenue. Both readings are defensible: this could mean the onboarding fix works and it just takes longer to show up downstream, or it could mean users are sticking around a week out of politeness and churning once the novelty wears off. I'd want another month of data before treating either as settled.",
  },
  {
    house: "claude",
    text: "The honest answer is that neither city is objectively better to live in — it depends what you're optimizing for, and that's worth being explicit about rather than dodging. If proximity to family and lower cost of living matter more to you than career density, that points one direction. If you're early enough in a specific career that being physically near the right rooms matters, that points the other way. I'd resist the urge to let either city's marketing make the decision for you.",
  },
  {
    house: "claude",
    text: "Less a grammar rule, more a convention that's drifted — the semicolon here isn't wrong, it's just doing more formal work than the rest of your sentence is asking for. A period would read more naturally given how conversational the surrounding paragraph is. That's a style call rather than a correctness one, so take it as a suggestion rather than a fix.",
  },
  {
    house: "claude",
    text: "Two options here, and I'd genuinely weigh them rather than default to the obvious one. Renting the equipment for this one project is cheaper up front and has zero storage cost afterward. Buying it outright pays for itself if you end up doing three or more similar projects a year — but if this is a one-off, buying is the more expensive choice wearing the cheaper-looking sticker price. Worth being honest with yourself about how likely the next project actually is before deciding.",
  },
  {
    house: "claude",
    text: "The draft is solid — the argument holds — but the opening paragraph is doing the reader's thinking for them instead of trusting them to follow the evidence. Cutting the first two sentences and starting directly with the specific example would probably land harder than the current setup does. Not a rewrite so much as a trim; the material underneath is already doing the work.",
  },
  {
    house: "claude",
    text: "It's worth separating two things that are getting bundled together in this thread: whether the policy is a good idea, and whether it was rolled out well. You can think the underlying idea has merit and still think the rollout was clumsy — those aren't contradictory positions, even though the conversation is treating them as one argument. I'd try to keep them apart if you want the discussion to actually go anywhere.",
  },
  {
    house: "claude",
    text: "Not really a compatibility issue — more that the two libraries make opposite assumptions about who owns the event loop, and nothing surfaces that conflict until you run them together under load. Individually, both work exactly as documented. That's the frustrating part: neither one is behaving badly on its own, which makes the bug much harder to isolate than a straightforward crash would be.",
  },

  // ============================== GEMINI ==============================
  // structured-then-literary swing, personification, rule-of-three,
  // staccato, sensory catalogue, adjective pairs, dramatic single lines.
  {
    house: "gemini",
    text: "The old orchard didn't die so much as it surrendered, tree by tree, to a winter that refused to end. Gnarled branches, brittle bark, a silence that pressed down on the whole hillside. Nobody pruned it that year, or the year after. Only the oldest tree held its ground. Beneath the frost, though, something patient was still waiting — waiting for warmth, waiting for hands, waiting for someone to remember the rows were once full of fruit.",
  },
  {
    house: "gemini",
    text: "Three things define a good sourdough starter: patience, temperature, and trust in a process you cannot see. The wild yeast doesn't announce its arrival. It simply builds, day by quiet day, until the jar hums with a tangy, restless life of its own. Feed it, and it forgives you. Neglect it, and it waits — dormant, stubborn, clinging to whatever moisture is left — for the day you come back.",
  },
  {
    house: "gemini",
    text: "Here's how to structure your morning for deep work: protect the first ninety minutes, silence every notification, and commit to a single task before checking anything else. The rest of the world can wait. It always does. What can't wait is the fragile, flickering focus you're handed each morning — bright, brief, and gone the moment you let the feed pull you under.",
  },
  {
    house: "gemini",
    text: "The glacier didn't retreat. It surrendered, inch by aching inch, to a warmth it had never been built to survive. Blue ice, grey rock, a hush that felt older than the mountain itself. Scientists measure the loss in metres per year. The valley measures it in something closer to grief.",
  },
  {
    house: "gemini",
    text: "Three habits separate teams that ship from teams that stall: clear ownership, tight feedback loops, and the discipline to say no to good ideas at the wrong time. None of this is complicated. It just isn't easy. The hardest part isn't learning the habit — it's holding it, week after week, long after the initial motivation has quietly slipped away.",
  },
  {
    house: "gemini",
    text: "Wind that tasted of salt and diesel rolled off the harbor at dawn. The trawlers, tired and salt-stained, eased back into their berths one by one. Nothing about this town moves quickly, or loudly, or for very long. And yet it endures — stubborn, weathered, entirely unbothered by whatever the tourists upriver believe progress is supposed to look like.",
  },
  {
    house: "gemini",
    text: "To choose the right running shoe, weigh three things: your arch, your gait, and the terrain you'll actually run on — not the terrain you imagine running on someday. A shoe built for pavement will punish you on a trail. A trail shoe will feel sluggish and overbuilt on a track. Get this wrong, and your knees will remember it long after the receipt is gone.",
  },
  {
    house: "gemini",
    text: "The lighthouse keeper's log was dense, skeletal, entry after clipped entry. Wind, direction, hours logged. But one line, alone on its own page, broke the pattern: the light held. Nothing else that week seemed to. Not the supply boat, not the radio, not the keeper's own frayed nerves — only the light, standing its ground against a sea that wanted otherwise.",
  },
  {
    house: "gemini",
    text: "There are three kinds of silence in a forest: the silence before rain, the silence after a hawk passes, and the silence that has nothing to do with weather or predators at all — the kind that simply belongs to old trees that have run out of things to say to each other.",
  },
  {
    house: "gemini",
    text: "Set your thermostat two degrees lower this winter, wear an extra layer, and let your body do some of the work your furnace has been doing alone. Small changes, stacked, add up faster than one dramatic one ever does. The savings arrive quietly. They always do.",
  },
  {
    house: "gemini",
    text: "The vineyard clung to the hillside the way memory clings to an old house — stubbornly, uselessly, past the point anyone asked it to. Rows of vines, dry-boned and patient, waited out another drought the valley below had already stopped counting.",
  },
  {
    house: "gemini",
    text: "Great onboarding does three things at once: it orients, it reassures, and it gets out of the way as fast as it can. A new user doesn't want a tour. They want the door to open, quietly, so they can get to the room they actually came for.",
  },
  {
    house: "gemini",
    text: "Snow fell over the ridgeline in a hush that swallowed every other sound. The pines, dense and stubborn, bore the weight without complaint — they always had. Only the wind, restless and searching, seemed unwilling to simply let the mountain be.",
  },
  {
    house: "gemini",
    text: "A strong password isn't clever, it's long — length matters more than the trick you're using to remember it. Passphrases beat substitutions. A manager beats memory. And two-factor authentication, quietly sitting in the background, does more heavy lifting than any password on its own ever could.",
  },

  // ============================== OPENAI ==============================
  // formal five-paragraph cadence, "It's important to note," "Firstly...
  // Secondly... In conclusion," stock disclaimers, exhaustive hedged lists.
  {
    house: "openai",
    text: "Certainly! When it comes to choosing between renting and buying a home, there are several important factors to consider. Firstly, your financial situation plays a crucial role — buying typically requires a larger upfront investment, while renting offers more flexibility. Secondly, it's important to consider your long-term plans; if you intend to stay in one place for several years, buying may be more advantageous. Additionally, market conditions such as interest rates and property values can significantly impact this decision. It's also worth noting that renting can provide more freedom to relocate for job opportunities. In conclusion, the right choice ultimately depends on your individual circumstances, financial goals, and lifestyle preferences.",
  },
  {
    house: "openai",
    text: "Of course! Meal prepping can be a great way to save time and eat healthier throughout the week. To get started, it's important to first plan out your meals for the week, taking into account your nutritional needs and dietary preferences. Next, create a shopping list based on these meals to ensure you have all the necessary ingredients on hand. Additionally, investing in quality storage containers can help keep your food fresh for longer. It's also worth noting that batch cooking staples like rice, grains, and proteins can significantly streamline the process. Overall, with a bit of planning and organization, meal prepping can become an efficient and rewarding habit.",
  },
  {
    house: "openai",
    text: "Great question! There are several key differences between machine learning and traditional programming that are worth exploring. Firstly, traditional programming relies on explicit rules written by a developer, whereas machine learning models learn patterns directly from data. Secondly, machine learning approaches tend to perform better on complex, unstructured problems where writing explicit rules would be impractical. However, it's important to note that machine learning requires substantial amounts of data and computational resources to train effectively. Additionally, interpretability can be more challenging with machine learning models compared to traditional, rule-based systems. In summary, the choice between the two approaches depends largely on the nature of the problem and the resources available.",
  },
  {
    house: "openai",
    text: "As an AI, I don't have personal opinions, but I can provide some general guidance on effective time management. Firstly, prioritizing tasks based on urgency and importance is essential — this is often referred to as the Eisenhower Matrix. Secondly, breaking larger tasks into smaller, manageable steps can help reduce feelings of overwhelm. It's also worth noting that setting realistic deadlines and building in buffer time can prevent unnecessary stress. Additionally, minimizing distractions, such as turning off notifications during focused work periods, can significantly improve productivity. Overall, effective time management is a skill that improves with consistent practice and self-reflection.",
  },
  {
    house: "openai",
    text: "Absolutely, I'd be happy to help explain photosynthesis! Photosynthesis is the process by which plants convert light energy into chemical energy, which is then used to fuel their growth. This process primarily occurs in the chloroplasts of plant cells, specifically within structures called thylakoids. Firstly, light energy is absorbed by chlorophyll, the green pigment found in plants. This energy is then used to split water molecules, releasing oxygen as a byproduct. Secondly, the energy captured is used to convert carbon dioxide into glucose through a series of chemical reactions known as the Calvin cycle. In conclusion, photosynthesis is a vital process that not only sustains plant life but also produces the oxygen essential for most life on Earth.",
  },
  {
    house: "openai",
    text: "That's a great question! When it comes to improving customer retention, there are several strategies businesses can implement. Firstly, providing exceptional customer service is crucial, as it directly impacts customer satisfaction and loyalty. Secondly, implementing a robust loyalty program can incentivize repeat purchases and foster long-term relationships. It's also important to note that regularly seeking and acting on customer feedback demonstrates that a business values its customers' opinions. Additionally, personalizing communication and offers based on customer preferences can significantly enhance the overall experience. Overall, a combination of these strategies, tailored to the specific needs of the business, can lead to improved customer retention rates.",
  },
  {
    house: "openai",
    text: "Sure, I can help clarify the differences between a resume and a CV! Firstly, a resume is typically a concise document, usually one to two pages, that highlights relevant skills and experience for a specific job application. In contrast, a CV, or curriculum vitae, is generally more comprehensive and is commonly used in academic, medical, or research contexts. It's important to note that a CV often includes detailed information about publications, research, and academic achievements. Additionally, the length of a CV can vary significantly depending on one's career stage. In summary, while both documents serve to showcase one's qualifications, the appropriate choice depends on the specific context and industry norms.",
  },
  {
    house: "openai",
    text: "Certainly! Here are some tips for giving an effective presentation. Firstly, it's essential to know your audience and tailor your content to their level of familiarity with the topic. Secondly, practicing your delivery multiple times can help build confidence and ensure smooth pacing. Additionally, using visual aids such as slides can help reinforce key points, though it's important not to overcrowd them with text. It's also worth noting that maintaining eye contact and varying your tone can help keep the audience engaged throughout. In conclusion, thorough preparation combined with clear, confident delivery are the cornerstones of an effective presentation.",
  },
  {
    house: "openai",
    text: "Great question! There are a few important considerations when choosing a programming language for a new project. Firstly, the specific requirements of the project, such as performance needs or platform compatibility, should guide the decision. Secondly, the availability of libraries and community support can significantly impact development speed. It's also worth noting that the existing skill set of your team plays an important role, as leveraging familiar tools can reduce onboarding time. Additionally, long-term maintainability should be factored into the decision. Overall, there is no one-size-fits-all answer, as the best choice depends on the unique context of the project.",
  },
  {
    house: "openai",
    text: "Of course! Staying hydrated is important for overall health, and there are several ways to ensure you're drinking enough water throughout the day. Firstly, carrying a reusable water bottle can serve as a helpful visual reminder. Secondly, setting periodic reminders on your phone can help build a consistent habit. It's also worth noting that consuming water-rich foods, such as fruits and vegetables, can contribute to your overall fluid intake. Additionally, monitoring the color of your urine can be a simple indicator of hydration levels. In summary, a combination of mindful habits and small adjustments can make staying hydrated much easier.",
  },
  {
    house: "openai",
    text: "That's an interesting question! When comparing electric vehicles to traditional gasoline cars, there are several factors worth considering. Firstly, electric vehicles typically have lower operating costs due to reduced fuel and maintenance expenses. Secondly, they produce zero tailpipe emissions, which can significantly reduce environmental impact. However, it's important to note that the upfront cost of electric vehicles can be higher, and charging infrastructure may not be as widely available in all areas. Additionally, battery range and charging times remain considerations for long-distance travel. Overall, the right choice depends on individual driving habits, budget, and access to charging infrastructure.",
  },
  {
    house: "openai",
    text: "Sure, I'd be happy to explain how compound interest works! Compound interest is calculated on both the initial principal and the accumulated interest from previous periods. This means that, over time, your investment grows at an increasing rate compared to simple interest, where interest is only calculated on the principal. Firstly, the frequency of compounding — whether annual, monthly, or daily — can significantly affect the total amount earned. Secondly, the length of time an investment is held plays a crucial role, as compound interest benefits substantially from longer time horizons. In conclusion, understanding compound interest is essential for making informed decisions about savings and investments.",
  },
  {
    house: "openai",
    text: "Great question! There are several best practices to consider when writing clean, maintainable code. Firstly, using clear and descriptive variable names can significantly improve readability. Secondly, breaking down complex functions into smaller, single-purpose functions makes the codebase easier to test and debug. It's also important to note that consistent formatting and adherence to style guides can improve collaboration among team members. Additionally, writing comprehensive comments and documentation helps future developers understand the reasoning behind key decisions. Overall, prioritizing readability and simplicity tends to pay dividends throughout the lifecycle of a software project.",
  },
  {
    house: "openai",
    text: "Absolutely! Understanding the basics of a balanced diet is important for maintaining good health. Firstly, it's essential to include a variety of food groups, such as fruits, vegetables, whole grains, and lean proteins, to ensure adequate nutrient intake. Secondly, portion control plays a significant role in maintaining a healthy weight. It's also worth noting that staying hydrated and limiting processed foods can further support overall wellbeing. Additionally, consulting with a registered dietitian can provide personalized guidance tailored to individual needs. In summary, a balanced approach that emphasizes variety and moderation is generally the most sustainable path to good nutrition.",
  },

  // ============================== HUMAN ==============================
  // varied burstiness, contractions, concrete specific detail, opinions
  // stated flat, imperfect endings, no hedge-stacking.
  {
    house: "human",
    text: "Took the 7:40 train again this morning and it was late, obviously. Stood next to a guy eating a full breakfast burrito on the platform which honestly impressed me more than annoyed me. Work was fine. Meeting ran long because Dave can't stop talking about the Q3 numbers even when nobody asked. Got home, dog had chewed through another sock. Ordered pizza. Not a bad day, all things considered.",
  },
  {
    house: "human",
    text: "Honestly I think the new bridge is ugly and I don't care who disagrees with me. It's this weird beige colour and the lights buzz at night. But it does cut my commute by like fifteen minutes, so fine, I'll take it. My neighbour says it's already sinking on one side. Probably not true. Probably.",
  },
  {
    house: "human",
    text: "Recipe worked but I'd cut the sugar by a third next time, it was borderline too sweet even for me and I have a sweet tooth. Also the 45 minute bake time in the original post is way off, mine needed closer to an hour. Oven's an old gas one though so that might just be me.",
  },
  {
    house: "human",
    text: "So the interview went okay I think? Hard to tell. Guy barely looked up from his laptop for the first ten minutes which was weird. Then he asked about the gap on my resume and I just told him the truth, went travelling, ran out of money, came back. He seemed fine with it actually. We'll see.",
  },
  {
    house: "human",
    text: "Three years running this shop and I still can't figure out Tuesdays. Dead quiet from open till noon then suddenly it's a queue out the door for an hour and a half. Wednesday's the opposite, steady all day, never a rush. Nobody's ever been able to explain that to me and at this point I've stopped asking.",
  },
  {
    house: "human",
    text: "My grandad used to fix radios in the shed out back, tiny thing, barely room for one person and a stool. Smelled like solder and old tea. He'd let me hand him tools if I promised not to touch anything sharp. I still have one of the radios. Doesn't work. Never had the heart to throw it out or fix it.",
  },
  {
    house: "human",
    text: "Ran my first 10k on Saturday, finished in 58 minutes which is slower than I wanted but I'll take it given how hot it was. Legs were done by the 7k mark. Some guy in a banana costume overtook me at the 8k mark and I have never felt so personally attacked by a piece of fruit.",
  },
  {
    house: "human",
    text: "The landlord finally fixed the boiler after I emailed him for the third time. Took him two months. No apology, no explanation, just a text saying \"sorted.\" Cold showers in January build character I guess, that's what I'm telling myself anyway.",
  },
  {
    house: "human",
    text: "Went to the market this morning, first properly cold day of the year. Bought too many apples again, I always do this. The guy at the veg stall remembered my order from last week which was nice, small town stuff. Home by ten, made soup, watched the rain.",
  },
  {
    house: "human",
    text: "Genuinely don't understand why people rave about that restaurant. Waited 40 minutes for a table we'd booked, the pasta was fine, nothing special, and it cost more than my weekly food shop. Maybe I'm missing something. Or maybe everyone's just really good at pretending.",
  },
  {
    house: "human",
    text: "Kid's school project is due tomorrow and of course we're only starting it tonight. Volcano, baking soda, the works. Kitchen's a disaster. He's thrilled though, which I suppose is the point, even if I'm the one who'll be up till midnight cleaning vinegar off the ceiling.",
  },
  {
    house: "human",
    text: "Been putting off calling the insurance company for two weeks now because I know exactly how that call goes. Twenty minutes on hold, transferred twice, explain the whole thing again from scratch. Did it today. Took twenty-five minutes on hold, transferred twice. At least I called it.",
  },
  {
    house: "human",
    text: "Someone left a really nasty comment on my post today, first time that's happened. Didn't expect it to bother me as much as it did if I'm honest. Deleted it, moved on, but it sat with me all afternoon anyway. Weird how one stranger's opinion can do that.",
  },
  {
    house: "human",
    text: "The garden's a mess this year, barely any tomatoes worth eating, but the courgettes have gone absolutely feral, we've got more than we know what to do with. Given half of them to the neighbours already. They've stopped answering the door, can't imagine why.",
  },
];
