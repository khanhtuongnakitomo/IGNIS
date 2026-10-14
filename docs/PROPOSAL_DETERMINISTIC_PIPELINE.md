# Proposal: deterministic work-order pipeline (`ignis_wo`)

Status: **counter-proposal with working code**, by Yoshio, 14 October 2026. It does not replace [ARCHITECTURE.md](ARCHITECTURE.md) or [AGENT_HANDOFF.md](AGENT_HANDOFF.md). It is offered next to them for a team decision. The scope matches the MVP in [AGENTS.md](../AGENTS.md).

## Position

Every number in the report should be computed in code from records a person approved, and every stage should leave a checked artifact. If something goes wrong, the run stops at the stage that broke and names it.

The model is used where it can be trained and measured: extracting component, fault and action from work-order text. That is where fine-tuning belongs.

There is no retrieval-augmented generation, no knowledge graph, and no technician instructions or dispatch. These depend on chains of probabilistic steps that we cannot test one at a time with the data we have.

## Pipeline

| Stage | What it does | Artifact |
|---|---|---|
| `01_ingest` | Reads CSV, TSV, JSON, JSONL or XLSX through a versioned parser registry | source file hash, columns |
| `02_mapping` | Proposes a column mapping from header synonyms. A person confirms it. Builds canonical records. Absent fields stay empty | proposal, confirmed revision, records, row issues |
| `03_extract` | Gets MaintIE entities and relations from the model adapter. Validates schema, labels, offsets and span text. Any invalid output stops the run unless `--allow-rejected` is set | suggestions with errors |
| `04_review` | Applies reviewer decisions (accept, correct, reject). Corrections are validated like model output | attributed annotations |
| `05_snapshot` | Freezes approved records, criticality ratings and config versions under one content hash | snapshot |
| `06_facts` | Computes counts, severity, recurrence, criticality and triage priority in code. Each fact has an ID and its source records. A KPI whose fields are missing is marked `not_computed` | fact rows |
| `07_explain` | Builds a typed explanation per component from fact IDs, then validates it against the facts | explanations |
| `08_claims` | Renders sentences from templates whose numbers come only from fact slots. The claim checker blocks numbers outside slots, banned wording, and wrong facts, units, scope or snapshot | claims |
| `09_report` | Writes a ReportLab PDF (byte-identical across runs) and a static triage board | PDF hash, board |

**Triage priority** = severity × recurrence × criticality. The tables are versioned in `ignis_wo/config/`:
- **Severity:** FailedState 3, DegradedState 2, other Undesirable* classes 1.
- **Recurrence:** the number of approved records that name the component.
- **Criticality:** set by a supervisor, with a reason. The default is 1.

It is an ordering of approved records. It is not a failure prediction, a probability or a remaining-life estimate.

**The model adapter** has three modes behind one interface:
- `fixture`: MaintIE gold annotations, for building and testing without a GPU.
- `replay`: recorded responses, for a reproducible demo.
- `live`: an OpenAI-compatible vLLM endpoint with `response_format: json_schema`.

## Why each stage is testable on its own

- **Extraction** is scored against human labels on the MaintIE split, and published baselines exist to compare against.
- **Facts, triage, explanation and claims** are deterministic. Unit tests pin hand-computed values, band boundaries (9/10, 29/30, 0), invented fact IDs, edited sentences and every claim-checker rule.
- **The end-to-end test** runs the whole pipeline twice and requires identical hashes at every stage. It also shows that a corrupt model output stops the run at `03_extract`.

## MaintIE split

There is no released split file. Upstream `models/create_datasets.py` shuffles one list but slices another, unshuffled one, so the published split is positional:

| Split | Gold items |
|---|---|
| train | 0–859 |
| dev | 860–967 |
| test | 968–1075 (108 texts) |

`ignis_wo/evaluation/maintie_split_lock.json` pins the hashes of each split. Scoring the test split requires `--final`. It refuses fixture mode, and it refuses any model version already recorded in the ledger.

## What exists now and what does not

**Implemented and tested on CPU:**
- every stage above
- the fixture and replay adapters
- the live adapter, against a local mock server only
- the scorer and the split lock

**Not done:**
- no LoRA training
- no live model run
- no GPU measurement

In fixture mode the dev-split score is 1.0 because the predictions are the gold labels. That only shows the harness works; it is not a model result. With deliberate errors injected (`--perturb`), entity F1 falls to 0.892 and relation F1 to 0.937, which shows the scorer catches mistakes.

**Known limitations:**
- Faults are attached to components through relations, with a single-component fallback. Faults that cannot be attached are counted per class and flagged `UNATTRIBUTED_FAULTS`.
- Fixed band thresholds put more components in High as a snapshot grows.
- MaintIE texts have no dates or assets. The demo export adds synthetic asset, date and downtime columns and labels them synthetic.

## GPU checklist (one provisioning window)

1. LoRA fine-tune on the train split. Instruction format: text in, `ExtractionOutput` JSON out.
2. Score on the dev split with `python -m ignis_wo eval --split dev --mode live ...`, and iterate.
3. Run the single locked test-split evaluation with `--final`.
4. Record replay files with `--record` for the demo export and the dev split.
5. Smoke test structured output and the LoRA adapter together. Report the share of outputs that pass the schema.
6. Measure throughput and p50/p95 latency. Record the vLLM and ROCm versions.

## Run it

```
uv run --no-project --with-requirements requirements-dev.txt python scripts/fetch_maintie.py
uv run --no-project --with-requirements requirements-dev.txt python scripts/make_demo_export.py --seed 7
uv run --no-project --with-requirements requirements-dev.txt python -m ignis_wo run --input data/demo/export.xlsx --out outputs/demo --synthetic
uv run --no-project --with-requirements requirements-dev.txt python -m ignis_wo eval --split dev
uv run --no-project --with-requirements requirements-dev.txt python -m unittest discover -s tests -v
```

The same commands work with `pip install -r requirements-dev.txt` followed by `python ...`. Data and outputs go to the gitignored `data/` and `outputs/` folders.
