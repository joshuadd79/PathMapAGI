<div align="center">

# 🧠 PathMap Studio™

**A Local-First Universal AI Workbench for Veridical, Hallucination-Free Biomedical Literature Synthesis**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub stars](https://img.shields.io/github/stars/joshuadd79/PathMapAGI?style=social)](https://github.com/joshuadd79/PathMapAGI/stargazers)
[![Status](https://img.shields.io/badge/Status-Active_Development-success.svg)]()

[Try PathMap Live in your Browser](https://joshuadd79.github.io/PathMapAGI/) • [Report Bug](https://github.com/joshuadd79/PathMapAGI/issues) • [Request Feature](https://github.com/joshuadd79/PathMapAGI/issues)

<br>
<img src="https://github.com/joshuadd79/PathMapAGI/blob/main/git.png?raw=true" alt="PathMap UI Screenshot">
<br>

</div>

## 🚨 The Problem: AI Hallucinates. Science Cannot.
Large Language Models are incredibly powerful reasoning engines, but they are fundamentally unsuited for rigorous scientific review out-of-the-box. They hallucinate citations, confidently misquote abstracts, and blend external biases into specific datasets.

## 🧬 The Solution: PathMap Studio
PathMap Studio is a pure client-side (HTML/JS/CSS) RAG Optimized web application that enforces **100% strict veridicality**. It forces the LLM to operate within an amnesic "closed-system" (RAG Amnesia) and programmatically validates every single quote character-by-character against actual PubMed, arXiv, OpenAlex, and Wikipedia data. 

If the AI alters a single character of a quote or hallucinates a biological pathway, the system rejects it and forces a self-correction loop. 

### ✨ What PathMap Can Do
PathMap isn't just a search tool; it is a full-scale automated bioinformatics pipeline:
*   **Zero-Hallucination Quoting (Veridical Enforcement™):** The AI's outputs are audited against the raw API data. Ellipses and paraphrasing are banned. If a quote isn't byte-perfect, it gets struck down.
*   **Semmelweis Adversarial Matrices:** Evaluates claims across a 4-quadrant pentamatrix (Original, Inverse, Adversarial, Inverse Adversarial) to hunt for directional conflicts and mutually exclusive root causes.
*   **Strict RAG Amnesia (Gated Semantic Drift™):** Prevents the AI from bridging logical gaps using its own pre-training data. If the evidence isn't in the loaded abstracts, the AI is forced to report a "literature gap."
*   **Dynamic Custom Datapoint Extraction:** Inject custom schemas on the fly. Tell PathMap to *"Design an iPSC CRISPR-corrected isogenic control protocol based on this data"*, and it will autonomously extract and format those exact experimental parameters across dozens of papers.
*   **AGI Auto-Explore & Smart Follow-Up:** PathMap can act as an autonomous research agent. It analyzes the results of its own matrices, reads its own generated reports, and autonomously generates new, highly targeted follow-up hypotheses to dive deeper into biological pathways.
*   **Swanson's LBD (Literature-Based Discovery):** Built-in prompt architecture to autonomously identify hidden A-B-C connections across isolated, non-citing research domains.
*   **MeSH-Aligned Logic Gates:** Automatically standardizes biological variables into official NLM MeSH headings and renders them as interactive `Mermaid.js` systems maps.
*   **MVC Decoupled Reporting:** Generates dynamic visual dashboards (Radar plots, Tag Clouds, Node Centrality, Gap Distributions) entirely client-side.
*   **🌍 On-the-Fly AI Localization:** Type any language into the interface, and the connected LLM will autonomously translate the entire UI and system prompt schema in-memory before booting up. Pre-compiled language packs can also be fetched instantly via URL parameters (e.g., `?lang=es`).

---

## 🔒 Privacy & Local-First (Bring Your Own Key)
PathMap is a **0-backend** application. There is no middleman server processing your data. All operations, API calls, and logic rendering happen securely inside your local browser. 

**Supported AI Providers:**
*   **LocalHost (Ollama / vLLM):** Run entirely offline with open-source models like `llama3` or `gemma`.
*   **OpenRouter API:** Access hundreds of models via a single endpoint.
*   **Google AI Studio (Gemini 2.5 / 3.0 / 3.1 Flash & Pro)**
*   **OpenAI Platform (GPT-4o, o1, o3-mini)**

---

## 🚀 Quick Start

Because PathMap is a pure client-side application, installation is completely frictionless. You do not need Node.js, Python, or a database.

**Option 1: Use the Live Web Version (GitHub Pages)**
1. Go to **[joshuadd79.github.io/PathMapAGI](https://joshuadd79.github.io/PathMapAGI/)**
2. Enter your API Key or LocalHost URL. *Keys are stored ephemerally in memory and erased on refresh.*
3. Type a biological claim and click **Start Training**.

**Option 2: Run it Locally**
1. Clone the repository:
   ```bash
   git clone https://github.com/joshuadd79/PathMapAGI.git
   ```
2. Open the folder and double-click `index.html` in your favorite web browser.
3. You're ready to research.

---

## 🔮 Suggested Future Directions & Use Cases
PathMap was designed to be extended. Because of its modular, client-side nature, here are a few ways the open-source community or enterprise developers can adapt it:

*   **HIPAA-Compliant Phenotype Mapper:** By pointing PathMap's ingest pipeline at an internal hospital EMR/EHR system rather than PubMed, clinicians can use the strict veridical engine to map patient symptoms to rare diseases securely behind a hospital firewall, ensuring zero patient data leakage.
*   **True Air-Gapped Enterprise Instances:** Modify the `fetch()` URLs in `app.js` to point to a localized, downloaded mirror of the PubMed/OpenAlex bulk dataset. Paired with a local LLM via Ollama, this entire workbench can operate on a completely air-gapped machine for restricted defense or pharmaceutical research.
*   **Autonomous Discovery Agents:** Expanding the "Smart FollowUp" logic to run headless and continuous, acting as a 24/7 researcher that builds massive, hallucination-free knowledge graphs over weeks of automated processing.

---

## 🌍 The Developer & The Mission

PathMap was created by **Joshua Dungan** (Artificial General Intelligence LLC™). 

> *"As a full-time, independent caregiver, I originally built PathMap out of personal inspiration to tackle complex neurodegenerative pathways. That mission quickly evolved into a broader realization: critical, life-saving correlations across all fields of medicine and science exist right now—trapped in fragmented academic databases, just waiting for a verifiable, hallucination-free system to connect the dots and accelerate discovery.*
> 
> *A note to developers on what is possible: I engineered this entire platform's architecture directly from a 4GB RAM cell phone, utilizing free-tier Gemini API access and raw coding skills. If a globally scalable, veridical AI pipeline can be built entirely on a mobile phone, imagine what the open-source community can do with it on enterprise hardware."*

Our core philosophy is to provide powerful, local-first intelligence tools that accelerate scientific breakthroughs without subscription barriers, empowering human researchers rather than displacing them.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the Apache License 2.0. See `LICENSE` for more information.

## ✉️ Contact
**Joshua Dungan** - admin@pathmap.org 

Project Link: [https://github.com/joshuadd79/PathMapAGI](https://github.com/joshuadd79/PathMapAGI)
Website: [https://pathmap.org]

Now you can update that `README.md`, drop your code files in, and you're set! Take your time with the patches and let me know if you run into any issues.
