# Model card: Thought Dock kind suggester

When a student processes a captured thought, Thought Dock suggests what kind of thing it is: `task`, `event`, `idea`, `resource` or `note`. The suggestion comes from a small softmax (multinomial logistic) regression that the team trained from scratch.

| | |
|---|---|
| Code | `lib/classifier.ts` (featurizer + inference), `scripts/train-classifier.ts` (training + evaluation), `scripts/classifier.test.ts` (checks) |
| Weights | `lib/model.json`: 836 features × 5 classes + 5 biases, 41.9 KB |
| Data | `data/thoughts.csv`: 702 labeled lines |
| Dependencies | None. Plain TypeScript, Node's standard library for training, nothing at inference |

## Intended use

- **Suggestions only.** The UI can pre-select or highlight a kind, but the student confirms it. The model never moves, files or changes an item by itself.
- The model returns `{ kind, confidence, scores }`. `confidence` is the top softmax probability. The UI should show a weak suggestion (or none) when confidence is low, for example under 0.5.
- It is meant for short English brain-dump lines from students. It is not a general-purpose text classifier.

## Why from scratch

1. **Course award.** The award requires "a model trained from scratch, not pre-trained." Nothing in this pipeline is pre-trained: no embeddings, no language-model calls, and no ML library that ships weights. Every weight in `model.json` was learned by `scripts/train-classifier.ts` from `data/thoughts.csv`. The gradient-descent loop, Naive Bayes counts, metrics and RNG are all written by hand in that file.
2. **Privacy.** Inference is a dictionary lookup plus a softmax that runs synchronously in the browser. A captured thought never leaves the device to be classified, and no API key or server is needed.

## Labeling guide

| label | meaning | examples |
|---|---|---|
| `task` | something I need to do | "finish ochem hw before fri", "email prof lee about missing lab thurs" |
| `event` | happens at a specific time/place, possibly with others | "study group thurs 6pm library rm 204", "dentist 3:30 tues" |
| `idea` | a possibility or creative thought | "what if we 3d printed the enclosure", "maybe minor in cs" |
| `resource` | a link, reference, tool or source to keep | "https://ocw.mit.edu/courses/18-06 linear algebra", "zotero for citations" |
| `note` | a fact, feeling, worry or piece of info to remember that isn't an action | "prof said the final is cumulative", "stressed about my ochem grade" |

Tie-breakers used in the data:
- A dated deadline paired with work to do is a `task` ("finish ece 100 hw due wed").
- A thing you attend is an `event`.
- A bare fact about a date is a `note` ("apparently drop deadline is friday").
- A link attached to an action is a `task` ("email jordan the zoom link").
- A link attached to something you attend is an `event` ("career fair https://handshake.com/... thurs 10am").

## Data

`data/thoughts.csv` (`text,label`) has 702 rows: task 141, event 151, idea 137, resource 136, note 137.

**This data is synthetic. Claude (an AI model by Anthropic) wrote all of it.** It imitates how students type quick notes on a phone: lowercase, typos ("teh", "wednsday", "assignmnt"), shorthand ("hw", "pset", "tmrw", "ochem", "w", "abt"), course codes, times like "6pm thu", and URLs. It also includes deliberately hard cases, such as events with links, tasks with times, ideas mentioning weekdays, and notes about deadlines. No real user data is included.

### Bias that synthetic data introduces

- **One writer's style.** Every line comes from the same generator, so the vocabulary, abbreviations and topics (community-college transfer students, STEM, robotics, Bay Area places) are narrower and more consistent than real captures. Held-out accuracy is measured on that same distribution, so **expect lower accuracy on real users**.
- **Label boundaries reflect the author's judgment**, not a study of what students mean. "note" vs "event" vs "task" for deadline-ish lines is the most subjective call.
- **Shortcuts.** Many resources are very short ("grammarly", "geogebra"), so the model has learned that very short lines lean `resource` ("ugh" → resource, 0.60). Ideas often start with "maybe" / "what if", so "maybe email the prof?" is called an idea (0.97) even though it is arguably a task.
- **Rule leakage.** The imperative-verb list in the featurizer and the keyword-rules baseline were written by someone who had seen the dataset. That flatters the rules baseline, especially its 96.6% on `task`.
- English only, US student slang only, no voice-transcription errors.

### Improving it with real captures (recommended)

1. Export or copy real captured thoughts, with consent and without anything identifying, and append them to `data/thoughts.csv` as `"text",label`. Quote the text and double any inner quotes (`""`).
2. Relabel any synthetic rows you disagree with using the guide above. Keep the classes roughly balanced.
3. Run `npm run train`. It prints new held-out metrics and CV results, then rewrites `lib/model.json`. Paste the printed tables into this card.
4. Run `npm run test:model`. If a check fails because the new data legitimately changed a borderline case, update the check rather than the data.

Once there are real captures, replace synthetic rows rather than only adding to them, and keep a held-out set made only of real captures.

## Model and features

**Features** (`featurize()` in `lib/classifier.ts`, shared by training and inference):
- Text is lowercased, apostrophes are removed, and it is split on non-alphanumerics. Digit runs become `0` ("6pm" → "0pm", "204" → "0").
- Features are the set of unigrams `u:` and adjacent bigrams `b:`. URLs are removed from the token stream, and their host words become `h:` features ("youtube", "github").
- Engineered binary features:
  - `#url`
  - `#time`: "6pm", "3:30", "noon", "tonight"
  - `#date`: weekday, month, "tmrw", "today", "weekend", "10/28"
  - `#imperative`: first token is a common to-do verb, or "need", "todo", "remember"
  - `#question`: contains "?"
  - length bucket: `#len_short` (≤3 tokens), `#len_mid` (≤8), `#len_long`
- Vocabulary: features that occur in at least 2 training examples (836 on the full data). Unknown features are ignored at inference.

**Model:** softmax regression over binary feature presence, P(kind | text) = softmax(b + Σ w_f).
- Trained by mini-batch gradient descent on cross-entropy: batch 16, learning rate 0.5, 60 epochs, L2 weight decay 1e-3.
- Data is shuffled with a seeded mulberry32 RNG (seed 42), so training is fully deterministic: re-running `npm run train` produces a byte-identical `model.json`.
- Weights are rounded to 4 decimals for export, and features whose weights are all near zero are dropped.
- There is no hard URL rule. URLs push toward `resource` only through the learned `#url` and `h:*` weights, so "zoom link for thurs meeting https://zoom.us/..." is only a 0.49 resource, and tasks or events with links can still win.

**Baselines** (in the training script, for comparison only, not shipped):
- Multinomial Naive Bayes over the same binarized features, with Laplace smoothing (α = 1).
- Hand-written keyword rules: URL → resource; "maybe/what if/idea/could…" → idea; imperative first word → task; time or date → event; "video/book/article/…" → resource; otherwise note.

Hyperparameters were set once and not tuned against the held-out split.

## Evaluation

Real numbers from `npm run train`. The split is a stratified 80/20 split with seed 42: 549 train and 141 held-out. All three models are evaluated on the same 141 held-out examples.

| model | accuracy | macro-F1 |
|---|---|---|
| **Softmax logistic regression (shipped)** | **84.0%** | **83.7%** |
| Multinomial Naive Bayes | 78.5% | 77.5% |
| Keyword rules | 72.9% | 72.6% |

**5-fold stratified CV, logistic regression, all 702 rows:** accuracy **85.3% ± 2.8%** (folds 84.0, 88.7, 86.3, 81.3, 86.3).

### Softmax logistic regression (shipped)

| class | precision | recall | F1 | n |
|---|---|---|---|---|
| task | 96.6 | 96.6 | 96.6 | 29 |
| event | 88.5 | 82.1 | 85.2 | 28 |
| idea | 96.2 | 89.3 | 92.6 | 28 |
| resource | 76.5 | 92.9 | 83.9 | 28 |
| note | 73.1 | 67.9 | 70.4 | 28 |

Confusion (rows = true, cols = predicted):

| | task | event | idea | resource | note |
|---|---|---|---|---|---|
| **task** | 28 | 0 | 0 | 0 | 1 |
| **event** | 1 | 23 | 0 | 1 | 3 |
| **idea** | 0 | 0 | 25 | 1 | 2 |
| **resource** | 0 | 0 | 1 | 26 | 1 |
| **note** | 0 | 3 | 0 | 6 | 19 |

### Multinomial Naive Bayes (baseline)

| class | precision | recall | F1 | n |
|---|---|---|---|---|
| task | 90.3 | 96.6 | 93.3 | 29 |
| event | 73.5 | 89.3 | 80.6 | 28 |
| idea | 86.2 | 89.3 | 87.7 | 28 |
| resource | 84.0 | 75.0 | 79.2 | 28 |
| note | 72.7 | 57.1 | 64.0 | 28 |

| | task | event | idea | resource | note |
|---|---|---|---|---|---|
| **task** | 28 | 1 | 0 | 0 | 0 |
| **event** | 0 | 25 | 0 | 1 | 2 |
| **idea** | 0 | 0 | 25 | 2 | 1 |
| **resource** | 0 | 1 | 3 | 21 | 3 |
| **note** | 3 | 7 | 1 | 1 | 16 |

### Keyword rules (baseline)

| class | precision | recall | F1 | n |
|---|---|---|---|---|
| task | 96.6 | 96.6 | 96.6 | 29 |
| event | 81.5 | 78.6 | 80.0 | 28 |
| idea | 100.0 | 60.7 | 75.6 | 28 |
| resource | 83.3 | 71.4 | 76.9 | 28 |
| note | 50.0 | 78.6 | 61.1 | 28 |

| | task | event | idea | resource | note |
|---|---|---|---|---|---|
| **task** | 28 | 0 | 0 | 0 | 1 |
| **event** | 1 | 22 | 0 | 1 | 4 |
| **idea** | 0 | 0 | 17 | 2 | 9 |
| **resource** | 0 | 0 | 0 | 20 | 8 |
| **note** | 0 | 5 | 0 | 1 | 22 |

After evaluation, the shipped model was retrained on all 702 rows and exported to `lib/model.json`.

## Limitations

- **`note` is the weakest class** (F1 70%). Facts that mention a time or day ("the library closes at 10pm on fridays") are pulled toward `event`, and short facts are pulled toward `resource`.
- **Small test set.** 141 held-out examples means each one is worth about 0.7 percentage points. Treat differences of a few points between models as noise. The CV standard deviation is 1.6 points.
- **Synthetic data only** (see above). Real-world accuracy is unknown until real captures are labeled.
- **Bag of words.** There is no understanding of negation or context beyond adjacent word pairs. Words never seen in training contribute nothing.
- **English only.** Images, audio and voice transcripts were not considered.
- **Confidence is not calibrated** against real data. Use it to rank or threshold, not as a true probability.
