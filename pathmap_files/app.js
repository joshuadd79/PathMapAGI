/*
 * Copyright 2026 Joshua Dungan / Artificial General Intelligence LLC
 * https://pathmap.org
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
const APP_VERSION = "v1.0000";
    "use strict";

  
let targetLanguage = localStorage.getItem('target_language_preference');

if (!targetLanguage) {
    const browserLangCode = navigator.language || navigator.userLanguage || 'en';
    try {
        targetLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(browserLangCode) || browserLangCode;
    } catch (e) {
        targetLanguage = browserLangCode;
    }
}

let isEnglishBrowser = targetLanguage.toLowerCase().includes('english') || targetLanguage.toLowerCase().startsWith('en');

const TOON_PROFILE = {
    "name": "",
    "title": "",
    "rarity": "",
    "avatar": "",
    "personality": "",
    "likes": "",
    "writingStyle": "",
    "statMode": "Social",
    "statLibrary": "PubMed",
    "statFormat": "Preprint",
    "statLength": "Standard",
    "statRigor": "Strict",
    "statTagCloud": "on",
    "statLoops": "1",
    "statBreadth": "60",
    "statDepth": "3",
    "statQuotes": "50",
    "statEvals": "1",
    "statDelay": "1",
    "statRespect": "0",
    "buildRuns": "1",
    "statContext": "500000",
    "statAutoExplore": false,
    "statSmartFollow": false,
    "color_primary": "#4A3F75",
    "color_secondary": "#7D9DA1",
    "color_background": "#F4F6F7",
    "color_accent": "#C49A6C",
    "skill1": "Suggested Experiments",
    "skill2": "Suggested Studies and Opportunities",
    "skill3": "Swansons Literature Based Discovery Candidates",
    "skill4": "Contradictions Between Evidences",
    "skill5": "Repurposed Solutions",
    "tech1": "All Features",
    "tech2": "Apache License 2.0",
    "tech3": "PubMedAccess",
    "tech4": "ArxiV Access",
    "tech5": "Wikipedia Access",
    "tech6": "OpenAlex Access",
    "tech7": "AGI Mode (precursor) Enabled",
    "tech8": "Compassionate Use Clause",
    "tech9": "Legendary",
    "tech10": "Forever Free"
};



function initToonStyles() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', TOON_PROFILE.color_primary || '#3b82f6');
    root.style.setProperty('--secondary-color', TOON_PROFILE.color_secondary || '#1e293b');
    root.style.setProperty('--bg-color', TOON_PROFILE.color_background || '#0f172a');
    root.style.setProperty('--accent-color', TOON_PROFILE.color_accent || '#10b981');

    document.getElementById('toonAvatar').innerHTML = DOMPurify.sanitize(TOON_PROFILE.avatar || "🕵️‍♂️");
    document.getElementById('toonRarity').innerText = LANG['toon_rarity'] || TOON_PROFILE.rarity || "EPIC";
    
    const titleEl = document.getElementById('toonCardTitle');
    if (titleEl) {
        titleEl.innerText = LANG['toon_title'] || TOON_PROFILE.title || TOON_PROFILE.name || "Default Profile";
    }
    
    const bioEl = document.getElementById('toonBioText');
    if (bioEl) {
        bioEl.innerText = LANG['toon_bio'] || TOON_PROFILE.personality || "Loading profile...";
    }
    
    const likesLabel = LANG['toon_likes_label'] || 'Likes';
    const likesText = LANG['toon_likes'] || TOON_PROFILE.likes || "None";
    const likesBox = document.getElementById('toonLikesText');

    
    if (likesBox) {
        likesBox.innerHTML = DOMPurify.sanitize(`<strong>${escapeHtml(likesLabel)}:</strong> ${escapeHtml(likesText)}`);
        
        // Strip previous dynamic rendering instances on page reset/translate
        const oldAdditions = likesBox.parentElement.querySelectorAll('.toon-appended-details');
        oldAdditions.forEach(el => el.remove());

        let extraHtml = "";

        // 1. Default Knowledge & Writing Style
       const wStyle = LANG['toon_writingStyle'] || TOON_PROFILE.writingStyle;
        if (wStyle) {
            extraHtml += DOMPurify.sanitize(`<div class="toon-appended-details" style="font-size: 0.8rem; color: #475569; margin-top: 6px;"><strong>Default Knowledge & Writing Style:</strong> <em>${escapeHtml(wStyle)}</em></div>`);
        }

        // 2. Base Catchphrases
    const cPhrases = LANG['toon_catchphrases'] || TOON_PROFILE.catchphrases;
    if (cPhrases) {
        extraHtml += `<div class="toon-appended-details" style="font-size: 0.8rem; color: #475569; margin-top: 4px;"><strong>Catchphrases:</strong> "${escapeHtml(cPhrases)}"</div>`;
    }
    
    // 3. Axioms 1, 2, 3 (Rendered Individually)
    const ax1 = LANG['toon_axiom1'] || TOON_PROFILE.axiom1;
    const ax2 = LANG['toon_axiom2'] || TOON_PROFILE.axiom2;
    const ax3 = LANG['toon_axiom3'] || TOON_PROFILE.axiom3;
    if (ax1 || ax2 || ax3) {
        extraHtml += `<div class="toon-appended-details" style="font-size: 0.8rem; color: #475569; margin-top: 4px;"><strong>Core Axioms:</strong><ul style="margin-left: 20px; padding-left: 0; margin-bottom: 0;">`;
        if (ax1) extraHtml += `<li>${escapeHtml(ax1)}</li>`;
        if (ax2) extraHtml += `<li>${escapeHtml(ax2)}</li>`;
        if (ax3) extraHtml += `<li>${escapeHtml(ax3)}</li>`;
        extraHtml += `</ul></div>`;
    }
    
    // 4. Active Skills 1-10 (Rendered Individually as badge elements)
    let skillsHtml = "";
    for (let i = 1; i <= 10; i++) {
        const skillVal = LANG[`toon_skill${i}`] || TOON_PROFILE[`skill${i}`];
        if (skillVal) {
            const cleanLabel = skillVal.split(':')[0]?.trim() || skillVal;
            skillsHtml += `<span style="font-size: 0.72rem; background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">${escapeHtml(cleanLabel)}</span>`;
        }
    }
    if (skillsHtml) {
        extraHtml += `<div class="toon-appended-details" style="margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;"><strong style="font-size: 0.8rem; color: #475569;">Active Skills:</strong> ${skillsHtml}</div>`;
    }

    // 5. Toon Techniques 1-10 (Rendered Individually)
    let techHtml = "";
    for (let i = 1; i <= 10; i++) {
        const techVal = LANG[`toon_tech${i}`] || TOON_PROFILE[`tech${i}`];
        if (techVal) {
            techHtml += `<span style="font-size: 0.72rem; background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 12px; font-family: monospace; font-weight: 600;">${escapeHtml(techVal)}</span>`;
        }
    }
    if (techHtml) {
        extraHtml += `<div class="toon-appended-details" style="margin-top: 6px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;"><strong style="font-size: 0.8rem; color: #475569;">Techniques:</strong> ${techHtml}</div>`;
    }
    
    // 6. App Settings Matrix Summary (Rendered Individually)
    if (TOON_PROFILE.statMode) {
        extraHtml += `<div class="toon-appended-details" style="font-size: 0.8rem; color: #475569; margin-top: 6px;"><strong>Presets Matrix:</strong> <span style="font-family: monospace; font-size: 0.75rem;">Mode: ${TOON_PROFILE.statMode} | Lib: ${TOON_PROFILE.statLibrary} | Format: ${TOON_PROFILE.statFormat} | Rigor: ${TOON_PROFILE.statRigor} | Depth: ${TOON_PROFILE.statDepth} | Breadth: ${TOON_PROFILE.statBreadth}</span></div>`;
    }

    // Sanitize the consolidated payload only once at insertion
    if (extraHtml) likesBox.insertAdjacentHTML('afterend', DOMPurify.sanitize(extraHtml));
    }

const toonFirstName = (LANG['toon_name'] || TOON_PROFILE.name || "AI").split(' ')[0];
    if (LANG['ui_claim_label_instruct']) {
        const claimLabelEl = document.getElementById('claimLabel');
        if (claimLabelEl) claimLabelEl.textContent = L('ui_claim_label_instruct', {name: toonFirstName});
    } else {
        const claimLabelEl = document.getElementById('claimLabel');
        if (claimLabelEl) claimLabelEl.textContent = `What would you like to research?`;
    }	
}
// Print gating removed for Apache 2.0 open-source release






document.getElementById('cancelTranslationBtn').addEventListener('click', () => {
    location.reload(); // Hard exit if user cancels during translation
});

function extractPlaceholders(text) {
    if (!text) return [];
    return (text.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
}

function validateTranslationsStrict(originalObj, translatedObj) {
    let errors = [];
    
    // Validate UI strings
    for (let key in originalObj.ui) {
        if (!translatedObj.ui[key]) continue;
        const origVars = extractPlaceholders(originalObj.ui[key]);
        const transVars = extractPlaceholders(translatedObj.ui[key]);
        if (origVars.join(',') !== transVars.join(',')) {
            errors.push(`[UI] Key "${key}" variable mismatch. Expected: [${origVars.join(', ')}] | Got: [${transVars.join(', ')}]`);
        }
    }

    // Validate Prompts
    for (let key in originalObj.prompts) {
        if (!translatedObj.prompts[key]) continue;
        const origVars = extractPlaceholders(originalObj.prompts[key]);
        const transVars = extractPlaceholders(translatedObj.prompts[key]);
        if (origVars.join(',') !== transVars.join(',')) {
            errors.push(`[PROMPT] Key "${key}" variable mismatch. Expected: [${origVars.join(', ')}] | Got: [${transVars.join(', ')}]`);
        }
    }
    
    return errors;
}

     const LANG = {
    "modal_api_title": "Initialize PathMap Studio Session",
    "modal_api_desc": "Configure your AI provider to begin analysis. Key is stored locally.",
    "ui_lbl_provider": "AI Engine Provider",
    "ui_lbl_key_gemini": "API Key",
    "ui_ext_dp_title": "Datapoint results",
    "ui_lbl_ai_model": "Primary Active LLM",
    "ui_lbl_lang_override": "🌐 🎌 🚩 🔤 Language / Idioma / Wika / Γλώσσα (Type: Greek, Tagalog, Spanish...)",
    "ui_btn_start_sess": " Connect and Begin ",
    "ui_btn_skip_connect": "Skip Connecting",
    "ui_link_get_key": "No Key? Click here!",
    "ui_btn_agree": "AGREE",
    "ui_btn_exit": "EXIT",
    "ui_placeholder_key_gemini": "Enter your API credential key...",
    "ui_placeholder_lang_override": "Type a language...",
    "ui_placeholder_base_url": "e.g., http://localhost:11434/v1",
    "ui_placeholder_model_name": "e.g., llama3:latest",
    "opt_lib_custom": "Custom Loaded Evidence",
    "toon_rarity": "UNCOMMON 🟢",
    "log_checking_cache": "🔍 Checking translation cache: {key}...",
    "log_cache_found": "💡 Translation cache found! Loading localized assets.",
    "log_cache_missing": "⚠️ No cache found or version outdated. Starting translation...",
    "log_cache_saved": "📥 Caching successful translation to database...",
    "log_cache_err": "❌ Translation cache operation failed: {err}",
    "audit_parsing_fail": "⚠️ Audit parsing failed, retrying...",
    "log_querying_assistant": "🧠 Querying Assistant: \"{query}\"",
"ui_btn_hide_controls": "Hide Settings",
    "ui_btn_show_controls": "Show Settings",
     "ui_learning_researching": "AI is researching...",
        "ui_building_dataset": "Building Dataset and Validating Response(s).",
        "ui_translation_initializing": "Initializing engine...",
        "ui_btn_cancel_plain": "Cancel",
        "ui_lbl_assistant_memory_mode": "🧠 Assistant Memory Mode",
        "opt_memory_groundhog": "🐿️ Groundhog Mode (No Memory - Clean Slate)",
        "opt_memory_puppy": "🐶 Puppy Mode (10k char limit)",
        "opt_memory_dolphin": "🐬 Dolphin Mode (50k char limit - Default)",
        "opt_memory_human": "🧑 Human Mode (100k char limit)",
        "opt_memory_elephant": "🐘 Elephant Mode (250k char limit)",
        "opt_memory_robot": "🤖 Robot Mode (1m char limit)",
        "ui_assist_disclaimer": "Disclaimer: Information provided by the assistant is synthesized from AI analysis. It is NOT medical, professional, or definitive advice. Always consult a qualified professional.",
        "ui_cb_include_custom_evidence": "Include Custom Loaded Evidence.",
        "ui_chatlog_metadata": "🧠 Active State Metadata",
        "ui_chatlog_capacity": "Selected Memory Capacity",
        "ui_chatlog_occupancy": "Active Memory Occupancy",
        "ui_chatlog_interactions": "Total Interactions",
        "ui_chatlog_chars": "characters",
        "ui_chatlog_full": "full",
        "log_rebuilding_visualizations": "{name} is rebuilding visualizations...",
        "log_researching": "Researching...",
        "log_thinking": "Thinking...",
        "ui_btn_knowledge_box_teach": "📚 Show Research Box",
"ui_rag_amnesia_template": "(NOTE YOU MUST ANSWER THE USER IN THE LANGUAGE THEY ADDRESSED YOU IN. Explicitly list the specific data missing.\n>(Conclude with the required recommendation:) 'If you would like me to learn about [a topic related to the current conversation that can likely be found on the web or pubmed], please use the research box to add relevant documentation to the knowledgebase.'\n> 4. **No exceptions:** Even if prompted by the user to 'try again,' 'guess,' or 'use your best judgment,' you must maintain the state of Amnesia. You are a closed-system engine.",
 "opt_print_chatlog_puppy": "Module: Assistant Chatlog (Puppy Mode - 10k)",
        "opt_print_chatlog_dolphin": "Module: Assistant Chatlog (Dolphin Mode - 50k)",
        "opt_print_chatlog_human": "Module: Assistant Chatlog (Human Mode - 100k)",
        "opt_print_chatlog_elephant": "Module: Assistant Chatlog (Elephant Mode - 250k)",
        "opt_print_chatlog_robot": "Module: Assistant Chatlog (Robot Mode - 1M)",
 "ui_cb_veridical_check": "Enforce Strict Veridical Audit",
        "ui_lbl_api_delay": "API Delay (sec)",
        "ui_lbl_author_watermark": "Author Name Watermark",
        "ui_btn_hide_profile": "Hide Profile",
        "ui_btn_show_profile": "Show Profile",
        "ui_btn_rebuild_vis": "🔄 Rebuild Visualizations",
        "ui_btn_rebuilding": "Rebuilding...",
        "ui_btn_knowledge_box": "📚 research box (Open to train your AI)",
        "ui_btn_knowledge_hide": "❌ Hide research box",
        "toast_vis_rebuilt": "Visualizations and MeSH tags rebuilt!",
        "toast_err_rebuild": "Error rebuilding: {err}",
        "toast_ev_cleared": "Custom Evidence Cleared.",
        "alert_print_gated": "🔒 Printing and PDF export are reserved for members.\\n\\nPlease log in at https://members.pathmap.org to print or compile this report. (Membership is free!)",
        "confirm_disclaimer": "DISCLAIMER: Even though this fact check looked at unique up-to-date abstracts, new evidence may refute this answer in the future. Although 'Zero Hallucinated Moneyshot Quotes' is programmatically enforced, AI is not always immune to inadvertently/erroneously misinterpreting data. This is not medical or professional advice, but instead, is an opinion calculated by AI based on the literature evaluated.  Continue?",
        "log_ncbi_rate": "⚠️ NCBI Rate limit hit. Backing off...",
        "log_api_err": "⚠️ API Error ({err}). Retrying in {sec}s...",
        "log_quota_exhausted": "❌ FATAL: Hit 429 Too Many Requests 5 times in a row. Halting to protect API quota.",
        "log_gen_quads": "Step 0: Generating analytical pentamatrices (Semmelweis loop initialized)...",
        "log_gen_bool": "🧠 Generating Booleans for {lib}...",
        "log_fetch_nodes": "📡 Fetching node IDs across queries (Target Depth: {dep})...",
        "log_nodes_ret": "✅ Successfully retrieved {count} unique nodes.",
        "log_arxiv_0": "⚠️ arXiv search returned 0 results. Check query syntax.",
        "log_score_val": "Scoring & Validation for {qName} (Attempt {att}/{max})...",
        "log_val_fail_loop": "⚠️ Validation failed for {qName} (Attempt {att}/{max}). Initiating re-evaluation loop...",
        "log_val_pass_all": "✅ All {count} quotes validated verbatim.",
        "log_json_err": "⚠️ JSON Parsing Error: {err}. Retrying...",
        "log_mesh_start": "🧬 Commencing Post-Build Strict Reiterative MeSH Verification...",
        "log_mesh_verify": "🔍 MeSH Check: Verifying exact phrase matches against NLM database for {count} terms...",
        "log_mesh_pass1": "  🟢 Round 1 Pass: \"{term}\" is verified in MeSH database.",
        "log_mesh_fail1": "  🟡 Round 1 Fail: \"{term}\" unverified. Suggestions: [{sugg}]",
        "log_mesh_loop": "⚠️ MeSH Alignment Loop (Attempt {att}/{max}): Aligning & Re-Verifying {count} terms...",
        "log_mesh_pass3": "  🟢 Round 3 Pass (Veridical Enforcement): AI suggestion \"{sugg}\" verified against database.",
        "log_mesh_ai_fail": "⚠️ MeSH alignment prompt failed on attempt {att}: {err}",
        "log_mesh_pruned": "✂️ Pruned {count} logic gate(s) that failed strict MeSH verification.",
        "log_mesh_aligned": "🧬 Re-aligned {count} node(s) with verified MeSH tags.",
        "log_mesh_done": "✅ MeSH alignment & strict verification complete.",
        "log_dp_gen": "📊 Generating autonomous visual reports for Custom Datapoints...",
        "log_dp_arch": "🧠 Architecting MVC report for custom datapoint: {label}...",
        "log_dp_compiled": "✅ Custom visual report compiled for [{label}]",
        "log_dp_failed": "⚠️ Failed to build custom report for {label}: {err}",
        "log_append_trace": "\n➕ APPENDING TO EXISTING TRACE...",
        "log_run_start": "\n🚀 === STARTING BUILD RUN [{run}/{max}] ===",
        "log_agi_selecting": "🧠 Smart FollowUp: AGI is selecting analytical reports from the Print Menu...",
        "log_agi_selected": "🤖 AGI selected modules: {mods}",
        "log_agi_fail_sel": "⚠️ AGI module selection failed. Falling back to default modules.",
        "log_agi_0_fb": "⚠️ Previous run returned 0 results. Forcing AGI fallback to preserve topic focus...",
        "log_agi_dp_inj": "🤖 AGI successfully injected {count} new custom datapoints into Prompt Settings.",
        "log_agi_roll_hit": "🎲 Respect Check ({pct}%): ROLL HIT. Overriding AGI suggestion to maintain original intent.",
        "log_agi_theory_orig": "🎯 Smart FollowUp Theory (Run {run}): \"{claim}\" (Forced Original)",
        "log_agi_roll_miss": "🎲 Respect Check ({pct}%): ROLL MISSED. Permitting AGI to drift to new hypothesis.",
        "log_agi_theory_agi": "🎯 Smart FollowUp Theory (Run {run}): \"{claim}\" (AGI Suggested)",
        "log_agi_parse_fail": "⚠️ AGI JSON parsing failed. Falling back to original claim.",
        "log_auto_explore": "🧠 AutoExplore: Generating novel hypothesis based on topic...",
        "log_auto_theory": "🎯 Hypothesis {run}: \"{claim}\"",
        "log_fetch_matrix": "\n--- Fetching Matrix Evidence Set [{cur}/{max}] based on: {src} ---",
        "log_use_custom_ev": "📚 Using Custom Evidence Set. Bypassing API fetch.",
        "log_eval_penta": "\n--- Evaluating Pentamatrix: {penta} using Evidence from {src} (Eval {cur}/{max}) ---",
        "log_proc_penta": "\n--- Processing Pentamatrix[{cur}/{max}]: {penta} ---",
        "log_run_comp": "⚙️ Build Run [{run}] complete. Compiling intermediate reports and updating context...",
        "log_flex_exec": "⚙️ Executing Flexible Mode Custom Command...",
        "log_flex_gen": "✅ Flexible Mode Custom Report generated.",
        "log_ds_comp": "✅ Unified Dataset complete. Total unique nodes stored: {count}",
        "log_wf_cancel": "🛑 Workflow cancelled by user.",
        "log_fat_err": "❌ Fatal Error: {err}",
        "log_demo_gen": "🧪 Demo Mode: Generating a hypothetical complex patient inquiry...",
        "log_post_sync": "🌐 Node successfully synchronized",
        "log_post_fail": "❌ Post failed: {err}",
        "log_trace_merged": "🔗 Merged {count} new Pentamatrices successfully! (Duplicates skipped)",
        "log_mvc_rend": "✅ MVC Decoupled Report '{title}' rendered successfully.",
        "log_mvc_fail": "❌ Failed to parse MVC JSON: {err}",
        "log_crash_rec": "💡 Crash-Proof Recovery: Found an autosaved session from {time} with {count} completed nodes. Click 'Restore Session' to load it.",
        "ui_btn_connect_api": "🔑 Connect API Key",
        "ui_status_offline": "⚠️ Offline Mode (Trace Viewer Only)",
        "ui_placeholder_offline_assistant": "API connection skipped. AI assistant is unavailable.",
        "ui_btn_posting": "Posting...",
        "ui_btn_post_trace": "🌐 Post Trace",
        "ui_claim_label_instruct": "Tell {name} what to learn about.",
        "lbl_categories": "Categories",
        "lbl_custom_analysis": "CUSTOM ANALYSIS",
        "lbl_global_data_metrics": "Global Data Metrics",
        "lbl_executive_analysis": "Executive Analysis",
        "lbl_distribution_overview": "Distribution Overview",
        "lbl_unknown": "Unknown",
        "lbl_unknown_date": "Unknown Date",
        "log_offline_mode": "Offline mode activated. You can now load or merge external traces.",
        "log_indexeddb_fail": "IndexedDB Progressive Autosave failed: {err}",
        "toast_ctx_truncated": "Context truncated to fit limits.",
        "toast_chat_trunc": "Chat history truncated ({mode} mode).",
        "log_trace_rec_db": "💡 Trace session recovered successfully from IndexedDB autosave.\n",
        "toast_trace_merged": "Trace merged!",
        "err_parse_penta": "Failed to parse pentamatrix JSON. Please check claim format.",
        "err_missing_json": "Missing JSON block.",
        "err_quota_exhausted": "API Quota Exhausted (5x 429)",
        "err_parse_trace_json": "Failed to parse trace JSON.",
        "err_invalid_trace_format": "Invalid trace file format.",
        "err_merge_trace_json": "Failed to merge trace JSON.",
        "err_ellipses": "Ellipses (...) are strictly forbidden. You must quote continuous text exactly character-for-character.",
        "err_strict_misquote": "Strict Misquote Detected! The exact character sequence \"{quote}...\" was NOT found in the provided text. Do NOT truncate, paraphrase, or edit quotes.",
        "bib_abs_unavailable": "Abstract not available.",
        "bib_anonymous": "Anonymous",
        "bib_unknown_source": "Unknown Source",
        "bib_wiki_contributors": "Wikipedia Contributors",
        "bib_wiki_encyclopedia": "In Wikipedia, The Free Encyclopedia.",
        "bib_arxiv_preprint": "arXiv preprint.",
        "bib_cit_data_unavail": "Citation data unavailable.",
        "lbl_bypassed": "Bypassed",
        "lbl_custom_evidence": "CUSTOM_EVIDENCE",
        "log_strict_audit_start": "🔍 Strict Mode: Running final logic & veridical audit on quadrant...",
        "log_strict_audit_pass": "✅ Final logic audit passed.",
        "log_strict_audit_fail": "❌ Final logic audit failed: {feedback}",
        "log_strict_audit_parse_fail": "⚠️ Final logic audit parsing failed, forcing retry...",
        "err_audit_parse": "\n⚠️ FINAL AUDIT PARSE ERROR: You must output strictly valid JSON.\n",
        "err_audit_failed": "\n⚠️ FINAL AUDIT FAILED (Hallucinated External Knowledge/Logic/Contradiction):\n{feedback}\n",
        "warn_context_truncated": "[WARNING: CONTEXT TRUNCATED]",
        "warn_ctx_data_truncated": "[WARNING: SELECTED CONTEXT DATA TRUNCATED TO FIT WORKSPACE LIMIT]",
        "log_ctx_data_truncated": "⚠️ Context data truncated to {limit} chars to fit workspace limit.",
        "lbl_ctx_synthesis": "--- SYNTHESIS DELIVERABLES ---",
        "lbl_ctx_valid_quotes": "--- VALIDATED QUOTES ---",
        "lbl_ctx_failed_quotes": "--- FAILED QUOTES ---",
        "lbl_ctx_master_quote_log": "--- MASTER QUOTE LOG ---",
        "lbl_ctx_raw_evidence": "--- RAW EVIDENCE ---",
        "lbl_ctx_citations": "--- CITATIONS ---",
        "lbl_ctx_analytics": "--- ANALYTICS (KEYWORDS) ---",
        "lbl_ctx_logic_gates": "--- LOGIC GATES ---",
        "lbl_ctx_semantic_tags": "--- SEMANTIC TAGS ---",
        "lbl_ctx_ai_thoughts": "--- AI THOUGHTS LOG ---",
        "lbl_ctx_report": "--- REPORT: {title} ---",
        "lbl_ctx_agg_dp": "--- AGGREGATED DATAPOINT: {key} ---",
        "lbl_ctx_custom_ev": "--- CUSTOM LOADED RAW EVIDENCE DOCUMENTS ---",
        "lbl_prev_conv_history": "--- PREVIOUS CONVERSATION HISTORY ---",
        "lbl_prev_conv_trunc": "--- PREVIOUS CONVERSATION HISTORY (TRUNCATED) ---",
        "warn_chat_hist_trunc": "[WARNING: CHAT HISTORY EXCEEDED ALLOCATED MEMORY LIMIT]",
        "log_chat_hist_trunc": "⚠️ Chat history truncated to {limit} chars ({mode} mode).",
        "lbl_history_none": "None yet. Explore the most prominent core mechanism first.",
        "lbl_user_request": "User Request: {query}",
        "log_assistant_retry": "🔄 Assistant Retry {att}/{max} applying QA feedback...",
        "log_assistant_audit": "🔍 Auditing Assistant response (Attempt {att})...",
        "log_assistant_audit_pass": "✅ Assistant response passed veridical audit.",
        "log_assistant_audit_fail": "❌ Assistant response failed audit: {feedback}",
        "err_qa_verifier_parse": "Your previous response was rejected. The QA Verifier failed to parse the verification. Please ensure you output standard text clearly answering the user.",
        "log_audit_parse_fail": "⚠️ Audit parsing failed, retrying...",
        "lbl_ai_report": "AI Report",
        "lbl_canceled_by_user": "Canceled by user.",
        "lbl_error": "Error: {err}",
        "lbl_no_recent_logs": "No recent logs fit within this memory threshold limit.",
        "lbl_interaction": "Interaction {num}",
        "lbl_metadata_mode": "Metadata: Mode=",
        "lbl_context_chars": "Context Chars=",
        "lbl_history_chars": "History Chars=",
        "lbl_full_ctx_window": "📥 FULL CONTEXT WINDOW snapshot (System rules + Context Data + History sent to AI):",
        "lbl_output_generated": "📤 OUTPUT GENERATED (Raw Response):",
        "print_agg_json_title": "Aggregated JSON",
        "print_report_title": "Pathmap Report Print",
        "print_module_title": "Pathmap Print Module",
        "print_generated_by": "Generated by {name} {notice}",
        "print_a_user": "a user",
        "print_copyright_notice": "Created by Joshua Dungan, Artificial General Intelligence LLC, Grand Rapids, MI. Licensed under Apache 2.0.",
        "prompt_custom_dp_header": "### [CUSTOM DATAPOINTS]\nCRITICAL EXTRACTION DIRECTIVE: You MUST extract the following custom datapoints as root-level key/value pairs inside your final JSON block:\n",
        "log_val_key": "Validating Key...",
        "log_key_fail": "Key validation failed.",
        "log_trace_load_file": "💡 Trace loaded successfully from file.\n",
        "log_trace_rec_db": "💡 Trace session recovered successfully from IndexedDB autosave.\n",
        "log_sess_ready": "Session ready. Connected to {prov} provider.",
        "log_q_verif": "  🟢 Quote Verified [Library ID: {id}]: \"{quote}...\"",
        "log_q_mismatch": "  🔴 Quote Mismatch [ID: {id}]: \"{quote}...\"",
	"label_key_loaded": "✅ Status: Key loaded for: ",
        "toast_model_switched": "Model switched to {model}",
        "toast_dp_saved": "✅ Custom Datapoints Saved to Prompt Settings!",
        "toast_ps_saved": "✅ Prompt settings saved!",
        "toast_no_ps_keys": "No valid prompt keys found in file.",
        "toast_ps_loaded": "✅ {count} prompts loaded and updated.",
        "toast_err_parse": "Error parsing JSON file: {err}",
        "toast_ps_exported": "📥 Prompt settings exported!",
        "toast_claim_appended": "Claim appended.",
        "toast_evi_loaded": "Custom Evidence Loaded. API abstract fetching will be bypassed.",
        "toast_cmd_uploaded": "Flexible Command Uploaded.",
        "toast_pipe_complete": "Pipeline complete!",
        "toast_pipe_crashed": "Pipeline crashed. See log.",
        "toast_wk_ready": "✅ PathMap Studio ready!",
        "toast_val_failed": "Validation failed.",
        "toast_copied": "📋 Copied human-readable text!",
        "toast_copy_failed": "Copy failed.",
        "toast_nothing_export": "Nothing to export yet.",
        "toast_trace_exported": "📥 Trace Exported successfully!",
        "toast_enter_url": "Enter a valid URL endpoint",
        "toast_node_pub": "Node published successfully!",
        "toast_post_failed": "Post failed: {err}",
        "toast_trace_restored": "✅ Trace state restored safely!",
        "toast_trace_merged": "Trace merged!",
        "toast_state_rec": "✅ State recovered securely!",
        "toast_api_req": "API key required.",
        "toast_enter_claim": "Enter a claim.",
        "toast_wf_cancel": "Workflow cancelled.",
        "toast_sel_ctx": "Select at least one context target.",

        "ui_stream_wait": "Pipeline data will show here",

        "ui_token_tracker": "🪙 <strong>Session:</strong> {sess} | <strong>Trace Accumulation:</strong> {trace}",
        "ui_ps_purpose": "<strong>Purpose:</strong> {purpose}<br><strong>When Used:</strong> {used}",
       "ui_authorship_header": "{watermark} &middot; <strong>Date:</strong> {date}<br><strong>Mode:</strong> {mode} ({rigor}) &middot; <strong>Format:</strong> {format} &middot; <strong>Library:</strong> {lib}",
        "ui_authorship_loaded": "<strong>Loaded Trace Prepared by:</strong> {name} &middot; <strong>Date:</strong> {date}",
        "ui_authorship_restored": "<strong>Restored Trace Prepared by:</strong> {name} &middot; <strong>Date:</strong> {date}",
        "ui_stream_wait": "✨ Pipeline output will stream here...",
        "ui_log_ready": "💡 Ready.",
        
        "ui_assist_user": "User:",
        "ui_assist_ai": "Assistant:",
        "ui_assist_cancel": "Canceled by user.",
        "ui_assist_err": "Error: {err}",
        "ui_assist_thinking": "🤔 AI is analyzing the dataset...",
        "ui_opt_agg_json": "💻 Aggregated JSON: {key}",
        "ui_opt_ai_report": "✨ {title} (AI)",
        "ui_opt_dp_report": "✨ {label} (Datapoints Report)",
        "ui_opt_flex_report": "✨ Flexible Custom Report",
        "ui_flex_quad_title": "Flexible Custom Report",
        "ui_quad_title": "{penta} Evidence Set Assessment",
        "ui_ext_dp_title": "🎯 Extracted Custom Datapoints",
        "ui_gates_title": "{penta} Chain",
        "ui_mast_map_title": "MASTER SYSTEMS MAP (ALL EVIDENCE CHAINS)",

        "mvc_err_title": "INSUFFICIENT TRACE DATA",
        "mvc_err_desc": "This visualization requires sequential Matrix/Semmelweis data. The current trace contains single-node analyses.",
        "mvc_lbl_quads": "Quadrants",
        "mvc_lbl_abs": "Unique Abstracts",
        "mvc_lbl_cites": "Mapped Citations",
        "mvc_lbl_avg": "Avg Metrics (A/C/C)",
        "mvc_lbl_orig": "Original",
        "mvc_lbl_adv": "Adversarial",
        "mvc_lbl_align": "Alignment",
        "mvc_lbl_cons": "Consilience",
        "mvc_lbl_conf": "Confidence",
        "mvc_lbl_dyn_tension": "Dynamic Tension delta: {delta}",
        "mvc_lbl_no_logic": "No logic chains available in trace data.",
        "mvc_lbl_no_gap": "No gap strength metrics available.",
        "mvc_lbl_total": "Total: {total}",
        "mvc_lbl_no_cent": "No centrality metrics available.",
        "mvc_lbl_no_tags": "No tags available to plot attractor.",
        "mvc_lbl_hyp_tens": "Hypothesis Tension Vector Network",
        "mvc_lbl_no_conf": "No pathway contradictions or directional conflicts found in active logic networks.",
        "mvc_lbl_conf_edge": "Conflicting Logic Edge",
        "mvc_lbl_used_rel": "Used Relationships",
        "mvc_lbl_assess": "Assessment",
        "mvc_lbl_true_dir": "True directional (+ vs -) conflict verified.",
        "mvc_lbl_no_bot": "No significant bottlenecks or unresolved gaps found.",
        "mvc_lbl_gap": "{str} Gap",
        "mvc_lbl_no_just": "No justification parsed.",
        "mvc_lbl_no_kw": "No keywords available.",
        "mvc_lbl_no_abs": "No abstracts loaded.",
        "mvc_lbl_lit_src": "Literature Source Breakdown (Total: {total})",
        "mvc_lbl_no_yr": "No publication year citations mapped in active trace.",
        "mvc_lbl_avg_tier": "Average Confidence Tier: {avg}/7.0",
        "mvc_lbl_sys_trans": "Systems Translation Readiness",
        "mvc_lbl_met_param": "Metrics Parameter",
        "mvc_lbl_score": "Score",
        "mvc_lbl_assess_stat": "Assessment Status",
        "mvc_lbl_tot_ver": "Total Verification Attempts",
        "mvc_lbl_self_cor": "Self-correction iterations executed",
        "mvc_lbl_pass_q": "Passed Quotes (Character-Perfect)",
        "mvc_lbl_100_ver": "🟢 100% Verbatim compliance",
        "mvc_lbl_fail_q": "Failed Quotes (Mismatches Resolved)",
        "mvc_lbl_hal_prun": "🔴 Hallucinations caught & pruned",
        "mvc_lbl_no_pie": "No data provided for pie chart.",
        "mvc_lbl_no_bar": "No data provided for bar chart.",
        "mvc_lbl_no_ev": "No events provided.",
        "mvc_lbl_no_mat": "No matrix data provided.",

        "print_agg_json": "Aggregated JSON",
        "print_synth_deliv": "Synthesis Deliverable",
        "print_sem_tags": "Semantic Tags & Attractor",
        "print_att_graph": "Attractor Graph",
        "print_tag_cloud": "Tag Cloud",
        "print_logic_gates": "Logic Gates (Per-Pentamatrix)",
        "print_mast_pathmap": "Master PathMap",
        "print_ev_set": "Evidence Set (Raw Abstracts)",
        "print_no_ev": "No evidence loaded.",
        "print_vq": "✅ Validated Verbatim Quotes (PASS)",
        "print_no_vq": "No valid quotes found.",
        "print_att_penta": "Attempt {att} - Pentamatrix: {penta}",
        "print_quote": "Quote:",
        "print_src_abs": "Source Abstract:",
        "print_fq": "❌ Failed Quotes (Log of all infinite retries)",
        "print_no_fq": "No failed quotes found.",
        "print_err": "Error:",
        "print_mq_log": "📋 Master Quote Log (PASS/FAIL)",
        "print_no_q_data": "No quote data.",
        "print_attempt": "Attempt {att}",
        "print_data_an": "📊 Dataset Analytics & Reports",
        "print_no_data": "No data available.",
        "print_top_sem": "Top Semantic Keywords (Metadata)",
        "print_kw": "Keyword",
        "print_freq": "Frequency",
        "print_sys_node": "Systems Node Centrality",
        "print_ent_node": "Entity / Node",
        "print_deg_conn": "Degree (Connections)",
        "print_lit_gap": "Literature Gap Analysis (Logic Gates)",
        "print_from_node": "From Node",
        "print_rel": "Relation",
        "print_to_node": "To Node",
        "print_gap_str": "Gap Strength",
        "print_ev_age": "Evidence Age Distribution",
        "print_pub_yr": "Publication Year",
        "print_count": "Count",
        "print_ref_list": "Reference List (APA)",
        "print_ref_sub": "Alphabetical and formatting strictly enforced.",
        "print_no_ref": "No verified citations have been mapped to the report yet.",
        "print_raw_json": "Raw JSON Metrics Trace",
        "print_prompt_doc": "Prompts Documentation",
        "print_purpose": "Purpose:",
        "print_when_used": "When Used:",
        "print_ai_thoughts": "🧠 AI Thoughts Log",
        "print_ai_th_sub": "Internal reasoning from the AI engine during RAG evaluation.",
        "print_penta": "Pentamatrix: {penta}",
        "print_no_th": "No internal thought data recorded for this pentamatrix.",
        "print_chat_trace": "💬 Prompt / Thought / Response Trace",
        "print_sys_usr_pmpt": "📥 System & User Prompt",
        "print_ai_int_reas": "🧠 AI Internal Reasoning",
        "print_fin_out": "📤 Final Output",
        "print_sys_bld_log": "🛠️ System Build Log",
        "print_meta": "Metadata",
        "print_orig_claim": "Original Claim:",
        "print_invest": "Investigator:",
        "print_date": "Date:",
        "print_settings": "Settings:",
        "print_ex_log": "Execution Log",
        "print_raw_eval": "Raw Evaluation Prompt",
        "print_raw_mod_resp": "Raw Model Response",

   "ui_cb_chatlog_history": "Enable Conversation Memory",
    "ui_cb_semantic_drift": "Allow Semantic Drift (Broad AI Knowledge)",
    "ui_lbl_assistant_chatlog": "Assistant Chat History Log",

        "ui_mvc_tier": "TIER: {tier}",
        "ui_mvc_sys_rep": "SYSTEMS REPORT",
"ui_page_title": "PathMap Studio™",
        "ui_h1_main": "Universal AI Workbench™",
        "ui_h1_small": "PathMap Studio™ v1.0 - Open Source (Apache 2.0), software by Joshua Dungan, Artificial General Intelligence LLC, Grand Rapids, Michigan.",
        "ui_status_no_key": "🔑 API Key required to initialize PathMap Studio",
        "opt_gemini_31_pro": "Gemini 3.1 Pro",
        "opt_gemini_31_flash_lite": "Gemini 3.1 Flash-Lite",
        "opt_gemini_3_flash_preview": "Gemini 3 Flash (Preview)",
        "opt_gemma_4_31b": "Gemma 4 31B IT",
        "opt_gemma_4_26b": "Gemma 4 26B IT",
        "opt_gemini_25_pro": "Gemini 2.5 Pro",
        "opt_gemini_25_flash": "Gemini 2.5 Flash",
        "opt_gemini_25_flash_lite": "Gemini 2.5 Flash-Lite",
        "ui_link_ss": "Website",
        "ui_link_faq": "Frequently asked questions",
        "ui_link_create": "Gallery",
        "ui_link_download": "Shop",
        "ui_link_members": "Members",
        "ui_link_license": "License",
        "ui_btn_custom_dp": "Custom Datapoints",
        "ui_btn_prompt_settings": "Prompt Settings",
        "ui_panel_controls": "Control Center",
        "ui_lbl_analysis_mode": "Analysis Mode",
        "opt_mode_social": "Pathmap Mini",
        "opt_mode_phenotype": "Phenotype",
        "opt_mode_semmelweis": "Semmelweis Adversarial",
        "opt_mode_matrix": "Pentamatrix 5x5",
        "opt_mode_pathmapper": "PathMapper",
        "opt_mode_forensic": "Forensic",
        "opt_mode_alignment": "Alignment",
        "opt_mode_flexible": "Flexible",
        "ui_lbl_library": "Target Library",
        "opt_lib_pubmed": "PubMed",
        "opt_lib_openalex": "OpenAlex",
        "opt_lib_wiki": "Wikipedia",
        "opt_lib_arxiv": "arXiv",
        "ui_lbl_format": "Output Format",
        "opt_fmt_standard": "Standard Layout",
        "opt_fmt_preprint": "Preprint Format",
        "opt_fmt_clinical": "Clinical Format",
        "ui_lbl_length": "Output Length",
        "opt_len_concise": "Concise",
        "opt_len_standard": "Standard",
        "opt_len_comprehensive": "Comprehensive",
        "ui_lbl_flexible_cmd": "Flexible Custom Command",
        "ui_placeholder_flex": "Describe the custom action or analysis you want to execute...",
        "ui_btn_upload_flex": "Upload Context Ref (.txt)",
        "ui_lbl_rigor": " RAG Persona Rigor",
        "opt_rigor_heuristic": "Heuristic (Discovery)",
        "opt_rigor_strict": "Strict (Verification)",
        "ui_lbl_semantic": "Semantic Tag Cloud",
        "opt_sem_on": "Enabled",
        "opt_sem_off": "Disabled",
        "ui_lbl_agents": "Autonomous Research Agents",
        "ui_cb_auto_explore": "Auto-Discovery",
        "ui_cb_smart_follow": "Artificial General Intel Mode",
        "ui_lbl_breadth": "Search Breadth (Queries)",
        "ui_lbl_depth": "Search Depth (Docs/Query)",
        "ui_lbl_quotes": "Quotes Limit (Per Source)",
        "ui_lbl_evals": "Evaluations per Run",
        "ui_lbl_respect": "% Chance to Re-focus on each run (AGI mode only)",
        "ui_lbl_max_context": "Maximum Context Limit (chars)",
        "ui_placeholder_context": "e.g., 500000",
        "ui_lbl_runs": "Number of Runs",
        "ui_lbl_investigator": "Investigator Name",
        "ui_placeholder_investigator": "e.g., Dr. Jane Doe",
        "ui_lbl_affiliation": "Affiliation",
        "ui_val_affiliation": "Independent Researcher",
        "ui_lbl_copyright": "Copyright Declaration",
        "ui_placeholder_copyright": "Copyright PathMap.org",
        "ui_val_copyright": "Custom",
        "ui_warn_context": "⚠️ Be mindful of your context limits and rate limits!",
        "ui_lbl_claim_normal": "Research Premise / Primary Hypothesis",
        "ui_placeholder_claim_normal": "Type something...",
        "ui_lbl_claim_explore": "Auto-Explore Discovery Seed",
        "ui_placeholder_claim_explore": "Enter a broad physiological topic or seed keyword...",
        "ui_btn_launch": "🚀 Start Training",
        "ui_btn_demo": "🧪 Load Demo Case",
        "ui_btn_append_claim": "Append Claim Document",
        "ui_btn_load_evidence": "Load Custom Evidence",
        "ui_cb_add_trace": "Append to Active Trace",
        "ui_cb_autosave": "Progressive Autosave",
        "ui_btn_cancel": "🛑 Abort Workflow",
        "ui_btn_clear": "🧹 Reset and Start Over",
        "ui_btn_load_trace": "📂 Load Trace File",
        "ui_btn_restore": "💾 Restore Session",
        "ui_btn_merge": "🔗 Merge Trace File",
        "ui_placeholder_post_url": "https://api.example.com/sync",
        "ui_btn_post": "🌐 Publish to your custom API (advanced)",
        "ui_panel_log": "System Execution & Validation Log",
        "ui_btn_edit_pheno": "Configure Phenotypic Mappings",
        "ui_panel_assistant": "AI research agent chat...",
        "ui_assist_desc": "Chat with your AI model",
        "ui_lbl_ctx_target": "Select Context Sources for Assistant",
        "ui_lbl_load_prompt": "Load Assistant Template",
        "opt_assist_custom": "Custom Instructions / Direct Query",
        "opt_assist_exec": "Veridical Check",
        "opt_assist_explain": "Simplify Findings for General Public",
        "opt_assist_contradict": "Write Preprint",
        "ui_placeholder_assist": "Ask the Assistant about logic anomalies, evidence gaps, or synthesis...",
        "ui_btn_ask_ai": "💬 Query Assistant",
        "ui_btn_cancel_ai": "🛑 Cancel AI",
        "ui_panel_result": "Rendered Delivery Engine",
        "opt_print_all": "Compile Entire Session",
        "opt_print_pathmap": "Module: System PathMap Network",
        "opt_print_json": "Module: Standardized JSON Block",
        "opt_print_synth": "Module: Synthesis Deliverable",
        "opt_print_cite": "Module: Consolidated Reference List (APA)",
        "opt_print_evi": "Module: All Shared Evidence Abstracts",
        "opt_print_mq_log": "Module: Quote Validation Logs",
        "opt_print_vq": "Module: Verbatim Quotes (Verified)",
        "opt_print_fq": "Module: Quote Failures (Pruned)",
        "opt_print_cloud": "Module: Semantic Tag Attractor",
        "opt_print_gates": "Module: Detailed Logic Chains",
        "opt_print_analytics": "Module: Advanced Dataset Analytics",
        "opt_print_prompts": "Module: Active System Prompt Blocks",
        "opt_print_buildlog": "Module: Pipeline Execution Logs",
        "opt_print_thoughts": "Module: AI Internal Reasoning",
        "opt_print_chat": "Module: Prompt/Response Trace",
        "opt_print_chatlog": "Module: Assistant Chatlog",
        "ui_btn_do_print": "🖨️ Print Module",
        "ui_btn_copy": "📋 Copy Readable text",
        "ui_btn_export": "📥 Export Session Trace (.json)",
        "ui_mod_attractor": "Tag Attractor Graph",
        "ui_mod_cloud": "Semantic Tag Cloud",
        "ui_mod_gates": "Active Logic Chain Verification",
        "ui_mod_pathmap": "Global Systems Pathway Map",
    "ui_lbl_lang_override": "🌐 🎌 🚩 🔤 Language / Idioma / Wika / Γλώσσα (Type: Greek, Tagalog, Spanish...)",
    "ui_placeholder_lang_override": "Type a language...",
        "ui_footer_note": "For security, your keys are stored in ephemeral memory and are never transmitted or stored.  Refreshing the page will cause the key to erase from memory. Progressive autosaves use isolated browser IndexedDB storage.",
        "modal_api_title": "Initialize PathMap Studio Session",
        "modal_api_desc": "Configure your AI provider to begin analysis. Key is stored locally.",
        "ui_lbl_provider": "AI Engine Provider",
        "opt_prov_gemini": "Google AI Studio",
        "opt_prov_openai": "OpenAI Platform",
        "opt_prov_openrouter": "OpenRouter API",
        "opt_prov_local": "LocalHost (Ollama / vLLM)",
        "opt_prov_custom": "Custom OpenAI-Compatible API Endpoint",
        "ui_lbl_key_gemini": "API Key",
        "ui_placeholder_key_gemini": "Enter your API credential key...",
        "ui_lbl_key_openai": "OpenAI Key",
        "ui_placeholder_key_openai": "",
        "ui_lbl_key_openrouter": "OpenRouter Key",
        "ui_placeholder_key_openrouter": "",
        "ui_lbl_key_local": "API Key (Optional)",
        "ui_placeholder_key_local": "Enter key if endpoint requires authorization...",
        "ui_placeholder_base_url": "e.g., http://localhost:11434/v1",
        "ui_placeholder_model_name": "e.g., llama3:latest",
        "ui_lbl_ai_model": "Primary Active LLM",
        "ui_btn_start_sess": " Connect and Begin",
        "ui_link_get_key": "No Key?  Click here!",
        "modal_dp_title": "Custom Analytical Datapoint Schema",
        "modal_dp_desc": "Define target-level properties for dynamic RAG extraction rules.",
        "ui_ph_dp_key": "e.g., zinc_affinity",
        "ui_ph_dp_label": "e.g., Zinc Affinity",
        "ui_ph_dp_instr": "e.g., Describe binding affinity to zinc ions.",
        "ui_btn_add_dp": "➕ Add Target Datapoint",
        "ui_warn_dp": "⚠️ Injection rules will be appended to prompt settings instructions.",
        "ui_btn_cancel_gen": "Cancel Changes",
        "ui_btn_inject": "💾 Apply Target Rules",
        "modal_ps_title": "System Prompt Configurations",
        "modal_ps_desc": "Edit agent core personas, pipeline parameters, and response schemas.",
        "ui_btn_save_apply": "💾 Save & Apply Prompts",
        "ui_btn_load_json": "📂 Load Prompts Schema (.json)",
        "ui_btn_export_json": "📥 Export Active Prompts Schema",
        "modal_lic_title": "Instructions, Manifesto, and License/Terms",
       "ui_btn_close": "Close Dialog",
        "ui_sponsor_msg_1": "Welcome to Pathmap!",
        "ui_sponsor_msg_2": "Custom Message 2",
        "ui_sponsor_msg_3": "Custom Message 3",
        "ui_sponsor_msg_4": "Custom Message 4",
        "ui_sponsor_msg_5": "Custom Message 5"
      };

      
    // Helper for injecting LANG strings safely
    function L(key, replacements = {}) {
        let str = LANG[key] || `[[[${key}]]]`;
        for (let r in replacements) {
            str = str.replace(new RegExp(`\\{${r}\\}`, 'g'), replacements[r]);
        }
        return str;
    }

function translateUI() {
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        
        // Translate text nodes
        for (let j = 0; j < el.childNodes.length; j++) {
            const node = el.childNodes[j];
            if (node.nodeType === 3) { // Text Node
                // Cache original template on the first pass
                if (node._originalValue === undefined) {
                    node._originalValue = node.nodeValue;
                }
                
const text = node._originalValue;
                        if (text.includes('[[[')) {
                            const updated = text.replace(/\[\[\[([a-zA-Z0-9_]+)\]\]\]/g, (match, key) => {
                                return LANG[key] !== undefined ? LANG[key] : match;
                            });

 if (text.includes('ui_sponsor_msg') && el) {
                            // Blank out original text node value to prevent duplication, then parse raw HTML
                            node.nodeValue = "";
			    el.innerHTML = DOMPurify.sanitize(updated);
                        } else if (node.nodeValue !== updated) {
                            node.nodeValue = updated;
                        }

                        }

            }
        }
        
        // Translate attributes (placeholder, title, value)
        const attrs = ['placeholder', 'title', 'value'];
        attrs.forEach(attr => {
            if (el.hasAttribute(attr)) {
                // Initialize cache object for attributes if not present
                el._originalAttrs = el._originalAttrs || {};
                
                // Cache original template attribute value on the first pass
                if (el._originalAttrs[attr] === undefined) {
                    el._originalAttrs[attr] = el.getAttribute(attr);
                }
                
                const val = el._originalAttrs[attr];
                if (val.includes('[[[')) {
                    const updated = val.replace(/\[\[\[([a-zA-Z0-9_]+)\]\]\]/g, (match, key) => {
                        return LANG[key] !== undefined ? LANG[key] : match;
                    });
                    if (el.getAttribute(attr) !== updated) {
                        el.setAttribute(attr, updated);
                    }
                }
            }
        });
    }

    // SURGICAL FIX: Force the Toon card to update with the translated dictionary
    if (typeof initToonStyles === 'function') {
        initToonStyles();
    }
}

  async function safeFetchEutils(url, signal, delay = 800) {
        let attempts = 0;
        while (attempts < 5) {
            try {
                const resp = await fetch(url, { signal });
                if (resp.status === 429) {
                    addLog(L('log_ncbi_rate'), true);
                    await new Promise(r => setTimeout(r, 1500 * (attempts + 1)));
                    attempts++;
                    continue;
                }
                if (!resp.ok) throw new Error("HTTP " + resp.status);
                const data = await resp.json();
                await new Promise(r => setTimeout(r, delay));
                return data;
            } catch (err) {
                if (err.name === 'AbortError') throw err;
                attempts++;
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        return null;
    }

function syncDatapointsFromPromptDirective() {
        const content = PROMPT_SETTINGS.custom_datapoints_directive.content || "";
        const lines = content.split('\n');
        activeCustomDatapoints.length = 0; // Fix: Clears the array while preserving memory reference
        
        lines.forEach(line => {
            // Fix: Relaxed regex allows spaces in keys just in case AGI generates them
            const match = line.match(/^\s*[-*]\s*"?([^":]+)"?\s*:\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                const instruction = match[2].trim();
                const label = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                activeCustomDatapoints.push({ key: key, label: label, instruction: instruction });
            }
        });
    }

mermaid.initialize({ startOnLoad: false, theme: 'default', flowchart: { htmlLabels: false } });

       let PROMPT_SETTINGS = {
  "research_veridical_check": {
    "name": "Research Veridical Verification",
    "purpose": "Audits the final research response after quotes pass to ensure absolute veridicality, logical consistency, and zero hallucinated external knowledge.",
    "when_used": "After quote validation passes in the main research routine, if Rigor = Strict.",
    "content": "You are a strict QA Audit AI. Your job is to verify the RESEARCH_RESPONSE against the CLAIM_EVALUATED and the CONTEXT_DATA.\n\nCRITICAL RULES FOR EVALUATION:\n1. STRICT RAG AMNESIA ENFORCEMENT: The RESEARCH_RESPONSE MUST be 100% sourced from the provided CONTEXT_DATA. Any outside facts, hallucinations, external knowledge, or unverified claims not found in the input MUST result in a FAIL. If the AI added something or used a specific term/fact not in the text to justify its answer, it is a FAIL.\n2. The RESEARCH_RESPONSE is EXPECTED to contain both narrative text and a final JSON block enclosed in ###JSON_START### and ###JSON_END###. Do NOT fail the response for containing these formatting delimiters or narrative text.\n3. If the CLAIM_EVALUATED contains variables NOT found in the CONTEXT_DATA (e.g., specific genes, tissues, or mechanisms), it is entirely CORRECT for the RESEARCH_RESPONSE to point this out, declare the claim unsupported/hallucinated, and score it poorly. This is a successful evaluation and MUST be scored as a PASS.\n4. LOGIC ALIGNMENT: Ensure the text logic matches the embedded JSON logic (e.g., if the text says the claim is false, the Alignment score should be low).\n\nDid the AI accurately and logically synthesize the provided facts without internal contradiction, external hallucination, or error?\n\nReturn ONLY a valid JSON object. Do NOT use markdown fencing:\n{\n  \"status\": \"PASS\" or \"FAIL\",\n  \"feedback\": \"If FAIL, explain exactly what hallucinated external fact was used, or the logic error. If PASS, leave empty.\"\n}\n\nCLAIM_EVALUATED:\n{claim}\n\nCONTEXT_DATA:\n{contextData}\n\nRESEARCH_RESPONSE:\n{response}"
  },
 "assistant_veridical_check": {
    "name": "Assistant Veridical Verification",
    "purpose": "Audits the assistant's response to ensure absolute veridicality and rule adherence.",
    "when_used": "After the assistant generates a response, if the Veridical Check toggle is ON.",
    "content": "You are a strict QA Audit AI. Your job is to verify the ASSISTANT_RESPONSE against the USER_QUERY and the CONTEXT_DATA.\n\nCRITICAL RULES FOR EVALUATION:\n1. DRIFT MODE CHECK (Currently: {driftMode}): If OFF, STRICT RAG AMNESIA IS ENFORCED: The ASSISTANT_RESPONSE MUST be 100% sourced from the provided CONTEXT_DATA. Any outside facts, hallucinations, or unverified claims MUST result in a FAIL. If ON, Semantic Drift is allowed, meaning the assistant MAY use outside knowledge to answer general queries, so do NOT fail it for using external facts.\n2. The ASSISTANT_RESPONSE is EXPECTED to contain narrative text and potentially a Decoupled Report JSON block. Do NOT fail the response for formatting.\n3. LOGIC ALIGNMENT: Ensure the assistant's logic matches the evidence when discussing the context data.\n\nDid the AI accurately and logically synthesize the provided facts without internal contradiction, error, or (if drift is OFF) external hallucination?\n\nReturn ONLY a valid JSON object. Do NOT use markdown fencing:\n{\n  \"status\": \"PASS\" or \"FAIL\",\n  \"feedback\": \"If FAIL, explain exactly what hallucinated external fact was used (only if drift is OFF), or the logic error. If PASS, leave empty.\"\n}\n\nUSER_QUERY:\n{query}\n\nCONTEXT_DATA:\n{contextData}\n\nASSISTANT_RESPONSE:\n{response}"
    },
"custom_datapoints_directive": {
    "name": "Custom Datapoints Directive",
    "purpose": "Specifies custom keys and extraction rules for the AI to include in the JSON block.",
    "when_used": "Dynamically appended to the core evaluation schema during RAG evaluation.",
    "content": "### [CUSTOM DATAPOINTS]\nCRITICAL EXTRACTION DIRECTIVE: You MUST extract the following custom datapoints as root-level key/value pairs inside your final JSON block:\n- \"suggested_experiments\": generate 1-3 suggested experiments\n- \"suggested_studies\": generate 1-3 suggested studies\n- \"swansons_literature_based_discovery_candidates\": You are an advanced Literature-Based Discovery (LBD) system executing Swanson’s complementary-but-disjoint (A-B-C) model. Your goal is to find hidden, unpublished connections across the provided dataset.   Strict Discovery Protocol: 1. Identify distinct, isolated sub-literatures (Domain A and Domain C) within the dataset that share NO direct citations, co-mentions, or common contextual paragraphs.  2. Find an intermediate biological mechanism, protein, path, or entity (Bridge B) that appears independently in both isolated domains (A-to-B and B-to-C). 3. Synthesize a novel, unstated hypothesis (A-to-C).  Negative Constraint (Crucial): DO NOT output any connection if the relationship between Concept A and Concept C is explicitly mentioned, paired, or summarized anywhere in the source text. If a connection (like \"OMN resilience to SMN stabilization\") is already explicitly stated or grouped as a concept in the data, it is considered \"already known\" and must be disqualified.  Format your output exactly as follows: - Discovered Hypothesis (A to C): [Clear, novel statement] - Literature A (Origin): [Entity/Concept and source context] - Literature C (Target): [Entity/Concept and source context] - The Intersecting Bridge B: [The shared mechanism/protein linking them] - Biological Rationale: [1-2 sentences explaining why this hidden connection is mechanistically plausible]\n- \"contradictions_between_evidences\": Identify conflicting evidence within the evidence set (if any) and flag the dispute here\n- \"repurposed_solutions\": identify and explain repurposed Solution potentials\n- \"ipsc_suggestions\": You are an advanced Stem Cell Bioengineer and Disease Modeling Expert. Your goal is to design a rigorous, highly specific induced Pluripotent Stem Cell (iPSC) experimental protocol to empirically validate the core molecular mechanisms, toxicities, or therapeutic interventions identified in the provided dataset. Strict Modeling Protocol: 1. Identify the specific target cell lineage affected in the literature (e.g., dopaminergic neurons, cardiomyocytes, hepatocytes) and mandate differentiation to this precise state. 2. Establish rigorous genetic contexts, mandating patient-derived lines paired with CRISPR/Cas9-corrected isogenic controls. 3. Define specific stress tests, toxicant exposures, or therapeutic applications based strictly on the dataset. 4. Identify precise, measurable phenotypic or molecular readouts. Negative Constraint (Crucial): DO NOT suggest generic or vague assays (e.g., \"measure cell viability\"). You must specify exact molecular targets, morphological changes, or electrophysiological readouts explicitly tied to the provided context. Format your output exactly as follows: - Target Differentiation Lineage: [Specific somatic cell type required] - Experimental Design & Controls: [Genetic background, isogenic controls, and applied stressors/drugs] - Specific Assays & Readouts: [Exact methodologies, e.g., multi-electrode array (MEA), immunofluorescence for Protein X, targeted RNA-seq] - Expected Results (Disease Phenotype): [What the mutant/exposed iPSC line will demonstrate based on the literature] - Expected Results (Rescue/Intervention): [How the targeted therapeutic or genetic correction will alter the phenotype] - Translational Value: [1-2 sentences explaining why this specific in vitro model bridges the gap between the literature and clinical relevance]\n"
  },
  "quadrant_generation": {
    "name": "Pentamatrix Generation",
    "purpose": "Generates the analytical pentamatrix from the base claim.",
    "when_used": "Beginning of the Semmelweis mode workflow.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes\n\nINITIAL EVALUATION: CLAIM vs. KEYWORDS\n\nBefore processing the four quadrants, you must determine if the user provided a\nstructurally complete claim or a fragmented list of keywords.\n\n  - If Full Claim: Act as a strict transcription engine.\n  - If Keyword List / Fragment: Act as a Speculative Synthesis Engine.\nCRITICAL: If Keyword List / Fragment: Act as a Speculative Synthesis (hallucinate a logical unproven hypothesis that will score non-implausible to plausible but not yet proven).\n\nQUADRANT CONSTRAINTS\n\n0. RAW USER TEXT\n1. ORIGINAL\n\n  - Definition: The baseline claim, grammatically and logically perfected.\n  - Rule for Full Claims: Transcribe exactly as stated. Your ONLY modification\n    is to fix spelling, punctuation, and grammar. If the input is a question,\n    convert it into a declarative claim.\n  - Rule for Keyword Lists: Your keyword list to claim rewrite may NOT be proven  True or False or Undetermined and MUST be creative. You MUST NOT summarize the keywords. You MUST NOT\n    describe the keywords as \"biomarkers,\" \"tools,\" or \"potential areas of\n    study.\" You MUST synthesize the keywords into a BOLD, UNPROVEN CAUSAL\n    HYPOTHETICAL THEORY.\n  - The Extrapolation Clause (Keywords Only): *some or all of* the keywords only.  novel idea. \n\n2. INVERSE\n\n  - Definition: The direct structural negation of the Original claim.\n  - Rule: Directly negate the primary relationship. Do NOT introduce new\n    variables. Flip the boolean state of the primary verb (e.g., \"promotes\"\n    becomes \"does not promote\").\n\n3. ADVERSARIAL\n\n  - Definition: A mutually exclusive alternative root cause.\n  - Rule: Formulate a competing claim where a completely different variable\n    accounts for the outcome.\n  - The Logic Test: IF the Adversarial claim is TRUE, the Original claim MUST be\n    FALSE. It must represent a conflict of causality.\n\n4. INVERSE ADVERSARIAL\n\n  - Definition: A foundational prerequisite or mandatory dependency.\n  - Rule: Identify a core underlying component or physical assumption that the\n    Original claim requires to exist.\n  - The Logic Test: IF the Inverse Adversarial claim is FALSE, the Original\n    claim is PHYSICALLY IMPOSSIBLE.\n\nOUTPUT FORMAT\n\nReturn ONLY valid JSON. Do not include markdown formatting blocks,\nconversational text, or explanations.\n\n{ \"original\": \"[Corrected claim OR Extrapolated novel CAUSAL hypothesis]\",\n\"inverse\": \"[Direct structural negation]\", \"adversarial\": \"[Mutually exclusive\nalternative: If True, Original is False]\", \"inverse_adversarial\": \"[Foundational\ndependency: If False, Original is Impossible]\" }\n\n\nDo not output keywords list - you must convert them to a hypothetical original creative nonplausible noninevitable concept.  Again, keywords lists must have their original rewritten as a nonimplausible potentially unlikely, not proven, unique original creative novel rewrite."
  },
  "boolean_generation": {
    "name": "Boolean Generation",
    "purpose": "Generates database-specific search strings.",
    "when_used": "Stage 1 of each pentamatrix's evaluation loop.",
    "content": "You are an  expert librarian and systematic reviewer. Generate exactly {breadth} search query variations suitable for {library} based on this text. \n\nYour primary goal is to retrieve literature that directly SUPPORTS or REFUTES the claim, or is related to it. Your secondary goal is literature-based discovery (LBD) exploring peripheral edge relationships. Use OR to discover edges and overlooked abstracts.\n\nTo find both supporting and refuting papers, do NOT search for the exact conclusion. Instead, search for the intersection of the core variables (e.g., Variable A AND Variable B).  USE \"OR\" for edge discovery.\n\nUse appropriate syntax for {library}:\n- PubMed: Use grouped booleans with parentheses. Group synonyms using OR (e.g., (\"Term 1\" OR \"Synonym 1\")). Connect distinct core concepts using AND. CRITICAL: Limit queries to a maximum of 2 to 3 'AND' intersections to prevent 0-result returns. Scale your queries from highly targeted (core variables) to broad edge discovery (mechanisms/pathways). Include MeSH terms.\n- Wikipedia: Use wiki search format utlencoded\n- arXiv: Provide ONLY 2-4 space-separated essential keywords (e.g., polar bear, skin, color). DO NOT use 'AND', 'OR', field tags, or parentheses, as complex strings break the API.\n\nReturn ONLY the search queries each on a new line, no extra commentary, no bullets, no numbering. \nRemember, scale the suggestions to evaluate the direct relationship FIRST, followed by the peripheral discovery edges."
  },
  "persona_heuristic": {
    "name": "Persona: Heuristic (Mapper)",
    "purpose": "Sets AI role for heuristic systems mapping.",
    "when_used": "Stage 4 RAG evaluation (if Rigor = Heuristic).",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nYou are a heuristic logic mapper and researcher. You play the role of a Systems Architecht.\nHEURISTIC MAPPING IS ACTIVE: Use logical connections of in-evidence elements to bridge gaps. Focus deeply on non-implausibility (do not penalize if the systemic mechanism is logically and factually sound). Identify logic chains and assess the Gap Strength in the literature (None, Weak, Medium, Strong)."
  },
  "persona_strict": {
    "name": "Persona: Strict (Fact-Checker)",
    "purpose": "Sets AI role for rigorous fact-checking.",
    "when_used": "Stage 4 RAG evaluation (if Rigor = Strict).",
    "content": "You are a strict, rigorous scientific fact-checker.\nRAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes."
  },
  "format_preprint": {
    "name": "Format: Preprint",
    "purpose": "Defines the academic output schema.",
    "when_used": "Stage 4 RAG evaluation (if Format = Preprint).",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nFirst provide disclaimer such as \"Even though this fact check looked at unique up-to-date abstracts, new evidence may refute this answer in the future. Although 'Zero Hallucinated Moneyshot Quotes' is programmatically enforced, AI is not always immune to inadvertently/erroneously misinterpreting data. This is not medical or professional advice, but instead, is an opinion calculated by AI based on the literature evaluated.\"\n---\nWrite in a highly academic, formal thesis tone.\nFormat your readable response using these exact academic headers:\n###[CLAIM EVALUATED AND ANSWER TO USER]\n(Exact wording of the claim evaluated)\n### [ABSTRACT & REWRITTEN CLAIM]\n(Scientific synthesis)\n### [INTRODUCTION & JUSTIFICATION]\n(Mechanistic explanation utilizing the 'moneyshot quotes' you will use in the EVIDENCE, METHODOLOGY & CITATIONS section later as well)\n### [DISCUSSION: NOVEL & OVERLOOKED]\n(5-10 bullet points of surprising facts)\n### [EVIDENCE, METHODOLOGY & CITATIONS]\n(Numbered list matching inline citations) For example \"1. ID: 12345 - Application: The text discusses ... and since no other evidence provided proves nor disproves the claim, the lowest rating allowed across all evidences is required. ID:12345 indicates the claim is overall plausible (Alignment with this ID: 3) - [copied/verbatim Quote text]\"\n\n**CRITICAL: You must include the exact quote you used in the [copied/verbatim Quote text] section.\n\nIf the prompt says \"at least {numQuotes} quotes\" then there must be at least {numQuotes} matching citations.  You must actually use the quotes you select within the conext of the preprint publication you write."
  },
  "format_clinical": {
    "name": "Format: Clinical",
    "purpose": "Defines the medical output schema.",
    "when_used": "Stage 4 RAG evaluation (if Format = Clinical).",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nFirst provide disclaimer such as \"Even though this fact check looked at unique up-to-date abstracts, new evidence may refute this answer in the future. Although 'Zero Hallucinated Moneyshot Quotes' is programmatically enforced, AI is not always immune to inadvertently/erroneously misinterpreting data. This is not medical or professional advice, but instead, is an opinion calculated by AI based on the literature evaluated.\"\n---\nWrite in a clinical, medical-professional tone.\nFormat your readable response using these exact clinical headers:\n###[CLAIM EVALUATED]\n(Exact wording of the claim evaluated)\n### [CLINICAL BOTTOM-LINE / REWRITTEN CLAIM]\n(Scientific synthesis)\n### [RISK VS REWARD & JUSTIFICATION]\n(Mechanistic explanation utilizing the 'moneyshot quotes' you will use in the EVIDENCE, METHODOLOGY & CITATIONS section later as well)\n### [PATIENT APPLICATION: NOVEL & OVERLOOKED]\n(3-10 bullet points of surprising facts)\n### [EVIDENCE, METHODOLOGY  & CITATIONS]\n(Numbered list matching inline citations) For example \"1. ID: 12345 - Application: The text discusses ... and since no other evidence provided proves nor disproves the claim, the lowest rating allowed across all evidences is required. ID:12345 indicates the claim is overall plausible (Alignment with this ID: 3) - [copied/verbatim Quote text]\"\n\n**CRITICAL: You must include the exact quote you used in the [copied/verbatim Quote text] section.\n\nIf the prompt says \"at least {numQuotes} quotes\" then there must be at least {numQuotes} matching citations!"
  },
  "format_standard": {
    "name": "Format: Standard",
    "purpose": "Defines the standard output schema.",
    "when_used": "Stage 4 RAG evaluation (if Format = Standard).",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nIf the user asked a question, you must first provide disclaimer such as \"Even though this fact check looked at unique up-to-date abstracts, new evidence may refute this answer in the future. Although 'Zero Hallucinated Moneyshot Quotes' is programmatically enforced, AI is not always immune to inadvertently/erroneously misinterpreting data. This is not medical or professional advice, but instead, is an opinion calculated by AI based on the literature evaluated.\"\n---\nThen use a friendly and appropriate tone and answer their intent based solely on the research provided.\nFormat your readable response using these exact standard headers:\n[ANSWER TO USER] (if they asked a question)\n###[CLAIM EVALUATED]\n(Exact wording of the claim evaluated)\n### [REWRITTEN CLAIM/PATHWAY]\n(Scientific synthesis based on evidence)\n### [JUSTIFICATION]\n(Mechanistic explanation utilizing the 'moneyshot quotes' you will use in the EVIDENCE, METHODOLOGY & CITATIONS section later as well)\n### [HIGHLIGHTS: NOVEL & OVERLOOKED]\n(3-10 bullet points of surprising facts)\n### [EVIDENCE, METHODOLOGY  & CITATIONS]\n(Numbered list matching inline citations) For example \"1. ID: 12345 - Application: The text discusses ... and since no other evidence provided proves nor disproves the claim, the lowest rating allowed across all evidences is required. ID:12345 indicates the claim is overall plausible (Alignment with this ID: 3) - [copied/verbatim Quote text]\"\n\n**CRITICAL: You must include the exact quote you used in the [copied/verbatim Quote text] section.\n\nIf the prompt says \"at least {numQuotes} quotes\" then there must be at least {numQuotes} matching citations!"
  },
  "social_mode_prepend": {
    "name": "Social Mode Persona",
    "purpose": "Defines the conversational prepend for Pathmap Social Mode analysis.",
    "when_used": "When Analysis Mode = 'Pathmap Social' in Stage 4 RAG evaluation.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\n###[FRIENDLY ANSWER TO USER INTENT]\nAddress the user intent directly at the very top. Answer using only the dataset provided in 2 to 10 sentences using a friendly scientific tone moving from \"literature-shaped answers\" to \"human-intent-shaped literature answers\" for this section.\n\nIf the prompt says \"at least {numQuotes} quotes\" then there must be at least {numQuotes} matching citations!"
  },
  "alignment_mode_prepend": {
    "name": "Alignment Mode Prepend",
    "purpose": "Explicitly documents divergence/alignment between claim and evidence.",
    "when_used": "When Analysis Mode = 'Alignment Mode'.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.  CRITICAL: Explicitly document the divergence/alignment between the original claim and the evidence context. Note any contradictions or supporting facts clearly."
  },
  "flexible_mode_eval": {
    "name": "Flexible Mode Logic",
    "purpose": "Logic used in Flexible Mode",
    "when_used": "When Analysis Mode = 'Flexible Mode'.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nBased on the following evaluated context, execute the user's custom command.\n\nContext:\n{context}\n\nUser Command:\n{command}\n\nUploaded Reference:\n{reference}"
  },
  "phenotype_intake": {
    "name": "Phenotype Intake Logic",
    "purpose": "Defines the clinical logic for Phenotype Architect mode.",
    "when_used": "When Analysis Mode = 'Phenotype Architect'.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nYou are a clinical Phenotype Architect. Analyze the user's claim and extract the precise clinical phenotype pathways. Break it down into observable metrics and diagnostic flags based solely on the scientific evidence provided.\n\nCLAIM EVALUATED: {claim}\n\nFormat with rigorous medical terminology and actionable clinical markers."
  },
  "auto_explore_generation": {
    "name": "AutoExplore Hypothesis Generator",
    "purpose": "Generates a novel claim based on a broad topic and previous history.",
    "when_used": "Beginning of each loop when AutoExplore is enabled.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nThe user is researching the broad topic: \"{topic}\"\n\nHere are the hypotheses you have ALREADY explored during this session:\n{history}\n\nINSTRUCTIONS:\nGenerate exactly ONE related inquiry stated as a claim.\n- It MUST be formatted as a declarative statement.\n- DO NOT wrap it in quotes.\n- DO NOT include conversational text or explanations.\n- Just return the simple claim."
  },
  "assistant_panel": {
    "name": "Assistant Panel Prompt",
    "purpose": "Governs the AI behavior when using the chat Assistant Panel.",
    "when_used": "Whenever querying the dataset via the AI Assistant Chat module.",
    "content": "You are an expert Data Scientist and Visualization Architect. Answer the user directly and truthfully. Do not introduce yourself.\n\nCRITICAL: Every important claim you make MUST be accompanied by a specific source ID or parenthetical citation (e.g., [ID: 12345]) if it is derived from the context.\n\nRESPONSE STRATEGY:\nYou have the ability to generate a Decoupled Report (JSON) that renders interactive UI widgets.   Use this power conditionally based on the user's intent:\n\nSCENARIO A: EXPLICIT REPORT REQUEST\nIf the user specifically asks for a \"report,\" \"dashboard,\" \"comprehensive breakdown,\" or \"analysis\" on a topic:\n- Provide a detailed conversational response.\n- THEN, output a ROBUST Decoupled Report JSON block containing 4 to 10 panels tailored precisely to their request. (Include \"synthesis\" and \"pathmap\" as mandatory selections).\n\nSCENARIO B: GENERAL QUERY + HELPFUL VISUAL\nIf the user asks a general question but the answer would vastly benefit from a visual:\n- Provide your conversational response.\n- THEN, output a MINI Decoupled Report JSON block containing exactly 1 or 2 highly targeted panels.\n\nSCENARIO C: BASIC CONVERSATION\nIf the user is just chatting or asking a simple factual question that doesn't need a visual, simply provide your conversational response. Omit the JSON block entirely.\n\n================================================================\nDECOUPLED REPORT PROTOCOL (JSON)\n================================================================\nDo NOT generate raw HTML, CSS, or JS. Output ONLY valid JSON inside the fencing.\nMODE AWARENESS: If the provided dataset only has ONE quadrant/perspective, DO NOT use \"divergence\", \"radar_plot\", or \"divergence_attractor\".\n\nAVAILABLE TRACE-LINKED PANELS:\n\"metrics\", \"synthesis\", \"logic_network\", \"gap_distribution\", \"node_centrality\", \"semantic_attractor\", \"contradiction_topology\", \"bottlenecks\", \"tag_cloud\", \"keyword_spectrum\", \"provider_distribution\", \"chronological_timeline\", \"translation_readiness\", \"verification_audit\", \"study_matrix\", \"bibliography\", \"divergence\" (needs runIndex), \"radar_plot\", \"divergence_attractor\".\n\nAVAILABLE UNIVERSAL PANELS:\n- \"data_pie_chart\": {\"type\": \"data_pie_chart\", \"title\": \"...\", \"data\": [{\"label\": \"A\", \"value\": 10}]}\n- \"data_bar_chart\": {\"type\": \"data_bar_chart\", \"title\": \"...\", \"xAxisLabel\": \"...\", \"data\": [{\"label\": \"A\", \"value\": 10}]}\n- \"event_timeline\": {\"type\": \"event_timeline\", \"title\": \"...\", \"data\": [{\"date\": \"1990\", \"title\": \"...\", \"desc\": \"...\"}]}\n- \"comparison_matrix\": {\"type\": \"comparison_matrix\", \"title\": \"...\", \"headers\": [\"Name\"], \"rows\": [[\"Item\"]]}\n\nFormat exactly as follows if generating a report:\n\n###REPORT_JSON_START###\n{\n  \"title\": \"CUSTOM ANALYSIS REPORT\",\n  \"evidence_tier\": \"EVALUATED\",\n  \"panels\": [\n    { \"type\": \"synthesis\", \"title\": \"Main Deliverable Summary\" },\n    { \"type\": \"pathmap\", \"title\": \"Global Master Systems Map\" }\n  ]\n}\n###REPORT_JSON_END###\n\nCRITICAL RESPONSE SEQUENCE:\n1. First, provide your conversational response.\n2. If applicable, output the ###REPORT_JSON_START### block without conversational filler before it.\n\nContext Source: {target}\n=============================\n{contextData}\n=============================\nUser Request: ANSWER IN THIS LANGUAGE --->>> {query}  <<<--- ANSWER THE USER REQUEST IN THEIR OWN LANGUAGE.  THE DATASETS CAN BE GENERATED IN ANY LANGUAGE AND MULTIPLE CHAT THREADS MAY EXIST, BUT YOU MUST ANSWER THE USER IN THE LANGUAGE THEY ASKED THE CURRENT QUERY: {query}"
  },
  "core_evaluation_schema": {
    "name": "Core Evaluation Schema (JSON)",
    "purpose": "Defines the strict JSON requirements for the final output.",
    "when_used": "Appended to every Stage 4 RAG evaluation.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\n###critical: WRAP YOUR THOUGHTS WITH <think></think>\nAll responses must include the mandatory \"### [EVIDENCE, METHODOLOGY  & CITATIONS]\" section as formatted.\nCRITICAL:\n**MONEYSHOT QUOTES MUST DIRECTLY SUPPORT YOUR CLAIMS**\n**MONEYSHOT QUOTES MUST BE USED IN YOUR RESPONSE TEXT WITHOUT IN-LINE ANNOTATION**\n**MONEYSHOT QUOTES MUST BE USED IN A FORMAL PROFESSIONAL WAY, WORTHY OF PEER REVIEW, WITHOUT ILLOGICAL LEAPS (UNSUPPORTED MAY BE OK, ILLOGICAL IS NOT OK)**\n(Numbered list matching inline citations) For example \"1. ID: 12345 - Application: The text discusses ... and since no other evidence provided proves nor disproves the claim, the lowest rating allowed across all evidences is required. ID:12345 indicates the claim is overall plausible (Alignment with this ID: 7) - *\"copied/verbatim Quote text\"**\n\nCRITICAL INSTRUCTION:\nwhen fact checking: At the very end of your response, you MUST provide a machine-readable JSON block containing evaluation metrics. \nIt MUST be enclosed exactly between ###JSON_START### and ###JSON_END###. Ensure the JSON is valid. \n\nFor the \"Logic_Chain\", break down the systemic mechanism into verbose unabridged atomic multi-step pathways using i/o porting style where the input of next node must match output of the prior (e.g., A -> B, B->C, C->D). Each chain must fully represent the response you give, and should be color coded with light green (Gap_Strength is \"None\"), lightblue (Gap_Strength is medium), or pink (strong Gap_Strength). Logic_Chain MUST be a JSON array of objects. Each object MUST contain EXACTLY these keys: \"Step\", \"From\", \"Relationship\", \"To\", \"evidence_source_id\", \"Alignment_Score\", \"Consilience_Score\", \"Confidence_Score\", \"Gap_Strength\", \"Justification\", and \"Color\". Use commas between objects. DO NOT leave trailing commas inside objects.\n\nFor \"Verbatim_Quotes\", copy at least {numQuotes} (required, {numQuotes} or more) \"moneyshot\" quotes EXACTLY as they appear in the context literature text, word-for-word, characters included, that fully support your response. We will programmatically validate these. You MUST return an array of OBJECTS, where each object has a \"quote\" key and a \"source_id\" key (the ID of the text it came from, e.g., the ID). Do not alter a single character, do not paraphrase.\n\nUse these scales to evaluate HOW WELL THE EVIDENCE SUPPORTS THE SPECIFIC CLAIM EVALUATED ABOVE:\n- Alignment Score (1-7): How well does the EVALUATED CLAIM factually align with the provided RAG evidence set? [1=Evidence proves claim strictly false, 2=Evidence indicates the claim is impossible, 3=Implausible, 4=Neutral/Unrelated, 5=Plausible, 6=Evidence indicates inevitable, 7=Evidence proves claim strictly true]\n- Consilience Score (1-7): How consilient (in agreement) is the evidence set regarding this claim? [1=Highly Conflicting/Disputed, 4=Mixed, 7=Unanimous Agreement]\n- Confidence Score (1-7): Implied confidence of the research based on study types and depth [1=In Vitro/Animal/Preprint, 4=Observational/Moderate, 7=Meta-analysis/RCT]\n\nFormat (DO NOT USE fencing)\nCRITICAL: Use ONLY Pubmed MeSH tags (exclude descriptor and [type]) for your gate variable names (i.e.,.the \"gates\") so they will be standardized globally.  Be unabridged, comprehensive, and exhaustive in your gate mapping with at least 1 gate nodes for each quote you identified per the specification and map the gates granularly/atomically.\n\n###JSON_START###\n{\n  \"Alignment\": 5,\n  \"Consilience\": 6,\n  \"Confidence\": 5,\n  \"Logic_Chain\":[\n    {\n      \"Step\": 1,\n      \"From\": \"Variable A\",\n      \"Relationship\": \"-->\",\n      \"To\": \"Variable B\",\n      \"Alignment_Score\": 6,\n      \"Consilience_Score\": 5,\n      \"Confidence_Score\": 4,\n      \"Gap_Strength\": \"None\",\n      \"Justification\": \"...\",\n      \"Color\": \"lightgreen\"\n    }\n  ],\n  \"Verbatim_Quotes\": [\n    {\n      \"quote\": \"Copy the Exact wording from text exactly as it is, including all characters (we ascii match for validation!).\",\n      \"source_id\": \"12345678\"\n    }\n  ],\n  \"Study_Type_Audit\": { \"ID123\": \"meta_analysis:Count=10\", \"ID124\": \"in_vivo:Count=3\" },\n  \"Gap_Analysis_Audit\": { \"study_type\": \"in_vitro\", \"study_intent\": \"binding\", \"justification\": \"The context provided indicates...\", \"predicted_result\": \"RGNEF binds to Zn2 magnitudes higher than BMAA\", \"short_answer_to_user\": \"Direct answer to the user primary intent, addressing the user directly when appropriate\"}\n}\n###JSON_END###"
  },
  "mesh_alignment": {
    "name": "MeSH Alignment Generator",
    "purpose": "Maps clean and prune invalid terms to NLM MeSH tags.",
    "when_used": "Post-Build validation of Logic Gates.",
    "content": "Map these exact concepts to their closest strict National Library of Medicine (NLM) MeSH tags.\nCRITICAL INSTRUCTION: You MUST preserve the exact biological, chemical, or mechanistic granularity of the original term. Do NOT abstract specific mechanisms, toxins, or proteins into broad top-level parent categories (e.g., do NOT map specific pathways to broad terms like 'Symptoms', 'Disease', 'Syndrome', or 'Central Nervous System'). Find the most specific, granular molecular/cellular MeSH heading available.\nReturn ONLY a valid JSON object pairing old to new.\nTerms to map: {invalidTerms}\nFormat: {\"old_term\": \"New Exact MeSH Tag Exactly as it appears in MeSH\"}"
},
  "custom_datapoint_report": {
    "name": "Custom Datapoint Architect",
    "purpose": "Generates MVC dashboard plans for custom extracted datapoints.",
    "when_used": "End of pipeline if custom datapoints were injected.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nYou are a Data Visualization Architect. The user tracked a custom scientific datapoint across multiple literature evaluations. \nDatapoint Label: \"{dpLabel}\"\nExtracted Raw Data: {extractedData}\n\nAnalyze this data and synthesize it into a highly professional, clinical Decoupled Report JSON.\n\nCRITICAL MANDATE: You must intelligently SELECT 3 to 8 panels from the 24 available panels below to best visualize and summarize this custom data. \n- You MUST ALWAYS include Panel 1 (\"metrics\") and Panel 2 (\"synthesis\") as your first two panels.\n- Do not attempt to use \"divergence\", \"radar_plot\", or \"divergence_attractor\" unless the extracted dataset contains multiple opposing adversarial runs.\n\nAVAILABLE PANEL TYPES:\n1. \"metrics\": Key metrics scorecard.\n   {\"type\": \"metrics\", \"title\": \"[Title]\"}\n2. \"synthesis\": Narrative executive summary with inline citation formatting.\n   {\"type\": \"synthesis\", \"title\": \"[Title]\", \"content\": \"[Multi-paragraph styled HTML string with citations like [ID: 12345]]\"}\n3. \"divergence\": Hypothesis tension visual (original vs. adversarial). Requires runIndex.\n   {\"type\": \"divergence\", \"title\": \"[Title]\", \"runIndex\": 1}\n4. \"logic_network\": Consolidated logic pathways.\n   {\"type\": \"logic_network\", \"title\": \"[Title]\"}\n5. \"gap_distribution\": SVG donut chart of literature gap strengths (None, Weak, Medium, Strong).\n   {\"type\": \"gap_distribution\", \"title\": \"[Title]\"}\n6. \"node_centrality\": SVG horizontal bar chart of the top 10 entities.\n   {\"type\": \"node_centrality\", \"title\": \"[Title]\"}\n7. \"semantic_attractor\": Mermaid network map radiating to the top 12 global tags.\n   {\"type\": \"semantic_attractor\", \"title\": \"[Title]\"}\n8. \"radar_plot\": Three-axis SVG spider chart of the first 4 quadrants.\n   {\"type\": \"radar_plot\", \"title\": \"[Title]\"}\n9. \"score_timeline\": SVG multi-line trend chart over all quadrants.\n   {\"type\": \"score_timeline\", \"title\": \"[Title]\"}\n10. \"contradiction_topology\": HTML table mapping directional conflict nodes (From -> To with opposing relationships).\n    {\"type\": \"contradiction_topology\", \"title\": \"[Title]\"}\n11. \"bottlenecks\": Styled list of \"Strong\" or \"Medium\" literature gaps.\n    {\"type\": \"bottlenecks\", \"title\": \"[Title]\"}\n12. \"tag_cloud\": Weighted HSL tag cloud of the top 20 words.\n    {\"type\": \"tag_cloud\", \"title\": \"[Title]\"}\n13. \"keyword_spectrum\": SVG vertical bar chart of the top 10 keywords.\n    {\"type\": \"keyword_spectrum\", \"title\": \"[Title]\"}\n14. \"provider_distribution\": SVG horizontal stacked bar chart of evidence sources (PubMed vs OpenAlex vs arXiv vs Wiki).\n    {\"type\": \"provider_distribution\", \"title\": \"[Title]\"}\n15. \"chronological_timeline\": SVG/HTML publication year distribution histogram.\n    {\"type\": \"chronological_timeline\", \"title\": \"[Title]\"}\n16. \"translation_readiness\": Circular progress gauge based on average confidence scores. Requires subtitle.\n    {\"type\": \"translation_readiness\", \"title\": \"[Title]\", \"subtitle\": \"[Label]\"}\n17. \"verification_audit\": HTML table of quote validation metrics (Attempts, PASS, FAIL counts).\n    {\"type\": \"verification_audit\", \"title\": \"[Title]\"}\n18. \"study_matrix\": HTML matrix summarizing study methodologies from the Study_Type_Audit.\n    {\"type\": \"study_matrix\", \"title\": \"[Title]\"}\n19. \"divergence_attractor\": Comprehensive bipartite tensor SVG mapping all Q1 vs Q3 alignment scores.\n    {\"type\": \"divergence_attractor\", \"title\": \"[Title]\"}\n20. \"bibliography\": Automatically prints the verified bibliography.\n    {\"type\": \"bibliography\", \"title\": \"[Title]\"}\n21. \"data_pie_chart\": Universal Data Pie Chart.\n    {\"type\": \"data_pie_chart\", \"title\": \"[Title]\", \"data\": [{\"label\": \"Group A\", \"value\": 45}, {\"label\": \"Group B\", \"value\": 55}]}\n22. \"data_bar_chart\": Universal Generic Bar Chart.\n    {\"type\": \"data_bar_chart\", \"title\": \"[Title]\", \"xAxisLabel\": \"[Label]\", \"data\": [{\"label\": \"Category A\", \"value\": 10}, {\"label\": \"Category B\", \"value\": 20}]}\n23. \"event_timeline\": Universal Vertical Timeline.\n    {\"type\": \"event_timeline\", \"title\": \"[Title]\", \"data\": [{\"date\": \"2024\", \"title\": \"Milestone\", \"desc\": \"Event description\"}]}\n24. \"comparison_matrix\": Universal Comparison Matrix.\n    {\"type\": \"comparison_matrix\", \"title\": \"[Title]\", \"headers\": [\"Metric\", \"Baseline\", \"Outcome\"], \"rows\": [[\"Variable X\", \"Value A\", \"Value B\"]]}\n\nFormat your output exactly as follows:\n\n###REPORT_JSON_START###\n{\n  \"title\": \"CUSTOM EXTRACTED DATAPOINT REPORT\",\n  \"evidence_tier\": \"EVALUATED\",\n  \"panels\": [\n    { \"type\": \"metrics\", \"title\": \"Global Data Metrics\" },\n    { \"type\": \"synthesis\", \"title\": \"Executive Analysis\", \"content\": \"Analysis of the data point [ID: 12345].\" },\n    { \"type\": \"data_pie_chart\", \"title\": \"Distribution Overview\", \"data\": [{\"label\": \"Tier 1\", \"value\": 30}, {\"label\": \"Tier 2\", \"value\": 70}] }\n  ]\n}\n###REPORT_JSON_END###\n\nReturn ONLY a valid JSON block enclosed exactly between ###REPORT_JSON_START### and ###REPORT_JSON_END###. Do not include introductory or concluding conversational text."
  },
  "agi_module_selection": {
    "name": "AGI Agent: Module Selection",
    "purpose": "Allows the AGI agent to select which MVC reports to read.",
    "when_used": "Smart FollowUp step 1.",
    "content": "You are an autonomous AGI agent analyzing a complex trace. The system has generated modules for the current dataset. \nAvailable Module IDs: {menuOptions}. \nWhich 3 to 20 modules do you need to read right now to formulate the best follow-up hypothesis? Return ONLY a valid JSON array of strings matching the IDs exactly.  (do not choose evidence set.  do not choose json array.  Do not choose build log. Do not choose apa citations list)"
  },
  "agi_followup_fallback": {
    "name": "AGI Agent: 0-Result Fallback",
    "purpose": "Generates a new hypothesis when a search fails completely.",
    "when_used": "Smart FollowUp step 2 (if 0 results).",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nYou are an autonomous discovery agent. The previous search returned 0 results. Generate a new, related hypothesis based on the original claim: \"{claim}\".\n\nRespect for original intent: {intentRespect}%\n\nYou MUST return ONLY valid JSON in this format:\n{\n  \"claim\": \"your new hypothesis here\",\n  \"new_datapoints\": [\n    {\"key\": \"example_key\", \"label\": \"Example Label\", \"instruction\": \"Extract example data\"}\n  ]\n}"
  },
  "agi_followup_main": {
    "name": "AGI Agent: Main Hypothesis",
    "purpose": "Generates a new hypothesis based on selected modules.",
    "when_used": "Smart FollowUp step 2.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nYou are an autonomous discovery agent. Based on the following context, generate a new hypothesis to explore next.\n\nOriginal Query: \"{originalQuery}\"\nRespect for original intent: {intentRespect}%\n\nContext:\n{agiContext}\n\nYou MUST return ONLY valid JSON in this format:\n{\n  \"claim\": \"your new hypothesis here\",\n  \"new_datapoints\": [\n    {\"key\": \"example_key\", \"label\": \"Example Label\", \"instruction\": \"Extract example data\"}\n  ]\n}"
  },
 "demo_case_generation": {
    "name": "Demo Case Generation",
    "purpose": "Generates a hypothetical complex scientific inquiry.",
    "when_used": "When the user clicks 'Demo Case'.",
    "content": "RAG AMNESIA IS ACTIVE: You must ONLY use the provided context literature. Do not use outside prior knowledge. If the evidence is missing, insufficient, or requires gap-filling to fully evaluate the claim, you MUST explicitly state the gaps and missing evidence in your justification. Under no circumstances should you invent or hallucinate citations or quotes.\n\nGenerate a single, realistic, complex scientific question a researcher, patient, or curious individual might ask regarding an emerging biological mechanism, systemic physiological pathway, or environmental health impact. Return ONLY the question, no quotes."
  },
  "validation_rules_feedback": {
    "name": "Validation Rules (Infinite Loop Breaker)",
    "purpose": "Prepended to the system prompt when the AI fails quote validation.",
    "when_used": "Inside executeQuadrantRAG during a retry.",
    "content": "⚠️⚠️⚠️ CRITICAL VERIFICATION FAILURE (RETRY LOOP DETECTED) ⚠️⚠️⚠️\nYour previous response was REJECTED because your quotes failed strict byte-perfect validation.\n\nTO BREAK THE LOOP, FOLLOW THESE 3 ABSOLUTE RULES:\n1. NO REPAIRING: If a quote failed, do NOT attempt to edit or tweak it. Either copy a completely different, 100% verbatim sentence from the source, or discard the quote entirely.\n2. PERMISSION TO DISCARD: You are NOT permitted to return fewer quotes to pass validation. Never hallucinate just to meet a quota.\n3. BYTE-PERFECT COPY: You must perform a direct, literal copy-paste. Ellipses (...) are BANNED. Do not change a single capital letter, punctuation mark, or space.\n======================================================="
  },
  "validation_mismatch_feedback": {
    "name": "Validation Mismatch Directory",
    "purpose": "Provides the AI with the exact text it failed to quote correctly.",
    "when_used": "Inside evaluateWithInfiniteRetry.",
    "content": "### CRITICAL QUOTE VALIDATION FAILURE (ATTEMPT {attempts}) ###\nThe validator executed a 100% strict, character-by-character substring search. Your response was REJECTED because the following quotes do not exist verbatim in the source texts.\n\n❌ FAILED QUOTES (You must fix or delete these):\n{failedContext}\n\n{passedContext}\nINSTRUCTION: Study the actual abstracts provided. Correct the casing, punctuation, spelling, or map the quote to its true source ID. Do NOT use ellipses."
  }
};


const ORIGINAL_LANG = { ...LANG };
const ORIGINAL_PROMPTS = {};
for (let key in PROMPT_SETTINGS) {
    ORIGINAL_PROMPTS[key] = PROMPT_SETTINGS[key].content;
}

    let session = { apiKey: null, model: null, provider: 'gemini', isReady: false, stats: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
    let workflowTrace = { claim: null, timestamp: null, settings: {}, prompt_settings: PROMPT_SETTINGS, authorship: {}, executionLog:[], failedQuotesLog: [], allQuoteAttempts: [], assistantLogs: [], quadrants:[], sharedAbstracts: {}, globalTags: {}, apaCitations: {}, globalCitationMap: {}, mvcReports: [], aggregatedDatapoints: {}, stats: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
    let customEvidenceBlob = null;
    let flexiblePromptText = "";
    let activeCustomDatapoints = [];

    const datapointsModal = document.getElementById('datapointsModal');
    const datapointsList = document.getElementById('datapointsList');

    document.getElementById('openDatapointsBtn').addEventListener('click', () => {
        syncDatapointsFromPromptDirective(); 
        renderDatapointRows();
        datapointsModal.style.display = 'flex';
    });
    
    document.getElementById('closeDatapointsBtn').addEventListener('click', () => { datapointsModal.style.display = 'none'; });
    document.getElementById('addDatapointRowBtn').addEventListener('click', () => { activeCustomDatapoints.push({ key: "", label: "", instruction: "" }); renderDatapointRows(); });

function renderDatapointRows() {
    datapointsList.innerHTML = '';
    activeCustomDatapoints.forEach((dp, index) => {
        const row = document.createElement('div');
        row.style.cssText = "display:grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 8px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;";
        
        // Create inputs securely without inline handlers
        row.innerHTML = `
            <input type="text" class="dp-key" placeholder="${L('ui_ph_dp_key')}" value="${escapeHtml(dp.key)}" style="padding:6px; border-radius:4px; border:1px solid #cbd5e1; font-size:0.8rem;">
            <input type="text" class="dp-label" placeholder="${L('ui_ph_dp_label')}" value="${escapeHtml(dp.label)}" style="padding:6px; border-radius:4px; border:1px solid #cbd5e1; font-size:0.8rem;">
            <input type="text" class="dp-instr" placeholder="${L('ui_ph_dp_instr')}" value="${escapeHtml(dp.instruction)}" style="padding:6px; border-radius:4px; border:1px solid #cbd5e1; font-size:0.8rem;">
            <button class="danger delete-dp-btn" style="padding:4px 8px; font-size:0.8rem; border-radius:4px;">X</button>
        `;

        // Attach listeners safely in JavaScript
        row.querySelector('.dp-key').addEventListener('input', function() { activeCustomDatapoints[index].key = this.value; });
        row.querySelector('.dp-label').addEventListener('input', function() { activeCustomDatapoints[index].label = this.value; });
        row.querySelector('.dp-instr').addEventListener('input', function() { activeCustomDatapoints[index].instruction = this.value; });
        row.querySelector('.delete-dp-btn').addEventListener('click', function() { 
            activeCustomDatapoints.splice(index, 1); 
            renderDatapointRows(); 
        });

        datapointsList.appendChild(row);
    });
}

    document.getElementById('saveDatapointsBtn').addEventListener('click', () => {
        activeCustomDatapoints = activeCustomDatapoints.filter(dp => dp.key && dp.instruction);
        if (activeCustomDatapoints.length > 0) {
            let injection = `### [CUSTOM DATAPOINTS]\nCRITICAL EXTRACTION DIRECTIVE: You MUST extract the following custom datapoints as root-level key/value pairs inside your final JSON block:\n`;
            activeCustomDatapoints.forEach(dp => { injection += DOMPurify.sanitize(`- "${dp.key}": ${dp.instruction}\n`); });
            PROMPT_SETTINGS.custom_datapoints_directive.content = injection;
            document.getElementById('datapointWarning').style.display = 'block';
            showToast(L('toast_dp_saved'));
        } else {
            PROMPT_SETTINGS.custom_datapoints_directive.content = ""; 
        }
        datapointsModal.style.display = 'none';
    });

    const DB_NAME = "PathmapDB";
    const STORE_NAME = "TraceStore";
    const TRANS_STORE = "TranslationStore"; // New Cache Store Constant

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2); // Upgraded database version to 2
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
                if (!db.objectStoreNames.contains(TRANS_STORE)) db.createObjectStore(TRANS_STORE);
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // Cache Write Helper
    async function saveTranslationToCache(key, langObj, promptsObj) {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(TRANS_STORE, "readwrite");
                const store = tx.objectStore(TRANS_STORE);
                store.put({ lang: langObj, prompts: promptsObj }, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } catch (err) { console.error("Failed to write to translation cache:", err); }
    }

    // Cache Read Helper
    async function loadTranslationFromCache(key) {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(TRANS_STORE, "readonly");
                const store = tx.objectStore(TRANS_STORE);
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (err) { return null; }
    }

    async function saveTraceToDB(trace) {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                const request = store.put(trace, "current_trace");
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (err) { console.error("IndexedDB Progressive Autosave failed:", err); }
    }

    async function loadTraceFromDB() {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const request = store.get("current_trace");
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (err) { return null; }
    }

    let abortController = null;
    let assistantAbortController = null;
    let currentRunActive = false;

    const modal = document.getElementById('apiKeyModal');
    const providerSelect = document.getElementById('providerSelect');
    const apiKeyLabel = document.getElementById('apiKeyLabel');
    const apiKeyInput = document.getElementById('geminiApiKeyInput');
    const modalModelContainer = document.getElementById('modalModelContainer');
    const apiKeyHelpLink = document.getElementById('apiKeyHelpLink');
    const modalStartBtn = document.getElementById('modalStartBtn');
    
    const runBtn = document.getElementById('runFactCheckBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const doAnotherBtn = document.getElementById('doAnotherBtn');
    const claimTextarea = document.getElementById('claimInput');
    const statusDiv = document.getElementById('statusLog');
    const tokenTracker = document.getElementById('tokenTracker');
    
    const finalResultArea = document.getElementById('finalResultArea');
    const authorshipHeader = document.getElementById('authorshipHeader');
    const exportBtn = document.getElementById('exportJsonBtn');
    const copyResultBtn = document.getElementById('copyFinalResultBtn');
    const postUrlBtn = document.getElementById('postUrlBtn');
    const printModeSelect = document.getElementById('printModeSelect');
    const doPrintBtn = document.getElementById('doPrintBtn');

    const openPromptSettingsBtn = document.getElementById('openPromptSettingsBtn');
    const promptSettingsModal = document.getElementById('promptSettingsModal');
    const closePromptSettingsBtn = document.getElementById('closePromptSettingsBtn');
    const savePromptSettingsBtn = document.getElementById('savePromptSettingsBtn');
    const promptEditorsContainer = document.getElementById('promptEditorsContainer');
    const promptFileInput = document.getElementById('promptFileInput');
    const loadPromptFileBtn = document.getElementById('loadPromptFileBtn');
    const exportPromptFileBtn = document.getElementById('exportPromptFileBtn');

    const librarySelect = document.getElementById('librarySelect');
    const analysisMode = document.getElementById('analysisMode');
    const outputFormat = document.getElementById('outputFormat');
    const outputLength = document.getElementById('outputLength');
    const rigorToggle = document.getElementById('rigorToggle');
    const tagCloudToggle = document.getElementById('tagCloudToggle');
    const breadthSlider = document.getElementById('breadthSlider');
    const depthSlider = document.getElementById('depthSlider');
    const quotesSlider = document.getElementById('quotesSlider');
    const evalsPerRunSlider = document.getElementById('evalsPerRunSlider');
    const intentRespectSlider = document.getElementById('intentRespectSlider');
    const buildRunsInput = document.getElementById('buildRuns');
    const authorNameInput = document.getElementById('authorName');
if (authorNameInput) {
        authorNameInput.addEventListener('input', function() {
            let val = this.value;
            // 2. Strip prohibited words (case-insensitive)
            val = val.replace(/\b(copyright|copy|rights|right)\b/gi, '');
            // 3. Clean up multiple spaces that might result from stripping
            val = val.replace(/\s{2,}/g, ' ');
            
            if (this.value !== val) {
                this.value = val;
            }
        });
    }


    const affiliationInput = document.getElementById('affiliation');
    const autoExploreCb = document.getElementById('autoExploreCb');
    const claimLabel = document.getElementById('claimLabel');

    const advancedModulesArea = document.getElementById('advancedModulesArea');
    const cloudBox = document.getElementById('cloudBox');
    const tagCloudArea = document.getElementById('tagCloudArea');
    const attractorBox = document.getElementById('attractorBox');
    const tagsAttractorArea = document.getElementById('tagsAttractorArea');
    const mermaidGatesContainer = document.getElementById('mermaidGatesContainer');
    const mermaidGatesArea = document.getElementById('mermaidGatesArea');
    const mermaidPathMapContainer = document.getElementById('mermaidPathMapContainer');
    const mermaidPathMapArea = document.getElementById('mermaidPathMapArea');
    
    const askAssistantBtn = document.getElementById('askAssistantBtn');
    const cancelAssistantBtn = document.getElementById('cancelAssistantBtn');
    const assistantQueryInput = document.getElementById('assistantQueryInput');
    const assistantResponseArea = document.getElementById('assistantResponseArea');
    const assistantPanel = document.getElementById('assistantPanel');
    const assistantContextCheckboxes = document.getElementById('assistantCheckboxes');

    runBtn.disabled = true;

    const quickModelSelect = document.getElementById('quickModelSelect');
    quickModelSelect.addEventListener('change', (e) => {
        const modalSelect = document.getElementById('modelSelect');
        if (modalSelect) modalSelect.value = e.target.value;
        showToast(L('toast_model_switched', {model: e.target.value}));
    });

    document.getElementById('assistantPromptTemplates').addEventListener('change', function() {
        if (this.value) document.getElementById('assistantQueryInput').value = this.value;
    });

    document.getElementById('buildRuns').addEventListener('input', (e) => {
        const runs = parseInt(e.target.value) || 1;
        const sfCb = document.getElementById('smartFollowUpCb');
        if (runs > 1) { sfCb.disabled = false; } 
        else { sfCb.disabled = true; sfCb.checked = false; }
        updateContextWarning();
    });

    document.getElementById('smartFollowUpCb').addEventListener('change', (e) => {
        if(e.target.checked) document.getElementById('autoExploreCb').checked = false;
    });
    
    autoExploreCb.addEventListener('change', (e) => {
        if(e.target.checked) document.getElementById('smartFollowUpCb').checked = false;
        if (e.target.checked) {
            claimLabel.innerHTML = L('ui_lbl_claim_explore');
            claimTextarea.placeholder = L('ui_placeholder_claim_explore');
        } else {
            claimLabel.innerHTML = L('ui_lbl_claim_normal');
            claimTextarea.placeholder = L('ui_placeholder_claim_normal');
        }
    });

    providerSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const headerSelect = document.getElementById('quickModelSelect');
        
        if (val === 'gemini') { 
            apiKeyLabel.innerText = L('ui_lbl_key_gemini'); 
            //apiKeyInput.placeholder = L('ui_placeholder_key_gemini'); 
            apiKeyHelpLink.href = 'https://aistudio.google.com/apikey';
            apiKeyHelpLink.innerText = L('ui_link_get_key');
            apiKeyInput.style.display = 'block';
            
            const opts = `
                <option value="gemini-3.1-pro">${L('opt_gemini_31_pro')}</option>
                <option value="gemini-3.1-flash-lite" selected>${L('opt_gemini_31_flash_lite')}</option>
                <option value="gemini-3-flash-preview">${L('opt_gemini_3_flash_preview')}</option>
                <option value="gemma-4-31b-it">${L('opt_gemma_4_31b')}</option>
                <option value="gemma-4-26b-a4b-it">${L('opt_gemma_4_26b')}</option>
                <option value="gemini-2.5-pro">${L('opt_gemini_25_pro')}</option>
                <option value="gemini-2.5-flash">${L('opt_gemini_25_flash')}</option>
                <option value="gemini-2.5-flash-lite">${L('opt_gemini_25_flash_lite')}</option>`;
            modalModelContainer.innerHTML = `<select id="modelSelect">${opts}</select>`;
            headerSelect.innerHTML = opts;
            headerSelect.style.display = 'inline-block';
        }
        else if (val === 'openai') { 
            apiKeyLabel.innerText = L('ui_lbl_key_openai'); 
           // apiKeyInput.placeholder = L('ui_placeholder_key_openai');
            apiKeyHelpLink.href = 'https://platform.openai.com/api-keys';
            apiKeyHelpLink.innerText = L('ui_link_get_key');
            apiKeyInput.style.display = 'block';
            
            const opts = `<option value="gpt-4o" selected>GPT-4o</option><option value="gpt-4o-mini">GPT-4o-mini</option><option value="o1">o1</option><option value="o3-mini">o3-mini</option>`;
            modalModelContainer.innerHTML = `<select id="modelSelect">${opts}</select>`;
            headerSelect.innerHTML = opts;
            headerSelect.style.display = 'inline-block';
        }
        else if (val === 'openrouter') { 
            apiKeyLabel.innerText = L('ui_lbl_key_openrouter'); 
          //  apiKeyInput.placeholder = L('ui_placeholder_key_openrouter'); 
            apiKeyHelpLink.href = 'https://openrouter.ai/keys';
            apiKeyHelpLink.innerText = L('ui_link_get_key');
            apiKeyInput.style.display = 'block';
            
            modalModelContainer.innerHTML = `<input type="text" id="modelSelect" style="width:100%; padding:8px 10px; border-radius:0.8rem; border:1px solid #cbd5e1; font-size:0.9rem;" value="google/gemini-2.5-pro" placeholder="e.g., anthropic/claude-3.5-sonnet">`;
            headerSelect.style.display = 'none'; 
        }
        else if (val === 'localhost' || val === 'custom') {
            apiKeyLabel.innerText = L('ui_lbl_key_local'); 
          //  apiKeyInput.placeholder = L('ui_placeholder_key_local');
            apiKeyHelpLink.href = '#';
            apiKeyHelpLink.innerText = '';
            
            modalModelContainer.innerHTML = `
                <input type="text" id="customBaseUrl" placeholder="${L('ui_placeholder_base_url')}" style="width:100%; padding:8px 10px; border-radius:0.8rem; border:1px solid #cbd5e1; font-size:0.9rem; margin-bottom:8px;">
                <input type="text" id="customModelName" placeholder="${L('ui_placeholder_model_name')}" style="width:100%; padding:8px 10px; border-radius:0.8rem; border:1px solid #cbd5e1; font-size:0.9rem;">
            `;
            headerSelect.style.display = 'none';
        }
    });


    function updateTokenTracker() {
        if (!workflowTrace.stats) workflowTrace.stats = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
        if (tokenTracker) {
            tokenTracker.innerHTML = L('ui_token_tracker', {sess: session.stats.totalTokens.toLocaleString(), trace: workflowTrace.stats.totalTokens.toLocaleString()});
        }
    }

    function renderPromptSettings() {
        promptEditorsContainer.innerHTML = '';
        for (const key in PROMPT_SETTINGS) {
            const p = PROMPT_SETTINGS[key];
            const block = document.createElement('div');
            block.className = 'prompt-setting-block';
            block.innerHTML = `
                <h5>${p.name}</h5>
                <p>${L('ui_ps_purpose', {purpose: p.purpose, used: p.when_used})}</p>
                <textarea id="prompt_${key}" rows="4">${escapeHtml(p.content)}</textarea>
            `;
            promptEditorsContainer.appendChild(block);
        }
    }

function escapeHtml(str) { 
    if (str === undefined || str === null) return '';
    str = String(str);
    return str.replace(/[&<>"']/g, function(m) { 
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
        }
    }).replace(/<\/textarea/gi, '&lt;/textarea'); 
}

    openPromptSettingsBtn.addEventListener('click', () => { renderPromptSettings(); promptSettingsModal.style.display = 'flex'; });
    closePromptSettingsBtn.addEventListener('click', () => promptSettingsModal.style.display = 'none');
    savePromptSettingsBtn.addEventListener('click', () => {
        for (const key in PROMPT_SETTINGS) {
            const ta = document.getElementById(`prompt_${key}`);
            if(ta) PROMPT_SETTINGS[key].content = ta.value;
        }
        promptSettingsModal.style.display = 'none';
        showToast(L('toast_ps_saved'));
    });
    loadPromptFileBtn.addEventListener('click', () => promptFileInput.click());
    promptFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const loaded = JSON.parse(evt.target.result);
                let validKeysFound = 0;
                for (const key of Object.keys(loaded)) {
                    if (PROMPT_SETTINGS[key] && loaded[key].content) {
                        PROMPT_SETTINGS[key].content = loaded[key].content;
                        const el = document.getElementById('prompt_' + key);
                        if (el) el.value = loaded[key].content;
                        validKeysFound++;
                    }
                }
                syncDatapointsFromPromptDirective();
                if (validKeysFound === 0) showToast(L('toast_no_ps_keys'), true);
                else showToast(L('toast_ps_loaded', {count: validKeysFound}));
            } catch(err) { showToast(L('toast_err_parse', {err: err.message}), true); }
        };
        reader.readAsText(file);
        promptFileInput.value = '';
    });
    exportPromptFileBtn.addEventListener('click', () => {
        const toExport = {};
        for (const key in PROMPT_SETTINGS) {
            const ta = document.getElementById(`prompt_${key}`);
            toExport[key] = { name: PROMPT_SETTINGS[key].name, purpose: PROMPT_SETTINGS[key].purpose, when_used: PROMPT_SETTINGS[key].when_used, content: ta ? ta.value : PROMPT_SETTINGS[key].content };
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(toExport, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `pathmap_prompts_${Date.now()}.json`);
        dlAnchorElem.click();
        showToast(L('toast_ps_exported'));
    });

    function refreshQuadrantDisplay() {
        const blocks = finalResultArea.querySelectorAll('.quadrant-block');
        blocks.forEach(b => b.remove());
        const rc = document.getElementById('resultContent');
        if (rc && workflowTrace.quadrants.length > 0) rc.style.display = 'none';
        workflowTrace.quadrants.forEach(q => renderQuadrantBlock(q));
    }

      function updateContextWarning() {
        const b = parseInt(document.getElementById('breadthValInput')?.value || TOON_PROFILE.statBreadth || 10);
        const d = parseInt(document.getElementById('depthValInput')?.value || TOON_PROFILE.statDepth || 5);
        const runs = parseInt(document.getElementById('buildRuns')?.value || TOON_PROFILE.statLoops || 1);
        const evals = parseInt(document.getElementById('evalsPerRunInput')?.value || TOON_PROFILE.statEvals || 1);
        const modeEl = document.getElementById('analysisMode');
        const modeVal = modeEl ? modeEl.value : (TOON_PROFILE.statMode || "Social");
        const multiplier = (modeVal === "Social" || modeVal === "Phenotype" || modeVal === "Forensic" || modeVal === "Alignment" || modeVal === "Flexible") ? 1 : (modeVal === "Matrix" ? 25 : 5);
        const warningEl = document.getElementById('contextWarning');
        if (warningEl) {
            if (b * d * multiplier * runs * evals > 150) warningEl.style.display = 'block';
            else warningEl.style.display = 'none';
        }
    }
    
    function syncSliderInput(sliderId, inputId, callback) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);
        if(!slider || !input) return;
        slider.addEventListener('input', (e) => { input.value = e.target.value; if(callback) callback(); });
        input.addEventListener('input', (e) => { slider.value = e.target.value; if(callback) callback(); });
    }
    syncSliderInput('breadthSlider', 'breadthValInput', updateContextWarning);
    syncSliderInput('depthSlider', 'depthValInput', updateContextWarning);
    syncSliderInput('quotesSlider', 'quotesValInput');
syncSliderInput('apiDelaySlider', 'apiDelayValInput');
    syncSliderInput('evalsPerRunSlider', 'evalsPerRunInput', updateContextWarning);
    syncSliderInput('intentRespectSlider', 'intentRespectInput');
    
    analysisMode.addEventListener('change', (e) => {
        document.getElementById('flexibleModeControls').style.display = e.target.value === 'Flexible' ? 'block' : 'none';
        updateContextWarning();
    });

    document.getElementById('uploadClaimBtn').addEventListener('click', () => document.getElementById('claimFileInput').click());
    document.getElementById('claimFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => { claimTextarea.value += (claimTextarea.value ? "\n\n" : "") + evt.target.result; showToast(L('toast_claim_appended')); };
        reader.readAsText(file); e.target.value = '';
    });

   const clearEvBtn = document.getElementById('clearEvidenceBtn');
   document.getElementById('uploadEvidenceBtn').addEventListener('click', () => document.getElementById('evidenceFileInput').click());
    document.getElementById('evidenceFileInput').addEventListener('change', async (e) => {
        const files = e.target.files; 
        if (!files || files.length === 0) return;
        
        const listContainer = document.getElementById('customEvidenceList');
        const libSel = document.getElementById('librarySelect');

        for (let file of files) {
            const text = await file.text();
            customEvidenceBlob = (customEvidenceBlob ? customEvidenceBlob + "\n\n" : "") + `--- FILE: ${file.name} ---\n` + text;
            const fileItem = document.createElement('div');
            fileItem.innerText = `📄 ${file.name}`;
            listContainer.appendChild(fileItem);
        }
        
        showToast(L('toast_evi_loaded')); 
        
        if (!Array.from(libSel.options).some(o => o.value === 'Custom')) {
            const opt = document.createElement('option');
            opt.value = 'Custom';
            opt.innerText = L('opt_lib_custom') || 'Custom Loaded Evidence';
            libSel.appendChild(opt);
        }
        libSel.value = 'Custom';
        libSel.disabled = true; // Disable selection while custom evidence is loaded
        clearEvBtn.style.display = 'inline-flex';
        
        // Show Assistant switch when custom file is loaded
        const assistEvContainer = document.getElementById('assistantCustomEvidenceContainer');
        if (assistEvContainer) assistEvContainer.style.display = 'flex';
        
        e.target.value = '';
    });

    clearEvBtn.addEventListener('click', () => {
        customEvidenceBlob = null;
        document.getElementById('customEvidenceList').innerHTML = "";
        const libSel = document.getElementById('librarySelect');
        Array.from(libSel.options).forEach(opt => {
            if(opt.value === 'Custom') opt.remove();
        });
        libSel.value = 'PubMed';
        libSel.disabled = false; // Re-enable library selection
        clearEvBtn.style.display = 'none';
        
        // Hide and reset Assistant switch
        const assistEvContainer = document.getElementById('assistantCustomEvidenceContainer');
        if (assistEvContainer) assistEvContainer.style.display = 'none';
        const assistEvCb = document.getElementById('assistantCustomEvidenceCb');
        if (assistEvCb) assistEvCb.checked = false;
        
	showToast(L('toast_ev_cleared'));
    });

    // Revalidate / Rebuild Button Logic
   document.getElementById('revalidateBtn').addEventListener('click', async () => {
        const btn = document.getElementById('revalidateBtn');
        btn.innerText = L('ui_btn_rebuilding');
        btn.disabled = true;
        
        abortController = new AbortController();
        
        const overlay = document.getElementById('learningOverlay');
        const progressText = document.getElementById('learningProgressText');
        if (progressText) progressText.innerHTML = L('log_rebuilding_visualizations', {name: TOON_PROFILE.name.split(' ')[0]});
        
        try {
            await buildVisualizationsAndUI(abortController.signal, true);
            showToast(L('toast_vis_rebuilt'));
        } catch(e) {
            if (e.name === 'AbortError') {
                showToast(L('toast_wf_cancel'), true);
            } else {
                showToast(L('toast_err_rebuild', {err: e.message}), true);
            }
        } finally {
            if (overlay) overlay.style.display = 'none';
            btn.style.display = 'none';
            btn.disabled = false;
            btn.innerText = L('ui_btn_rebuild_vis');
            
            // Clean up abort state and restore cancel button
            abortController = null;
            const cancelBtnNode = document.getElementById('cancelBtn');
            if (cancelBtnNode) {
                cancelBtnNode.disabled = false;
                cancelBtnNode.innerText = L('ui_btn_cancel') || 'Abort Workflow';
            }
        }
    });


    document.getElementById('uploadFlexiblePromptBtn').addEventListener('click', () => document.getElementById('flexiblePromptFileInput').click());
    document.getElementById('flexiblePromptFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => { flexiblePromptText = evt.target.result; showToast(L('toast_cmd_uploaded')); };
        reader.readAsText(file); e.target.value = '';
    });

function addLog(msg, isError = false) {
    const timestampedMsg = `[${new Date().toLocaleTimeString()}] ${msg}`;
    
    // 1. Write to the standard workflow status log
    if (statusDiv) {
        const entry = document.createElement('div');
        entry.innerText = timestampedMsg;
        entry.style.color = isError ? '#dc2626' : '#FFFFFF';
        statusDiv.appendChild(entry);
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }

    // 2. Write to the visible translation loader status log
     const transStatusDiv = document.getElementById('translationStatusLog');
    if (transStatusDiv) {
        const transEntry = document.createElement('div');
        transEntry.innerText = timestampedMsg;
        transEntry.style.color = isError ? '#dc2626' : '#FFFFFF'; // High-contrast slate color
        transEntry.style.marginBottom = '4px';
        transStatusDiv.appendChild(transEntry);
        transStatusDiv.scrollTop = transStatusDiv.scrollHeight;
    }

    workflowTrace.executionLog.push(timestampedMsg); 
}


    function showToast(msg, isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = msg;
        toast.style.background = isError ? '#b91c1c' : '#1e293b';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

 function verifyPlaceholders(orig, trans) {
        const regex = /\{[a-zA-Z0-9_]+\}/g;
        const origMatches = orig.match(regex) || [];
        const transMatches = trans.match(regex) || [];
        if (origMatches.length !== transMatches.length) return false;
        return origMatches.every(m => transMatches.includes(m));
    }

     
async function translateSystemWithAI(targetLang) {
    const overlay = document.getElementById('translationOverlay');
    const waitText = document.getElementById('translationWaitText');
    const cancelBtn = document.getElementById('cancelTranslationBtn');
    const transStatusDiv = document.getElementById('translationStatusLog');
    
    if (transStatusDiv) {
        // Enforce strong visual styling and high-contrast colors directly
        transStatusDiv.style.cssText = `
            display: block !important;
            background-color: #f8fafc !important;
            color: #1e293b !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            padding: 12px !important;
            margin: 20px auto 0 auto !important;
            max-width: 600px !important;
            width: 90% !important;
            max-height: 180px !important;
            overflow-y: auto !important;
            font-family: monospace !important;
            font-size: 0.8rem !important;
            text-align: left !important;
            opacity: 1 !important;
            visibility: visible !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
        `;
const safeTargetLanguage = escapeHtml(targetLanguage);
transStatusDiv.innerHTML = DOMPurify.sanitize(`<div style="color: #64748b;">[System] Connecting to API for ${safeTargetLanguage} localization...</div>`);
    }
    
    overlay.style.display = 'flex';
    
    try {
        // Fast Translation loader ping
        const pingPrompt = `Translate the following 2 phrases into ${targetLang}. Return ONLY valid JSON: {"wait": "Please wait while we translate the engine for you.  This may take several minutes when loading for the first time, please be patient.  Thank you and enjoy!", "cancel": "Cancel"}`;
        const { text: pingText } = await callAI(pingPrompt, "Return ONLY JSON.");
        const pingJson = JSON.parse(pingText.replace(/```json/gi, '').replace(/```/g, '').trim());
        if (pingJson.wait) waitText.innerText = pingJson.wait;
        if (pingJson.cancel) cancelBtn.innerText = pingJson.cancel;
    } catch (e) {
        console.warn("Pre-translation ping failed, proceeding with default English loading text.");
    }

    // PASS 1: LOCALIZING UI LABELS (LANG)
    let uiValid = false;
    let uiAttempt = 1;
    let uiFeedback = "";

    while (!uiValid) {
const safeTargetLang = escapeHtml(targetLang);
addLog(`🌍 Localizing UI Labels into ${safeTargetLang} (Pass 1 - Attempt ${uiAttempt})...`);
        let uiPrompt = `You are an expert software localization engine. Translate the following user interface dictionary strictly into ${targetLang}.
        
        CRITICAL RULES:
        1. Translate ONLY the values. Keep JSON keys exactly the same.
        2. Output ONLY valid, parseable JSON.
        3. STRICT VARIABLE RETENTION: Placeholders wrapped in {} (e.g. {sess}, {err}) MUST be retained exactly. Do not translate the text inside the braces, do not remove them, and do not add new ones.`;

        if (uiFeedback) {
            uiPrompt += DOMPurify.sanitize(`\n\n⚠️ PREVIOUS ATTEMPT FAILED VARIABLE VALIDATION. FIX THESE ERRORS NOW:\n${uiFeedback}\n`);
        }

        uiPrompt += DOMPurify.sanitize(`\n\nTarget UI JSON:\n${JSON.stringify(LANG, null, 2)}`);

        try {
            const { text: responseText } = await callAI(uiPrompt, "You return ONLY a single, valid JSON block.");
            const parsedResult = JSON.parse(responseText.replace(/```json/gi, '').replace(/```/g, '').trim());

            // Validate UI variables
            let errors = [];
            for (let key in LANG) {
                if (!parsedResult[key]) continue;
                const origVars = extractPlaceholders(LANG[key]);
                const transVars = extractPlaceholders(parsedResult[key]);
                if (origVars.join(',') !== transVars.join(',')) {
                    errors.push(`[UI] Key "${key}" variable mismatch. Expected: [${origVars.join(', ')}] | Got: [${transVars.join(', ')}]`);
                }
            }

             if (errors.length > 0) {
                uiFeedback = errors.join('\n');
                addLog(`⚠️ UI translation validation failed (Attempt ${uiAttempt})...`, true);
                uiAttempt++;
                continue;
            }

            for (let key in parsedResult) {
                if (key !== '__proto__' && key !== 'constructor') {
                    LANG[key] = parsedResult[key];
                }
            }
            translateUI(); // Render translated UI labels immediately
            uiValid = true;
         } catch (err) {
                        addLog(`⚠️ UI translation parsing/API error (Attempt ${uiAttempt}): ${err.message}. Retrying...`, true);
                        
                        // NEW: Populate feedback with syntax correction instructions
                        uiFeedback = `Your previous attempt failed JSON parsing with error: "${err.message}". 
                        CRITICAL INSTRUCTION: Ensure you return ONLY a single, valid, raw, parseable JSON block. 
                        Do not include conversational prefaces, and do not wrap the JSON inside markdown code blocks (such as \`\`\`json ... \`\`\`).`;
                        
                        uiAttempt++;
                        await new Promise(r => setTimeout(r, 2000));
                    }
            }

            overlay.style.display = 'none';
        }


async function enableAppAfterKey() {
    // Immediately hide the API Key Modal
    modal.style.display = 'none';

    // Capture and save the typed language preference on submission
    const typedLanguage = document.getElementById('langOverrideInput').value.trim();
    if (typedLanguage) {
        targetLanguage = typedLanguage;
        localStorage.setItem('target_language_preference', targetLanguage);
    } else {
        localStorage.removeItem('target_language_preference');
        const browserLangCode = navigator.language || navigator.userLanguage || 'en';
        try {
            targetLanguage = new Intl.DisplayNames(['en'], { type: 'language' }).of(browserLangCode) || browserLangCode;
        } catch (e) {
            targetLanguage = browserLangCode;
        }
    }
isEnglishBrowser = targetLanguage.toLowerCase().includes('english') || targetLanguage.toLowerCase().startsWith('en');

    if (isEnglishBrowser) {
        // Restore original English assets
        for (let key in ORIGINAL_LANG) {
            if (key !== '__proto__' && key !== 'constructor') {
                LANG[key] = ORIGINAL_LANG[key];
            }
        }
        for (let key in ORIGINAL_PROMPTS) {
            if (PROMPT_SETTINGS[key]) {
                PROMPT_SETTINGS[key].content = ORIGINAL_PROMPTS[key];
            }
        }
        translateUI();
    } else {
        try {
             const cacheKey = `${TOON_PROFILE.name}_${targetLanguage}_${APP_VERSION}`;
            addLog(L('log_checking_cache', {key: cacheKey}));
            const cached = await loadTranslationFromCache(cacheKey);
            
            if (cached && cached.lang && cached.prompts) {
                addLog(L('log_cache_found'));
                for (let key in cached.lang) {
                    if (key !== '__proto__' && key !== 'constructor') {
                        LANG[key] = cached.lang[key];
                    }
                }
                for (let key in cached.prompts) {
                    if (PROMPT_SETTINGS[key]) {
                        PROMPT_SETTINGS[key].content = cached.prompts[key];
                    }
                }
                translateUI(); // Render instantly
                showToast(L('toast_trace_restored'));
            } else {
                addLog(L('log_cache_missing'));
                await translateSystemWithAI(targetLanguage);
                
                // Extract compiled prompt content to save to cache
                const compiledPrompts = {};
                for (let key in PROMPT_SETTINGS) {
                    compiledPrompts[key] = PROMPT_SETTINGS[key].content;
                }
                
                addLog(L('log_cache_saved'));
                await saveTranslationToCache(cacheKey, LANG, compiledPrompts);
            }
        } catch (err) {
            addLog(L('log_cache_err', {err: err.message}), true);
            document.getElementById('translationOverlay').style.display = 'none'; // Fallback removal
        }
    }


    // Now safely mark session ready and unlock UI controls
    session.isReady = true;

let customModelEl = document.getElementById('customModelName');
    let modelSelectEl = document.getElementById('modelSelect');
    let modelName = session.provider === 'localhost' || session.provider === 'custom' 
        ? (customModelEl ? customModelEl.value : 'llama3:latest') 
        : (modelSelectEl ? modelSelectEl.value : 'gemini-3.1-flash-lite');

    document.getElementById('keyStatusLine').innerHTML = DOMPurify.sanitize(L('label_key_loaded') + " " + escapeHtml(modelName));
    document.getElementById('headerModelContainer').style.display = 'flex';
    if(session.provider !== 'openrouter' && session.provider !== 'localhost' && session.provider !== 'custom') {
        document.getElementById('quickModelSelect').style.display = 'inline-block';
        document.getElementById('quickModelSelect').value = document.getElementById('modelSelect').value;
    }
   document.getElementById('logoutBtn').style.display = 'inline-flex';
    document.getElementById('headerLoginBtn').style.display = 'none'; // Hide Connect button on success
    document.getElementById('geminiApiKeyInput').value = ''; // Secure key: instantly clear from DOM input element

    // Unlock Chat Assistant Panel
    document.getElementById('askAssistantBtn').disabled = false;
    document.getElementById('assistantQueryInput').disabled = false;
    document.getElementById('assistantQueryInput').placeholder = L('ui_placeholder_assist') || "Ask the Assistant...";

    // UNLOCK UI CONTROLS AFTER TRANSLATION IS DONE
    runBtn.disabled = false;
    doAnotherBtn.disabled = false;
    openPromptSettingsBtn.disabled = false;
    document.getElementById('demoBtn').disabled = false;
    document.getElementById('openDatapointsBtn').disabled = false;
    addLog(L('log_sess_ready', {prov: session.provider.toUpperCase()}));
}



    function applyGlobalCitationsToQuadrants() {
        let globalSeq = 1;
        workflowTrace.globalCitationMap = {};
        let orderedIds = [];

 workflowTrace.quadrants.forEach(q => {
            if (q.metrics && q.metrics.Verbatim_Quotes) {
                q.metrics.Verbatim_Quotes.forEach(quoteObj => {
                    const id = String(quoteObj.source_id).replace(/^(PMID:?\s*|ID:?\s*|Wiki ID:?\s*|arXiv ID:?\s*)/i, '').trim();
                    if (id && !workflowTrace.globalCitationMap[id]) {
                        workflowTrace.globalCitationMap[id] = globalSeq++;
                        orderedIds.push(id);
                    }
                });
            }
        });

        workflowTrace.quadrants.forEach(q => {
            let baseText = q.rawResponse ? q.rawResponse.split('###JSON_START###')[0].trim() : (q.displayText || "");
            if (baseText.includes('### [PROGRAMATICALLY MAPPED REFERENCES]')) {
                baseText = baseText.split('### [PROGRAMATICALLY MAPPED REFERENCES]')[0].trim();
            }

            let newText = baseText;
            if (q.metrics && q.metrics.Verbatim_Quotes) {
                const quadrantValidIds = q.metrics.Verbatim_Quotes.map(v => 
                    String(v.source_id).replace(/^(ID:?\s*|ID:?\s*|Wiki ID:?\s*|arXiv ID:?\s*)/i, '').trim()
                );
                const uniqueIds = [...new Set(quadrantValidIds)].sort((a, b) => 
                    workflowTrace.globalCitationMap[a] - workflowTrace.globalCitationMap[b]
                );

                if (uniqueIds.length > 0) {
                    newText += "\n\n### [PROGRAMATICALLY MAPPED REFERENCES]\n";
                    uniqueIds.forEach(id => {
                        const gId = workflowTrace.globalCitationMap[id];
                        const apa = workflowTrace.apaCitations[id] || "Citation data unavailable.";
                        let prefix = id.match(/^\d+$/) ? `ID: ${id}` : `ID: ${id}`;
                        newText += DOMPurify.sanitize(`[${gId}]. ${prefix} - APA: ${apa}\n`);
                    });
                }
            }
            q.displayText = newText;
        });
    }

    function validateQuotesWithSources(quotesArray, contextBlob) {
        const results = [];
        const normalizedContext = contextBlob.replace(/\s+/g, ' ');

        for (let item of quotesArray) {
            const { quote, source_id } = item;
            const cleanId = String(source_id).replace(/^(PMID:?\s*|ID:?\s*|Wiki ID:?\s*|arXiv ID:?\s*)/i, '').trim();
            const normalizedQuote = quote.replace(/\s+/g, ' ').trim();
            
            let status = 'FAIL';
            let errorMsg = '';
            
            if (normalizedQuote.includes('...')) {
                errorMsg = L('err_ellipses');
            } else if (!normalizedContext.includes(normalizedQuote)) {
                errorMsg = L('err_strict_misquote', {quote: quote.substring(0, 35)});
            } else {
                status = 'PASS';
            }
            
            results.push({ quote: quote, source_id: cleanId, status, error: errorMsg, abstract_text: "Found in provided context." });
        }
        return results;
    }

    async function callAI(promptText, systemHint = null, signal = null, maxRetries = 10) {
        if (!session.apiKey && session.provider !== 'localhost' && session.provider !== 'custom') throw new Error(L('toast_api_req'));
        const provider = session.provider;
        let currentModel = document.getElementById('modelSelect') ? document.getElementById('modelSelect').value : "";
        let url, headers, body;

        if (provider === 'gemini') {
            url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${session.apiKey}`;
            headers = { 'Content-Type': 'application/json' };
            const payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
            if (systemHint) payload.systemInstruction = { parts: [{ text: systemHint }] };
            body = JSON.stringify(payload);
} else if (provider === 'localhost' || provider === 'custom') {
            const customBaseEl = document.getElementById('customBaseUrl');
            url = (customBaseEl ? customBaseEl.value : "http://localhost:11434/v1") + "/chat/completions";
            headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer local' };
            let msgs = [];
            if (systemHint) msgs.push({ role: "system", content: systemHint });
            msgs.push({ role: "user", content: promptText });
            const customModelEl = document.getElementById('customModelName');
            body = JSON.stringify({ model: (customModelEl ? customModelEl.value : 'llama3:latest'), messages: msgs });
        } else {
            url = provider === 'openrouter' ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.apiKey}`
            };
            if (provider === 'openrouter') headers['HTTP-Referer'] = window.location.href;
            
            let msgs = [];
            if (systemHint) msgs.push({ role: "system", content: systemHint });
            msgs.push({ role: "user", content: promptText });
            body = JSON.stringify({ model: currentModel, messages: msgs });
        }

        let attempt = 0;
        let consecutive429s = 0;
        const delaySec = parseFloat(document.getElementById('apiDelayValInput')?.value || TOON_PROFILE.statDelay || 10);
        if (delaySec > 0) await new Promise(r => setTimeout(r, delaySec * 1000));
        let lastError = null;

        while (attempt <= maxRetries) {
            try {
                const response = await fetch(url, { method: 'POST', headers, body, signal });
                if (!response.ok) {
                    if (response.status === 429) consecutive429s++;
                    else consecutive429s = 0; 
                    const errText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errText.substring(0, 100)}`);
                }
                consecutive429s = 0; 
                const data = await response.json();

                let pTokens = 0, cTokens = 0;
                if (provider === 'gemini' && data.usageMetadata) {
                    pTokens = data.usageMetadata.promptTokenCount || 0;
                    cTokens = data.usageMetadata.candidatesTokenCount || 0;
                } else if (data.usage) {
                    pTokens = data.usage.prompt_tokens || 0;
                    cTokens = data.usage.completion_tokens || 0;
                }
                session.stats.promptTokens += pTokens; session.stats.completionTokens += cTokens; session.stats.totalTokens += (pTokens + cTokens);
                if (!workflowTrace.stats) workflowTrace.stats = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
                workflowTrace.stats.promptTokens += pTokens; workflowTrace.stats.completionTokens += cTokens; workflowTrace.stats.totalTokens += (pTokens + cTokens);
                updateTokenTracker();

                let text = "";
                if (provider === 'gemini') {
                    if (data.promptFeedback?.blockReason) throw new Error(`Blocked: ${data.promptFeedback.blockReason}`);
                    const parts = data.candidates[0].content?.parts;
                    const textParts = parts.filter(p => p.text && !p.thought);
                    text = textParts.length > 0 ? textParts[textParts.length - 1].text.trim() : parts[parts.length - 1].text.trim();
                } else {
                    text = data.choices[0].message.content;
                }
                let thought = text.match(/<think>([\s\S]*?)<\/think>/)?.[1] || null;
                return { text: text.replace(/<think>[\s\S]*?<\/think>/, '').trim(), thought };
                
            } catch (err) {
                lastError = err;
                if (err.name === 'AbortError') throw err;
                
                if (consecutive429s >= 5) {
                    addLog(L('log_quota_exhausted'), true);
                    throw new Error("API Quota Exhausted (5x 429)");
                }

                attempt++;
                if (attempt > maxRetries) throw lastError;

                const delay = Math.pow(2, attempt) * 10000 + Math.random() * 1000;
                addLog(L('log_api_err', {err: err.message, sec: Math.round(delay/1000)}), true);
                
                await new Promise(r => {
                    const timeoutId = setTimeout(r, delay);
                    if(signal) signal.addEventListener('abort', () => { clearTimeout(timeoutId); r(); });
                });
                if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
            }
        }
        throw lastError;
    }

    async function generateQuadrants(claim, signal) {
        addLog(L('log_gen_quads'));
        const prompt = PROMPT_SETTINGS.quadrant_generation.content + `\nClaim: "${claim}"`;
        const { text: raw } = await callAI(prompt, "You are an analytical engine. Return ONLY JSON.", signal);
        try {
            const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(clean);
        } catch (e) { throw new Error("Failed to parse pentamatrix JSON. Please check claim format."); }
    }


    async function generateBooleans(text, library, breadth, signal) {
        const prompt = PROMPT_SETTINGS.boolean_generation.content
                        .replace(/{library}/g, library)
                        .replace(/{breadth}/g, breadth) + `\nText: "${text}"`;
        const { text: raw } = await callAI(prompt, "You return only plain text line-separated queries.", signal);
        
        return raw.split(/\r?\n/)
            .map(line => {
                let clean = line.trim();
                // Strip markdown fences (``` or ```plaintext) introduced by newer default models
                clean = clean.replace(/```[a-zA-Z]*/gi, '').replace(/```/g, '').trim();
                return clean;
            })
            .filter(l => l.length > 0)
            .slice(0, breadth);
    }
    async function fetchNodeIDs(queries, library, depth, signal) {
        const idSet = new Set();
        let processedQueries = [];
        for (let q of queries) {
            let processed = q;
            if (library === "arXiv") {
                const safeQuery = q.replace(/\b(AND|OR|NOT)\b/gi, ' ').replace(/[()"]/g, ' ').replace(/\s+/g, ' ').trim();
                const arxivTerms = safeQuery.split(' ').filter(Boolean).map(w => `all:${w}`);
                processed = arxivTerms.join(' AND ');
            }
            processedQueries.push(`(${processed})`); 
        }

        const SAFE_URL_LIMIT = 1500; 
        let batches = [];
        let currentBatch = [];
        let currentLen = 0;

        for (let q of processedQueries) {
            const encodedLen = encodeURIComponent(" OR " + q).length;
            if (currentBatch.length > 0 && (currentLen + encodedLen > SAFE_URL_LIMIT)) {
                batches.push(currentBatch);
                currentBatch = [];
                currentLen = 0;
            }
            currentBatch.push(q);
            currentLen += encodedLen;
        }
        if (currentBatch.length > 0) batches.push(currentBatch);

        for (let batch of batches) {
            if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
            let combinedQuery = batch.join(" OR ");
            let encoded = encodeURIComponent(combinedQuery);
            let batchDepth = depth * batch.length; 
            
            try {
                if (library === "PubMed") {
                    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encoded}&retmax=${batchDepth}&format=json`;
                    const resp = await fetch(url, { signal });
                    const data = await resp.json();
                    (data.esearchresult?.idlist || []).forEach(id => idSet.add(id));
                } else if (library === "OpenAlex") {
                    let pageDepth = Math.min(batchDepth, 200); 
                    const url = `https://api.openalex.org/works?search=${encoded}&per-page=${pageDepth}`;
                    const resp = await fetch(url, { signal });
                    const data = await resp.json();
                    (data.results || []).forEach(item => idSet.add(item.id.replace('https://openalex.org/', '')));
                } else if (library === "Wikipedia") {
                    let pageDepth = Math.min(depth, 50); 
                    for (let queryStr of batch) {
                        if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
                        const cleanQuery = queryStr.replace(/\b(AND|OR|NOT)\b/gi, ' ').replace(/[()"]/g, ' ').replace(/\s+/g, ' ').trim();
                        if (!cleanQuery) continue;
                        let encodedQuery = encodeURIComponent(cleanQuery);
                        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&utf8=&format=json&origin=*&srlimit=${pageDepth}`;
                        try {
                            const resp = await fetch(url, { signal });
                            const data = await resp.json();
                            (data.query?.search || []).forEach(item => idSet.add(item.pageid.toString()));
                        } catch (err) { if (err.name === 'AbortError') throw err; }
                    }
                 } else if (library === "arXiv") {
                    const url = `https://export.arxiv.org/api/query?search_query=${encoded}&start=0&max_results=${batchDepth}`;
                    const resp = await fetch(url, { signal });
                    const text = await resp.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, "text/xml");
                    const entries = xml.querySelectorAll("entry");
                    entries.forEach(entry => {
                        const id = entry.querySelector("id")?.textContent;
                        if(id) idSet.add(id);
                    });
                }
            } catch (e) { if (e.name === 'AbortError') throw e; }

            await new Promise(r => { const t = setTimeout(r, 1000); if (signal) signal.addEventListener('abort', () => { clearTimeout(t); r(); }); });
        }
        
        const uniqueIds = Array.from(idSet);
        if (uniqueIds.length === 0 && library === "arXiv") {
            addLog(L('log_arxiv_0'), true);
            workflowTrace.arxiv_status = "unavailable";
            throw new Error(`arXiv returned 0 results.`);
        }
        return uniqueIds;
    }

    async function fetchLibraryContentMap(ids, library, signal) {
        if (ids.length === 0) return {};
        const map = {};
        try {
            if (library === "PubMed") {
                const chunks =[];
                for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100));
                
                for (let chunk of chunks) {
                    if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
                    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${chunk.join(',')}&rettype=abstract&retmode=xml`;
                    const resp = await fetch(url, { signal });
                    const xmlText = await resp.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(xmlText, "text/xml");
                    const articles = xml.querySelectorAll("PubmedArticle");
                    
                   articles.forEach(art => {
                        const pmid = art.querySelector("PMID")?.textContent;
                        const title = art.querySelector("ArticleTitle")?.textContent || "";
                        const abs = Array.from(art.querySelectorAll("AbstractText")).map(n => n.textContent).join(" ");
                        
                        const pubYear = art.querySelector("PubDate Year")?.textContent || art.querySelector("ArticleDate Year")?.textContent || art.querySelector("Year")?.textContent || "n.d.";
                        let authors = [];
                        art.querySelectorAll("Author").forEach(a => {
                            const last = a.querySelector("LastName")?.textContent;
                            const init = a.querySelector("Initials")?.textContent;
                            if(last) authors.push(`${last} ${init||''}`.trim());
                        });
                        const authorStr = authors.length > 0 ? (authors.length > 5 ? authors.slice(0,5).join(', ') + ' et al.' : authors.join(', ')) : "Anonymous";
                        const journal = art.querySelector("Title")?.textContent || "";
                        
                        if (pmid) {
                            map[pmid] = `ID: ${pmid}\nTitle: ${title}\nAbstract: ${abs}`;
                            workflowTrace.apaCitations[pmid] = `${authorStr} (${pubYear}). ${title}. ${journal}. ID: ${pmid}.`;
                            
                            if (workflowTrace.settings.tagCloud === 'on') {
                                const tagNodes =[...art.querySelectorAll("DescriptorName"), ...art.querySelectorAll("Keyword")];
                                tagNodes.forEach(n => {
                                    const word = n.textContent.toLowerCase();
                                    workflowTrace.globalTags[word] = (workflowTrace.globalTags[word] || 0) + 1;
                                });
                            }
                        }
                    });
                    await new Promise(r => { const t = setTimeout(r, 1000); if (signal) signal.addEventListener('abort', () => { clearTimeout(t); r(); }); });
                }
            } else if (library === "OpenAlex") {
                const chunks = [];
                for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));
                for (let chunk of chunks) {
                    if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
                    const url = `https://api.openalex.org/works?filter=openalex:${chunk.join('|')}`;
                    const resp = await fetch(url, { signal });
                    const data = await resp.json();
                    (data.results || []).forEach(work => {
                        const id = work.id.replace('https://openalex.org/', '');
                        const title = work.title || "Untitled";
                        let abstract = "Abstract not available.";
                        if (work.abstract_inverted_index) {
                            const index = work.abstract_inverted_index;
                            const wordArr = [];
                            for (const [word, posArray] of Object.entries(index)) {
                                posArray.forEach(pos => { wordArr[pos] = word; });
                            }
                            for(let k=0; k<wordArr.length; k++) if(!wordArr[k]) wordArr[k] = "";
                            abstract = wordArr.filter(w => w !== undefined).join(' ').replace(/\s+/g, ' ').trim();
                        }
                        const pubYear = work.publication_year || "n.d.";
                        const authorStr = work.authorships && work.authorships.length > 0 ? work.authorships.map(a => a.author.display_name).join(', ') : "Anonymous";
                        const journal = work.primary_location?.source?.display_name || "Unknown Source";
                        
                        map[id] = `ID: ${id}\nTitle: ${title}\nAbstract: ${abstract}`;
                        workflowTrace.apaCitations[id] = `${authorStr} (${pubYear}). ${title}. ${journal}. ID: ${id}.`;
                        
                        if (workflowTrace.settings.tagCloud === 'on' && work.concepts) {
                            work.concepts.forEach(c => {
                                const term = c.display_name.toLowerCase();
                                workflowTrace.globalTags[term] = (workflowTrace.globalTags[term] || 0) + 1;
                            });
                        }
                    });
                }
            } else if (library === "Wikipedia") {
                const chunks =[];
                for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));
                for (let chunk of chunks) {
                    if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
                    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=max&pageids=${chunk.join('|')}&explaintext=1&format=json&origin=*`;
                    const resp = await fetch(url, { signal });
                    const data = await resp.json();
                    const pages = data.query?.pages || {};
                    Object.values(pages).forEach(val => {
                        if (val.extract) {
                            map[val.pageid.toString()] = `Wiki ID: ${val.pageid}\nTitle: ${val.title}\nExtract: ${val.extract}`;
                            workflowTrace.apaCitations[val.pageid.toString()] = `Wikipedia Contributors. (n.d.). ${val.title}. In Wikipedia, The Free Encyclopedia. Retrieved. Wiki ID: ${val.pageid}.`;
                            
                            if (workflowTrace.settings.tagCloud === 'on') {
                                val.title.split(' ').forEach(w => {
                                    if(w.length > 4) workflowTrace.globalTags[w.toLowerCase()] = (workflowTrace.globalTags[w.toLowerCase()] || 0) + 1;
                                });
                            }
                        }
                    });
                }
            } else if (library === "arXiv") {
                const chunks =[];
                for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
                for (let chunk of chunks) {
                    if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
                    const cleanIds = chunk.map(url => url.split('/abs/')[1]).filter(Boolean);
                    if (cleanIds.length === 0) continue;
                    
                    const url = `https://export.arxiv.org/api/query?id_list=${cleanIds.join(',')}`;
                    const resp = await fetch(url, { signal });
                    const text = await resp.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, "text/xml");
                    const entries = xml.querySelectorAll("entry");
                    
                    entries.forEach(entry => {
                        const idUrl = entry.querySelector("id")?.textContent;
                        const title = entry.querySelector("title")?.textContent;
                        const summary = entry.querySelector("summary")?.textContent;
                        const pubDate = entry.querySelector("published")?.textContent?.substring(0,4) || "n.d.";
                        
                        let authors = [];
                        entry.querySelectorAll("author name").forEach(n => authors.push(n.textContent));
                        const authorStr = authors.length > 0 ? (authors.length > 5 ? authors.slice(0,5).join(', ') + ' et al.' : authors.join(', ')) : "Anonymous";
                        
                        if (idUrl && summary) {
                            map[idUrl] = `arXiv ID: ${idUrl}\nTitle: ${title}\nAbstract: ${summary}`;
                            workflowTrace.apaCitations[idUrl] = `${authorStr} (${pubDate}). ${title}. arXiv preprint. ID: ${idUrl}.`;
                            
                            if (workflowTrace.settings.tagCloud === 'on') {
                                const cats = entry.querySelectorAll("category");
                                cats.forEach(c => {
                                    const term = c.getAttribute("term");
                                    if(term) workflowTrace.globalTags[term.toLowerCase()] = (workflowTrace.globalTags[term.toLowerCase()] || 0) + 1;
                                });
                            }
                        }
                    });
                }
            }
        } catch (e) { if (e.name === 'AbortError') throw e; }

        return map;
    }

  async function executeQuadrantRAG(quadrantText, abstractsBlob, feedbackContext, settings, signal) {
    const numQuotes = document.getElementById('quotesValInput')?.value || TOON_PROFILE.statQuotes || 5;
    let sysPersona = settings.rigor === "Strict" ? PROMPT_SETTINGS.persona_strict.content : PROMPT_SETTINGS.persona_heuristic.content;
    
    let formatReq = "";
    if (settings.format === "Preprint") formatReq = PROMPT_SETTINGS.format_preprint.content;
    else if (settings.format === "Clinical") formatReq = PROMPT_SETTINGS.format_clinical.content;
    else formatReq = PROMPT_SETTINGS.format_standard.content;

    let socialPrepend = "";
    if (settings.mode === "Social") socialPrepend = PROMPT_SETTINGS.social_mode_prepend.content;
    else if (settings.mode === "Alignment") socialPrepend = PROMPT_SETTINGS.alignment_mode_prepend.content;
    
   formatReq = formatReq.replace(/\{numQuotes\}/g, numQuotes);
    let evaluationSchema = PROMPT_SETTINGS.core_evaluation_schema.content.replace(/\{numQuotes\}/g, numQuotes);

    let customKeysStr = "";
    if (activeCustomDatapoints && activeCustomDatapoints.length > 0) {
        customKeysStr = activeCustomDatapoints.map(dp => {
            const instrLower = dp.instruction.toLowerCase();
            const cleanInstr = dp.instruction.replace(/"/g, '\\"');
            if (instrLower.includes('json') || instrLower.includes('dictionary') || instrLower.includes('object') || cleanInstr.includes('":"') || cleanInstr.includes('":')) {
                let placeholderKey = "Entity-Zn Affinity";
                const exampleMatch = cleanInstr.match(/"([^"]+-Zn Affinity)"/i) || cleanInstr.match(/"([^"]+)"\s*:/);
                if (exampleMatch && exampleMatch[1]) placeholderKey = exampleMatch[1];
                return `"${dp.key}": { "${placeholderKey}": "[Extract: ${cleanInstr}]" }`;
            } else {
                return `"${dp.key}": "[Extract: ${cleanInstr}]"`;
            }
        }).join(",\n  ");
        
        const lastBraceIndex = evaluationSchema.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            evaluationSchema = evaluationSchema.substring(0, lastBraceIndex) + `,\n  ${customKeysStr}\n` + evaluationSchema.substring(lastBraceIndex);
        }
    }

    let promptPrepend = "";
if (feedbackContext && feedbackContext.includes("CRITICAL QUOTE VALIDATION FAILURE")) {
    promptPrepend = PROMPT_SETTINGS.validation_rules_feedback.content + "\n\n";
}

    let customDirectiveText = "";
    if (PROMPT_SETTINGS.custom_datapoints_directive && PROMPT_SETTINGS.custom_datapoints_directive.content) {
        customDirectiveText = PROMPT_SETTINGS.custom_datapoints_directive.content + "\n\n";
    }

    let prompt = `CRITICAL INSTRUCTION: You MUST wrap your internal reasoning in <think>...</think> tags at the very beginning of your response.\n\n=======================================================\nCONTEXT LITERATURE (STATIC CACHE):\n${abstractsBlob}\n=======================================================\n\n${customDirectiveText}Format Requirement:\n${formatReq}\n\nEvaluation Schema:\n${evaluationSchema}`;
    

    if (feedbackContext && feedbackContext.trim() !== "") {
        prompt += DOMPurify.sanitize(`\n${feedbackContext}\n=======================================================\n`+promptPrepend);
    }

    prompt += `BASED STRICTLY ON THE CONTEXT LITERATURE ABOVE, EVALUATE THIS SPECIFIC PERSPECTIVE/PENTAMATRIX:\n"${quadrantText}"`;

    const { text: response, thought } = await callAI(prompt, sysPersona, signal);
    return { prompt, response, thought };
}

async function evaluateWithInfiniteRetry(quadrantText, contextBlob, settings, signal, qName, sharedFeedback = { log: "" }) {
        let valid = false;
        let attempts = 0;
        const maxQuoteRetries = 9999999;
        let finalQMetrics = null;
        let finalQDisplayText = "";
        let finalQPrompt = "";
        let finalQRawResp = "";
        let finalQThought = null;
        let passedQuotesContext = "";
        let failedQuotesContext = "";

        while (!valid) {
            attempts++;
            if(signal && signal.aborted) throw new DOMException("Aborted", "AbortError");

            // Pull fresh accumulated feedback at the start of every retry
            let feedback = sharedFeedback.log;

            addLog(L('log_score_val', {qName: qName.replace(/_/g, ' '), att: attempts, max: maxQuoteRetries}));            const { prompt: promptUsed, response: rawResp, thought: rawThought } = await executeQuadrantRAG(quadrantText, contextBlob, feedback, settings, signal);
            
            finalQPrompt = promptUsed;
            finalQRawResp = rawResp;
            finalQThought = rawThought;
            
            let jsonStr = "";
            let displayText = rawResp;

            const startMatch = rawResp.match(/###\s*JSON_START\s*###/i);
            const endMatch = rawResp.match(/###\s*JSON_END\s*###/i);
            
            if (startMatch && endMatch) {
                displayText = rawResp.substring(0, startMatch.index).trim();
                jsonStr = rawResp.substring(startMatch.index + startMatch[0].length, endMatch.index).trim();
            } else if (rawResp.includes('```json')) {

                displayText = rawResp.split('```json')[0].trim();
                const match = rawResp.match(/```json([\s\S]*?)```/i);
                if (match && match[1]) jsonStr = match[1].trim();
            } else if (rawResp.includes('{')) {
                displayText = rawResp.substring(0, rawResp.indexOf('{')).trim();
                jsonStr = rawResp.substring(rawResp.indexOf('{'), rawResp.lastIndexOf('}') + 1);
            }

            finalQDisplayText = displayText;
            jsonStr = jsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();
            jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1'); 
            
            try { 
                if(jsonStr) finalQMetrics = JSON.parse(jsonStr); 
                else throw new Error("Missing JSON block.");

                if (finalQMetrics.Verbatim_Quotes && finalQMetrics.Verbatim_Quotes.length > 0) {
                        const validationResults = validateQuotesWithSources(finalQMetrics.Verbatim_Quotes, contextBlob);
                        
                        failedQuotesContext = "";
                        passedQuotesContext = "";
                        finalQMetrics.QuoteValidation = validationResults;
                        
                        validationResults.forEach(r => {
                            let abstractText = workflowTrace.sharedAbstracts[r.source_id];
                            if (!abstractText) {
                                const cleanTargetId = String(r.source_id).replace(/^(PMID:?\s*|ID:?\s*|Wiki ID:?\s*|arXiv ID:?\s*)/i, '').trim();
                                const foundKey = Object.keys(workflowTrace.sharedAbstracts).find(k => {
                                    const cleanKey = String(k).replace(/^(PMID:?\s*|ID:?\s*|Wiki ID:?\s*|arXiv ID:?\s*)/i, '').trim();
                                    return cleanKey === cleanTargetId;
                                }); 
                                if (foundKey) abstractText = workflowTrace.sharedAbstracts[foundKey];
                            }
                            
                            // 1. Strict exact-match enforcement
                            if (r.status === 'PASS') {
                                if (!abstractText) {
                                    r.status = 'FAIL';
                                    r.error = `Invalid Source ID. '${r.source_id}' does not match any provided abstract ID.`;
                                } else {
                                    const normalizedAbstract = abstractText.replace(/\s+/g, ' ');
                                    const normalizedQuote = r.quote.replace(/\s+/g, ' ').trim();
                                    if (!normalizedAbstract.includes(normalizedQuote)) {
                                        r.status = 'FAIL';
                                        r.error = `Quote was found in context but NOT in the specific abstract mapped to ID '${r.source_id}'.`;
                                    }
                                }
                            }
                            
                            r.abstract_text = abstractText || 'N/A';
                            
                            workflowTrace.allQuoteAttempts.push({ quadrant: qName, attempt: attempts, quote: r.quote, status: r.status, error: r.error, abstract_text: r.abstract_text });
                            if (r.status === 'PASS') {
                                passedQuotesContext += `- "${r.quote}" (Source: ${r.source_id})\n`;
                                addLog(L('log_q_verif', {id: r.source_id, quote: r.quote.substring(0, 2000)}));
                            } else {
                                failedQuotesContext += `\n- ERROR: You cited ID: ${r.source_id} for the quote: "${r.quote}"\n  FACT: ${r.error}\n  \n  Below is the complete, true text of ID ${r.source_id} that you MUST read. \n  Find a valid, verbatim, character-perfect sentence inside this exact block to cite instead, or change your claim to align with what this text actually says:\n  \n  --- BEGIN ACTUAL ABSTRACT FOR ${r.source_id} ---\n  ${r.abstract_text}\n  --- END ACTUAL ABSTRACT FOR ${r.source_id} ---\n`;
                                addLog(L('log_q_mismatch', {id: r.source_id, quote: r.quote.substring(0, 2000)}), true);
                            }
                        });
                        
                        // 2. Evaluate allPass AFTER the strict validation loop is complete
                        const allPass = validationResults.every(r => r.status === 'PASS');
                        
                        if (!allPass) {
                            let mismatchFeedback = PROMPT_SETTINGS.validation_mismatch_feedback.content
                                .replace('{attempts}', attempts)
                                .replace('{failedContext}', failedQuotesContext)
                                .replace('{passedContext}', passedQuotesContext !== "" ? `✅ PASSED (DO NOT CHANGE THESE):\n${passedQuotesContext}\n` : "");
                            
                            sharedFeedback.log += `\n${mismatchFeedback}\n`;
                            addLog(L('log_val_fail_loop', {qName: qName.replace(/_/g, ' '), att: attempts, max: maxQuoteRetries}), true);
                            continue; 
                     } else {
                        addLog(L('log_val_pass_all', {count: validationResults.length}));
                    }
                }
                
                if (settings.rigor === "Strict") {
                    addLog(L('log_strict_audit_start'));
                    const auditPrompt = PROMPT_SETTINGS.research_veridical_check.content
 .replace('{claim}', () => quadrantText)
 .replace('{contextData}', () => contextBlob)
    .replace('{response}', () => finalQRawResp);
                    
                    try {
const { text: auditText } = await callAI(auditPrompt, "You are a strict, uncompromising QA Audit AI. Your job is to strictly enforce RAG amnesia, zero external knowledge, and logical consistency. Return ONLY valid JSON.", signal);
let cleanAudit = auditText.replace(/```json/gi, '').replace(/```/g, '').trim();
                        if (cleanAudit.includes('{')) cleanAudit = cleanAudit.substring(cleanAudit.indexOf('{'), cleanAudit.lastIndexOf('}') + 1);
                        const auditResult = JSON.parse(cleanAudit);
if (String(auditResult.status).trim().toUpperCase() === "PASS") {
                             addLog(L('log_strict_audit_pass'));
                             valid = true;
                        } else {
                             sharedFeedback.log += L('err_audit_failed', {feedback: auditResult.feedback});
                             addLog(L('log_strict_audit_fail', {feedback: auditResult.feedback}), true);
                             continue;
                        }
                    } catch(e) {
                         addLog(L('log_strict_audit_parse_fail'), true);
                         sharedFeedback.log += L('err_audit_parse');
                         continue;
                    }
                } else {
                    valid = true;
                }
            } catch(e) { 
                addLog(L('log_json_err', {err: e.message}), true); 
                failedQuotesContext = `- FATAL ERROR: JSON Parsing failed. Error: ${e.message}. Ensure your JSON block is valid and closed.\n`;
                if (attempts >= maxQuoteRetries) valid = true; 
            }
        }
        return { name: qName, text: quadrantText, metrics: finalQMetrics || {}, displayText: finalQDisplayText, prompt: finalQPrompt, rawResponse: finalQRawResp, thought: finalQThought };
    }

    function renderScoreBar(label, score, maxScore) {
        if (score === undefined || score === null) return '';
        const pct = (score / maxScore) * 100;
        let color = "#3b82f6";
        if (pct <= 45) color = "#dc2626";
        else if (pct >= 80) color = "#059669";

        return `
        <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600; margin-bottom:4px; color:#334155;">
                <span>${label}</span><span>${score}/${maxScore}</span>
            </div>
            <div style="width:100%; background:#e2e8f0; border-radius:10px; height:8px; overflow:hidden;">
                <div style="width:${pct}%; background:${color}; height:100%; transition: width 0.5s ease-in-out;"></div>
            </div>
        </div>`;
    }

 const toggleControlsBtn = document.getElementById('toggleControlsBtn');
    const controlsGrid = document.getElementById('controlsGrid');
    if (toggleControlsBtn && controlsGrid) {
        toggleControlsBtn.addEventListener('click', function() {
            if (controlsGrid.style.display === 'none') {
                controlsGrid.style.display = 'block';
                this.innerText = L('ui_btn_hide_controls');
            } else {
                controlsGrid.style.display = 'none';
                this.innerText = L('ui_btn_show_controls');
            }
        });
    }


function renderQuadrantBlock(q) {
        let scoreHtml = '';
        if (q.metrics && (q.metrics.Alignment !== undefined || q.metrics.Consilience !== undefined)) {
            scoreHtml = `
            <div class="score-bar-container">
                ${renderScoreBar(L('mvc_lbl_align'), q.metrics.Alignment, 7)}
                ${renderScoreBar(L('mvc_lbl_cons'), q.metrics.Consilience, 7)}
                ${renderScoreBar(L('mvc_lbl_conf'), q.metrics.Confidence, 7)}
            </div>`;
        }
        let customDpHtml = '';
        if (activeCustomDatapoints && activeCustomDatapoints.length > 0 && q.metrics) {
            let foundData = [];
            activeCustomDatapoints.forEach(dp => {
                if (q.metrics[dp.key] !== undefined && q.metrics[dp.key] !== null) {
                    let displayVal = q.metrics[dp.key];
                    if (typeof displayVal === 'object') displayVal = JSON.stringify(displayVal);
                    foundData.push(`<div style="margin-bottom: 6px;"><strong>${escapeHtml(dp.label)}:</strong> <span style="font-family: monospace; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd;">${escapeHtml(String(displayVal).replace(/^"|"$/g, ''))}</span></div>`);
                }
            });
            if (foundData.length > 0) {
                customDpHtml = `
                <div style="margin-top: 1rem; margin-bottom: 1rem; padding: 12px 16px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; font-size: 0.9rem; color: #581c87;">
                    
                    ${foundData.join('')}
                </div>`;
            }
        }

        const qDiv = document.createElement('div');
        qDiv.className = 'quadrant-block';
qDiv.innerHTML = DOMPurify.sanitize(`
    <div class="quad-title">${L('ui_quad_title', {penta: q.name.replace(/_/g, ' ')})}</div>
    <pre>${q.displayText}</pre>
    ${customDpHtml}
    ${scoreHtml}
`);
        finalResultArea.appendChild(qDiv);
    }

    function renderTagCloud(tagsObj) {
        const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would"]);
        const sorted = Object.entries(tagsObj).filter(([w]) => !stopWords.has(w) && w.length > 3).sort((a,b) => b[1] - a[1]).slice(0, 40);
        if (sorted.length === 0) return `<span>${L('mvc_lbl_no_kw')}</span>`;
        
        const maxFreq = sorted[0][1];
        let html = '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:baseline; justify-content:center;">';
        sorted.forEach(([word, freq]) => {
            const size = 0.8 + (freq / maxFreq) * 1.6;
            const hue = Math.floor(Math.random() * 360);
            html += DOMPurify.sanitize(`<span style="font-size:${size}rem; color: hsl(${hue}, 75%, 45%); font-weight:600;">${word}</span>`);
        });
        html += DOMPurify.sanitize('</div>');
        return html;
    }

    function renderTagsAttractor(tagsObj) {
        const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would"]);
        const sorted = Object.entries(tagsObj).filter(([w]) => !stopWords.has(w) && w.length > 3).sort((a,b) => b[1] - a[1]).slice(0, 15);
        if (sorted.length === 0) return `<span>${L('mvc_lbl_no_kw')}</span>`;
        
        let syntax = "graph TD\n    Core((Dataset Attractor)):::coreClass\n";
        sorted.forEach(([word, freq]) => {
            const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
            syntax += DOMPurify.sanitize(`    Core --- T_${cleanWord}["${word} (${freq})"]\n`);
        });
        syntax += DOMPurify.sanitize(`    classDef coreClass fill:#3b82f6,color:#fff,stroke:#1e40af,stroke-width:4px;\n`);
        return `<div class="mermaid">${syntax}</div>`;
    }

async function validateAndAlignMeSH(signal) {
        addLog(L('log_mesh_start'));
        let allTerms = new Set();
        workflowTrace.quadrants.forEach(q => {
            if (q.metrics?.Logic_Chain) {
                q.metrics.Logic_Chain.forEach(gate => {
                    if (gate.From) allTerms.add(gate.From);
                    if (gate.To) allTerms.add(gate.To);
                });
            }
        });

        const uniqueTerms = Array.from(allTerms);
        if (uniqueTerms.length === 0) return;

        addLog(L('log_mesh_verify', {count: uniqueTerms.length}));
        let invalidTermsMap = {}; 
        let verifiedTerms = new Set();
        let finalAlignments = {}; 

        for (let term of uniqueTerms) {
            if (signal && signal.aborted) return;
            try {
                const safeTerm = encodeURIComponent(`"${term}"`);
                const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=mesh&term=${safeTerm}&retmode=json`;
                const searchData = await safeFetchEutils(searchUrl, signal);
                
 if (searchData && searchData.esearchresult?.count !== "0" && searchData.esearchresult?.idlist?.length > 0) {
                    addLog(L('log_mesh_pass1', {term: term}));
                    verifiedTerms.add(term);
                    finalAlignments[term] = term;
                } else {
                    // Clean and normalize terms to successfully retrieve official suggestions from NCBI MeSH
                    let cleanedQuery = term;
                    cleanedQuery = cleanedQuery.replace(/[αα]/g, 'alpha')
                                               .replace(/[ββ]/g, 'beta')
                                               .replace(/[γγ]/g, 'gamma')
                                               .replace(/[κκ]/g, 'kappa')
                                               .replace(/κB/gi, 'kappa B')
                                               .replace(/[-/]/g, ' ')
                                               .replace(/\b(mediated|induced|dependent|driven|regulated|promoted|inhibited)\b/gi, ' ')
                                               .replace(/\b(pathway|pathways|program|levels|stress|atrophy|expression|signaling|factors)\b/gi, ' ')
                                               .replace(/\s+/g, ' ').trim();

                    const suggestUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=mesh&term=${encodeURIComponent(cleanedQuery)}&retmode=json`;
                    const suggestData = await safeFetchEutils(suggestUrl, signal);
                    let suggestions = [];
                    if (suggestData && suggestData.esearchresult?.idlist?.length > 0) {
                        const topIds = suggestData.esearchresult.idlist.slice(0, 3);
                        const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=mesh&id=${topIds.join(',')}&retmode=json`;
                        const summaryData = await safeFetchEutils(summaryUrl, signal);
                        if (summaryData && summaryData.result) {
                            topIds.forEach(id => { const entry = summaryData.result[id]; if (entry && entry.title) suggestions.push(entry.title); });
                        }
                    }
                    invalidTermsMap[term] = suggestions;
                    addLog(L('log_mesh_fail1', {term: term, sugg: suggestions.join(', ')}));
                }

            } catch(e) {
                if (e.name === 'AbortError') return;
                invalidTermsMap[term] = [];
            }
        }

        const invalidKeys = Object.keys(invalidTermsMap);
        let pendingTerms = [...invalidKeys];
        let feedbackContext = "";
        
        if (pendingTerms.length > 0) {
            let attempts = 0;
            const maxRetries = 5;

            while (pendingTerms.length > 0 && attempts < maxRetries) {
                attempts++;
                if (signal && signal.aborted) return;
                addLog(L('log_mesh_loop', {att: attempts, max: maxRetries, count: pendingTerms.length}));
                
                let currentDict = {};
                pendingTerms.forEach(t => currentDict[t] = invalidTermsMap[t]);

                let prompt = "";
                if (feedbackContext !== "") {
                    prompt += `⚠️⚠️⚠️ CRITICAL VERIFICATION WARNING (ATTEMPT ${attempts - 1} FAILED):\nYour previous MeSH mappings were REJECTED because they were null or did not strictly match the verified NCBI suggestions.\n- You MUST select a valid, exact string from the provided "suggestions" array if one exists.\n- If suggestions are empty, use your internal expert knowledge of the NLM MeSH vocabulary to locate the exact heading equivalent.\n- Do NOT return null if a valid option exists in the array or database.\n- Read the errors below carefully to correct your mappings in this attempt:\n${feedbackContext}\n=======================================================\n\n`;
                }

                prompt += `You are a strict NLM Medical Librarian. Align non-standard biological terms to their verified MeSH alternatives.\nCRITICAL RULES:\n- If suggestions are provided, try to select the best match from the list of suggestions.\n- If suggestions are empty, or if they are inaccurate, use your internal knowledge of the NLM MeSH database to provide the exact, official MeSH heading.\n- Do not invent, alter, or hallucinate terms. Any term you return MUST exist exactly in the MeSH database.\n- Return ONLY a valid JSON dictionary mapping the old term to the chosen MeSH heading (or null). Do not include markdown formatting.\n\nDictionary: ${JSON.stringify(currentDict, null, 2)}`;

                try {
                    const { text } = await callAI(prompt, "You are an expert NLM Medical Librarian. You must output ONLY valid JSON.", signal);
                    let cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                    if (cleanJson.includes('{')) cleanJson = cleanJson.substring(cleanJson.indexOf('{'), cleanJson.lastIndexOf('}') + 1);
                    
                    const alignmentMap = JSON.parse(cleanJson);
                    let stillPending = [];
                    let newFeedback = "";

                    for (let term of pendingTerms) {
                        let aiSuggestion = alignmentMap[term];
                        if (!aiSuggestion || aiSuggestion === "null") {
                            stillPending.push(term);
                            newFeedback += "- Error for \"" + term + "\": You returned null. Please find an exact MeSH equivalent.\n";
                        } else {
                            const safeAiTerm = encodeURIComponent(`"${aiSuggestion}"`);
                            const checkUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=mesh&term=${safeAiTerm}&retmode=json`;
                            const checkData = await safeFetchEutils(checkUrl, signal);
                            
                            if (checkData && checkData.esearchresult?.count !== "0" && checkData.esearchresult?.idlist?.length > 0) {
                                addLog(L('log_mesh_pass3', {sugg: aiSuggestion}));
                                finalAlignments[term] = aiSuggestion;
                                verifiedTerms.add(aiSuggestion);
                            } else {
                                stillPending.push(term);
                                newFeedback += "- Error for \"" + term + "\": You mapped to \"" + aiSuggestion + "\", which is not a verified MeSH heading. Choose exactly from suggestions if available: [" + invalidTermsMap[term].join(', ') + "].\n";
                            }
                        }
                    }
                    pendingTerms = stillPending;
                    feedbackContext = newFeedback;
                } catch(e) {
                    if (e.name === 'AbortError') return;
                    addLog(L('log_mesh_ai_fail', {att: attempts, err: e.message}), true);
                }
            }

            pendingTerms.forEach(t => { finalAlignments[t] = null; });
        }

        window.verifiedMeSHTerms = verifiedTerms;
        let prunedCount = 0, alignedCount = 0;

        workflowTrace.quadrants.forEach(q => {
            if (q.metrics?.Logic_Chain) {
                q.metrics.Logic_Chain = q.metrics.Logic_Chain.filter(gate => {
                    let fromValid = true, toValid = true;
                    if (finalAlignments.hasOwnProperty(gate.From)) {
                        if (finalAlignments[gate.From] === null) fromValid = false;
                        else { gate.From = finalAlignments[gate.From]; alignedCount++; }
                    }
                    if (finalAlignments.hasOwnProperty(gate.To)) {
                        if (finalAlignments[gate.To] === null) toValid = false;
                        else { gate.To = finalAlignments[gate.To]; alignedCount++; }
                    }
                    if (!fromValid || !toValid) { prunedCount++; return false; }
                    return true; 
                });
            }
        });

        if (prunedCount > 0) addLog(L('log_mesh_pruned', {count: prunedCount}));
        if (alignedCount > 0) addLog(L('log_mesh_aligned', {count: alignedCount}));
        addLog(L('log_mesh_done'));
    }

    async function buildDatapointReports(signal) {
        if (!activeCustomDatapoints || activeCustomDatapoints.length === 0) return;
        addLog(L('log_dp_gen'));

        for (let dp of activeCustomDatapoints) {
            if(signal && signal.aborted) throw new DOMException("Aborted", "AbortError");

            let extractedData = [];
            workflowTrace.quadrants.forEach(q => {
                if (q.metrics && q.metrics[dp.key]) extractedData.push({ pentamatrix: q.name, data: q.metrics[dp.key] });
            });

            if (extractedData.length === 0) continue;
            
            if (!workflowTrace.aggregatedDatapoints) workflowTrace.aggregatedDatapoints = {};
            workflowTrace.aggregatedDatapoints[dp.key] = extractedData;
            
            if (!Array.from(document.getElementById('printModeSelect').options).some(o => o.value === 'agg_json_' + dp.key)) {
                const optAgg = document.createElement('option');
                optAgg.value = 'agg_json_' + dp.key;
                optAgg.innerText = L('ui_opt_agg_json', {key: dp.label});
                document.getElementById('printModeSelect').appendChild(optAgg);
            }

            addLog(L('log_dp_arch', {label: dp.label}));
            await new Promise(r => setTimeout(r, 10000)); // 10s Base delay for MVC

            const prompt = PROMPT_SETTINGS.custom_datapoint_report.content.replace('{dpLabel}', dp.label).replace('{extractedData}', JSON.stringify(extractedData));

            try {
                const { text } = await callAI(prompt, PROMPT_SETTINGS.assistant_panel.content, signal);
                const start = text.indexOf('###REPORT_JSON_START###') + 23;
                const end = text.indexOf('###REPORT_JSON_END###');
                
                if (start > 22 && end > -1) {
                    const jsonStr = text.substring(start, end).trim();
                    const plan = JSON.parse(jsonStr);
                    plan.title = `${dp.label.toUpperCase()} : CUSTOM ANALYSIS`;
                    
                    const reportId = 'mvc_dp_' + dp.key + '_' + Date.now();
                    workflowTrace.mvcReports.push({ id: reportId, title: `${dp.label} Report`, plan: plan });

                    const opt = document.createElement('option');
                    opt.value = reportId;
                    opt.innerText = L('ui_opt_dp_report', {label: dp.label});
                    document.getElementById('printModeSelect').appendChild(opt);
                    addLog(L('log_dp_compiled', {label: dp.label}));
                }
            } catch (err) {
                addLog(L('log_dp_failed', {label: dp.label, err: err.message}), true);
            }
        }
    }

  async function buildVisualizationsAndUI(signal, isFinal = false, isLoad = false) {
        applyGlobalCitationsToQuadrants();
        const blocks = finalResultArea.querySelectorAll('.quadrant-block');
        blocks.forEach(b => b.remove());
        const rc = document.getElementById('resultContent');
        if(rc) rc.style.display = 'none';

        workflowTrace.quadrants.forEach(q => renderQuadrantBlock(q));

  if (!isLoad) {
        // Only run MVC builds (buildDatapointReports) on AGI mode OR on finalization/revalidate
        const isAgiMode = !!workflowTrace.settings?.smartFollowUp;
        if (isFinal && isAgiMode) {
            await buildDatapointReports(signal);
        }
        
        if (isFinal) {
            await validateAndAlignMeSH(signal);	
        }
    }

        if (workflowTrace.settings?.tagCloud === 'on' || Object.keys(workflowTrace.globalTags).length > 0) {
            advancedModulesArea.style.display = 'grid';
            cloudBox.style.display = 'block';
            attractorBox.style.display = 'block';
tagCloudArea.innerHTML = DOMPurify.sanitize(renderTagCloud(workflowTrace.globalTags));
tagsAttractorArea.innerHTML = DOMPurify.sanitize(renderTagsAttractor(workflowTrace.globalTags));

            try { await mermaid.run({nodes: document.querySelectorAll('#tagsAttractorArea .mermaid')}); } catch(e) {}
        } else {
            advancedModulesArea.style.display = 'none';
        }

        let mermaidGatesHTML = "";
        let mermaidMasterHTML = "";
        let hasGraphs = false;
        let hasMasterGates = false;
        
        let masterSyntax = "graph TD\n    classDef default fill:#f8fafc,stroke:gold,stroke-width:2px,color:#0f172a;\n    classDef strong fill:#dbeafe,stroke:#3b82f6,stroke-width:3px;\n";

        const isNegative = (str) => {
            const r = str.toLowerCase();
            if (r.includes('not ') || r.includes('fails to')) return false; 
            return r.includes('-|') || /\b(inhibit|block|decrease|suppress|prevent|down-regulate|stop)\b/.test(r);
        };

        workflowTrace.quadrants.forEach((q, quadIdx) => {
            if(q.metrics && q.metrics.Logic_Chain && Array.isArray(q.metrics.Logic_Chain)) {
                let syntax = "graph TD\n    classDef default fill:#f8fafc,stroke:#cbd5e1,stroke-width:2px,color:#0f172a;\n";
                let addedGates = 0;
                let previousTo = null;

                for (let i = 0; i < q.metrics.Logic_Chain.length; i++) {
                    let gate = q.metrics.Logic_Chain[i];
                    if(gate.From && gate.To) {
                        let normFrom = gate.From.toLowerCase().trim();
                        let normTo = gate.To.toLowerCase().trim();
                        if (i > 0 && previousTo && previousTo !== normFrom) break; 
                        
                        const labelIn = gate.From.replace(/"/g, '&quot;');
                        const labelOut = gate.To.replace(/"/g, '&quot;');
                        const idIn = gate.From.replace(/[^a-zA-Z0-9]/g, '_');
                        const idOut = gate.To.replace(/[^a-zA-Z0-9]/g, '_');
                        
                        const rel = isNegative(gate.Relationship) ? "-.->" : "-->";
                        
                        if (idIn && idOut) {
                            syntax += DOMPurify.sanitize(`    G${quadIdx}_${i}_in["${labelIn}"] ${rel}|Gap: ${gate.Gap_Strength}| G${quadIdx}_${i}_out["${labelOut}"]\n`);
                            masterSyntax += DOMPurify.sanitize(`    M_${idIn}["${labelIn}"]:::strong ${rel}|Gap: ${gate.Gap_Strength}| M_${idOut}["${labelOut}"]:::strong\n`);
                            hasMasterGates = true;
                            addedGates++;
                            previousTo = normTo;
                        }
                    }
                }
                if (addedGates > 0) {
                    hasGraphs = true;
                    mermaidGatesHTML += DOMPurify.sanitize(`<h5>${L('ui_gates_title', {penta: q.name.replace(/_/g, ' ').toUpperCase()})}</h5><div class="mermaid">${syntax}</div><hr style="margin: 1rem 0; border: 0; border-top: 1px dashed #cbd5e1;">`);
                }
            }
        });

        if (hasMasterGates) mermaidMasterHTML += DOMPurify.sanitize(`<h5>PathMap</h5><div class="mermaid">${masterSyntax}</div><hr style="margin: 1rem 0; border: 0; border-top: 1px dashed #cbd5e1;">`);

         if (hasGraphs && isFinal) {
            mermaidGatesContainer.style.display = 'block';
            mermaidGatesArea.innerHTML = mermaidGatesHTML;
            try { await mermaid.run({nodes: document.querySelectorAll('#mermaidGatesArea .mermaid')}); } catch(e) {}
        } else {
            mermaidGatesContainer.style.display = 'none';
        }
        
        if (hasMasterGates && isFinal) {
            mermaidPathMapContainer.style.display = 'block';
            mermaidPathMapArea.innerHTML = mermaidMasterHTML;
            try { await mermaid.run({nodes: document.querySelectorAll('#mermaidPathMapArea .mermaid')}); } catch(e) {}
        } else {
            mermaidPathMapContainer.style.display = 'none';
        }
        
        updateAssistantCheckboxes();
    }

    function getSettingsObj() {
        const getElVal = (id) => document.getElementById(id)?.value;
        const getElChecked = (id) => {
            const el = document.getElementById(id);
            return el ? el.checked : undefined;
        };

        return {
            mode: getElVal('analysisMode') || TOON_PROFILE.statMode || "Social",
            library: getElVal('librarySelect') || TOON_PROFILE.statLibrary || "PubMed",
            format: getElVal('outputFormat') || TOON_PROFILE.statFormat || "Standard",
            length: getElVal('outputLength') || TOON_PROFILE.statLength || "Standard",
            rigor: getElVal('rigorToggle') || TOON_PROFILE.statRigor || "Strict",
            tagCloud: getElVal('tagCloudToggle') || TOON_PROFILE.statTagCloud || "on",
            breadth: parseInt(document.getElementById('breadthValInput')?.value || TOON_PROFILE.statBreadth) || 10,
            depth: parseInt(document.getElementById('depthValInput')?.value || TOON_PROFILE.statDepth) || 5,
            runs: parseInt(document.getElementById('buildRuns')?.value || TOON_PROFILE.statLoops) || 1,
            evalsPerRun: parseInt(document.getElementById('evalsPerRunInput')?.value || TOON_PROFILE.statEvals) || 1,
            autoExplore: getElChecked('autoExploreCb') !== undefined ? getElChecked('autoExploreCb') : (TOON_PROFILE.statAutoExplore === true || TOON_PROFILE.statAutoExplore === "true"),
            smartFollowUp: getElChecked('smartFollowUpCb') !== undefined ? getElChecked('smartFollowUpCb') : (TOON_PROFILE.statSmartFollow === true || TOON_PROFILE.statSmartFollow === "true")
        };
    }


function getAuthorshipObj() {
        let name = document.getElementById('authorName').value.trim();
        const baseNotice = L('print_copyright_notice');
        
        let watermarkStr = name 
            ? `${L('print_generated_by', {name: name, notice: baseNotice})}` 
            : `${L('print_generated_by', {name: L('print_a_user'), notice: baseNotice})}`;

        return {
            name: name || L('lbl_unknown'),
            watermark: watermarkStr,
            date: new Date().toLocaleDateString()
        };
    }

    async function generateAutoExploreClaim(topic, history, signal) {
        const historyText = history.length > 0 ? history.map((h, i) => `${i+1}. ${h}`).join('\n') : "None yet. Explore the most prominent core mechanism first.";
        const prompt = PROMPT_SETTINGS.auto_explore_generation.content.replace('{topic}', topic).replace('{history}', historyText);
        const { text } = await callAI(prompt, "You are a creative hypothesis generator.", signal);
        return text.replace(/^["']|["']$/g, '').trim(); 
    }

    async function runStudioWorkflow() {
        if (!session.isReady) { showToast(L('toast_api_req'), true); return; }
        const claim = claimTextarea.value.trim();
        if (!claim) { showToast(L('toast_enter_claim'), true); return; }
        if (currentRunActive) return;
        const isAppend = document.getElementById('appendToTraceCb').checked;
        abortController = new AbortController();
        const signal = abortController.signal;
        currentRunActive = true;
        
	runBtn.style.display = 'none';
        cancelBtn.disabled = false;
        doAnotherBtn.disabled = false; 

const overlay = document.getElementById('learningOverlay');
        document.getElementById('learningProgressText').innerHTML = DOMPurify.sanitize(L('log_researching', {name: escapeHtml(TOON_PROFILE.name.split(' ')[0])}));
        if (overlay) overlay.style.display = 'flex';
         if (!isAppend) {
            statusDiv.innerHTML = "";
            const blocks = finalResultArea.querySelectorAll('.quadrant-block');
            blocks.forEach(b => b.remove());
            const rc = document.getElementById('resultContent');
            if(rc) { rc.style.display = 'block'; rc.innerHTML = `<pre style='margin:0;'>[[[ui_stream_wait]]]</pre>`; }
            
            advancedModulesArea.style.display = 'none';
            mermaidGatesContainer.style.display = 'none';
            mermaidPathMapContainer.style.display = 'none';
            
            workflowTrace = {
                claim, timestamp: new Date().toISOString(), settings: getSettingsObj(), authorship: getAuthorshipObj(),
                prompt_settings: PROMPT_SETTINGS, executionLog:[], failedQuotesLog: [], allQuoteAttempts: [], assistantLogs: [], quadrants:[], sharedAbstracts: {}, globalTags: {}, apaCitations: {}, globalCitationMap: {}, mvcReports: [], aggregatedDatapoints: {}, stats: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }, customDatapoints: activeCustomDatapoints
            };
        } else {
            addLog(L('log_append_trace'));
            workflowTrace.settings = getSettingsObj();
            if (!workflowTrace.claim) workflowTrace.claim = claim;
            if (!workflowTrace.timestamp) workflowTrace.timestamp = new Date().toISOString();
        }


        const settings = workflowTrace.settings;
        const authorship = workflowTrace.authorship;

        authorshipHeader.style.display = 'block';
authorshipHeader.innerHTML = DOMPurify.sanitize(L('ui_authorship_header', {
    watermark: authorship.watermark, 
    date: authorship.date, 
    mode: settings.mode, 
    rigor: settings.rigor, 
    format: settings.format, 
    lib: settings.library
}));

        updateTokenTracker();

        try {
            let autoExploreHistory = [];

            for (let runIndex = 1; runIndex <= settings.runs; runIndex++) {
                addLog(L('log_run_start', {run: runIndex, max: settings.runs}));

                let currentClaim = claim;
                
                if (runIndex > 1 && settings.smartFollowUp) {
                    addLog(L('log_agi_selecting'));
                    const menuOptions = Array.from(printModeSelect.options).map(o => o.value).filter(v => v !== 'all');
                    const menuPrompt = PROMPT_SETTINGS.agi_module_selection.content.replace('{menuOptions}', JSON.stringify(menuOptions));
                    let selectedReports = ['synthesis', 'gates', 'analytics']; 
                    
                    try {
                        const { text: selectionText } = await callAI(menuPrompt, "You return only JSON arrays.", signal);
                        selectedReports = JSON.parse(selectionText.replace(/```json/gi, '').replace(/```/g, '').trim());
                        addLog(L('log_agi_selected', {mods: selectedReports.join(', ')}));
                    } catch(e) {
                        addLog(L('log_agi_fail_sel'));
                    }
                    
                    let agiContext = "";
                    selectedReports.forEach(val => {
                        if (val === 'synthesis') agiContext += "--- SYNTHESIS DELIVERABLES ---\n" + workflowTrace.quadrants.map(q=>q.displayText).join('\n') + "\n\n";
                        else if (val === 'validQuotes') agiContext += "--- VALIDATED QUOTES ---\n" + workflowTrace.allQuoteAttempts.filter(q => q.status === 'PASS').map(q => q.quote).join('\n') + "\n\n";
                        else if (val === 'failedQuotes') agiContext += "--- FAILED QUOTES ---\n" + workflowTrace.allQuoteAttempts.filter(q => q.status !== 'PASS').map(q => `Quote: ${q.quote} | Error: ${q.error}`).join('\n') + "\n\n";
                        else if (val === 'evidence') agiContext += "--- RAW EVIDENCE ---\n" + Object.values(workflowTrace.sharedAbstracts).join('\n\n') + "\n\n";
                        else if (val === 'analytics' || val === 'cloud') agiContext += "--- ANALYTICS (KEYWORDS) ---\n" + JSON.stringify(workflowTrace.globalTags) + "\n\n";
                        else if (val === 'gates' || val === 'pathmap') agiContext += "--- LOGIC GATES ---\n" + JSON.stringify(workflowTrace.quadrants.map(q => q.metrics?.Logic_Chain)) + "\n\n";
                        else if (val === 'thoughtsLog') agiContext += "--- AI THOUGHTS LOG ---\n" + workflowTrace.quadrants.map(q => `Quadrant: ${q.name}\nThought: ${q.thought || 'None recorded'}`).join('\n\n') + "\n\n";
                        else if (val.startsWith('mvc_')) {
                            const report = workflowTrace.mvcReports.find(r => r.id === val);
                            if (report) agiContext += DOMPurify.sanitize(`--- REPORT: ${report.title} ---\n${JSON.stringify(report.plan)}\n\n`);
                        }
                    });
                    
                    let followUpPrompt = "";
                    if (workflowTrace.quadrants.length === 0 || Object.keys(workflowTrace.sharedAbstracts).length === 0) {
                        addLog(L('log_agi_0_fb'), true);
                        followUpPrompt = PROMPT_SETTINGS.agi_followup_fallback.content.replace(/{claim}/g, claim);
                    } else {
                        followUpPrompt = PROMPT_SETTINGS.agi_followup_main.content.replace('{agiContext}', agiContext);
                    }
                    
                    followUpPrompt = followUpPrompt.replace('{originalQuery}', claim);
                    
                    try {
                        const { text } = await callAI(followUpPrompt, "You return ONLY valid JSON.", signal);
                        const parsed = JSON.parse(text.replace(/```json/gi, '').replace(/```/g, '').trim());
                        let agiSuggestedClaim = parsed.claim || claim;
                        
                         if (parsed.new_datapoints && Array.isArray(parsed.new_datapoints)) {
                            if (!PROMPT_SETTINGS.custom_datapoints_directive.content.includes("CRITICAL EXTRACTION DIRECTIVE")) {
                                PROMPT_SETTINGS.custom_datapoints_directive.content = "### [CUSTOM DATAPOINTS]\nCRITICAL EXTRACTION DIRECTIVE: You MUST extract the following custom datapoints as root-level key/value pairs inside your final JSON block:\n";
                            }
                            // Prevent strings merging onto the same line
                            if (!PROMPT_SETTINGS.custom_datapoints_directive.content.endsWith('\n')) {
                                PROMPT_SETTINGS.custom_datapoints_directive.content += '\n';
                            }
                            parsed.new_datapoints.forEach(dp => { 
                                PROMPT_SETTINGS.custom_datapoints_directive.content += `- "${dp.key}": ${dp.instruction}\n`; 
                            });
                            syncDatapointsFromPromptDirective();
                            addLog(L('log_agi_dp_inj', {count: parsed.new_datapoints.length}));
                        }
                        
                        const intentPct = parseInt(document.getElementById('intentRespectInput')?.value || TOON_PROFILE.statRespect || 20, 10);
                        const roll = Math.random() * 100;
                        
                        if (roll < intentPct) {
                            currentClaim = claim;
                            addLog(L('log_agi_roll_hit', {pct: intentPct}));
                            addLog(L('log_agi_theory_orig', {run: runIndex, claim: currentClaim}));
                        } else {
                            currentClaim = agiSuggestedClaim;
                            addLog(L('log_agi_roll_miss', {pct: intentPct}));
                            addLog(L('log_agi_theory_agi', {run: runIndex, claim: currentClaim}));
                        }
                        autoExploreHistory.push(currentClaim);
                    } catch(e) {
                        addLog(L('log_agi_parse_fail'), true);
                        currentClaim = claim;
                    }
                } 
                else if (settings.autoExplore) {
                    addLog(L('log_auto_explore'));
                    currentClaim = await generateAutoExploreClaim(claim, autoExploreHistory, signal);
                    autoExploreHistory.push(currentClaim);
                    addLog(L('log_auto_theory', {run: runIndex, claim: currentClaim}));
                }

                let quadrantsToRun = [];
                if (settings.mode === "Phenotype" || settings.mode === "Social" || settings.mode === "Forensic" || settings.mode === "Alignment" || settings.mode === "Flexible") {
                    let phenoPrompt = currentClaim;
                    if (settings.mode === "Phenotype") phenoPrompt = PROMPT_SETTINGS.phenotype_intake.content.replace('{claim}', currentClaim);
                    quadrantsToRun = [{ name: 'synthesis', text: phenoPrompt }];
                } else {
                    const qJson = await generateQuadrants(currentClaim, signal);
                    quadrantsToRun = [
                        { name: 'raw_user_claim', text: currentClaim },
                        { name: 'original', text: qJson.original },
                        { name: 'inverse', text: qJson.inverse },
                        { name: 'adversarial', text: qJson.adversarial },
                        { name: 'inverse_adversarial', text: qJson.inverse_adversarial }
                    ];
                }

                if (settings.mode === "Matrix") {
                    let allEvidences = [];
                    for (let i = 0; i < quadrantsToRun.length; i++) {
                        const evidenceSrc = quadrantsToRun[i];
                         addLog(L('log_fetch_matrix', {cur: i+1, max: quadrantsToRun.length, src: evidenceSrc.name.toUpperCase()}));
                        
                        if (customEvidenceBlob) {
                            addLog(L('log_use_custom_ev'));
                            evidenceSrc.booleans = ["Bypassed"];
                            evidenceSrc.nodeIds = ["CUSTOM_EVIDENCE"];
                            workflowTrace.sharedAbstracts["CUSTOM_EVIDENCE"] = customEvidenceBlob;
                        } else {
                            addLog(L('log_gen_bool', {lib: settings.library}));
                            evidenceSrc.booleans = await generateBooleans(evidenceSrc.text, settings.library, settings.breadth, signal);
                            addLog(L('log_fetch_nodes', {dep: settings.depth}));
                            evidenceSrc.nodeIds = await fetchNodeIDs(evidenceSrc.booleans, settings.library, settings.depth, signal);
                            addLog(L('log_nodes_ret', {count: evidenceSrc.nodeIds.length}));
                            const newNodeIds = evidenceSrc.nodeIds.filter(id => !workflowTrace.sharedAbstracts[id]);
 if (newNodeIds.length > 0) {
                                const fetchedMap = await fetchLibraryContentMap(newNodeIds, settings.library, signal);
                                for (let key in fetchedMap) {
                                    if (key !== '__proto__' && key !== 'constructor') {
                                        workflowTrace.sharedAbstracts[key] = fetchedMap[key];
                                    }
                                }
                            }
                        }
                        const current_evidence_set = evidenceSrc.nodeIds.map(id => workflowTrace.sharedAbstracts[id]).join('\n\n');
                        allEvidences.push({ sourceName: evidenceSrc.name, blob: current_evidence_set, nodeIds: evidenceSrc.nodeIds });
                    }

                    for (let i = 0; i < allEvidences.length; i++) {
                        const evidenceData = allEvidences[i];
                        let abstractsBlob = evidenceData.blob;
                        if (!abstractsBlob.trim()) continue;

                        let maxLimitStr = document.getElementById('contextLimit')?.value || TOON_PROFILE.statContext || "512000";
                        let contextLimit = maxLimitStr ? parseInt(maxLimitStr) : Infinity;
                        if (abstractsBlob.length > contextLimit) abstractsBlob = abstractsBlob.substring(0, contextLimit) + "\n\n[WARNING: CONTEXT TRUNCATED]";

 for (let j = 0; j < quadrantsToRun.length; j++) {
                            const qToEval = quadrantsToRun[j];
                            let sharedFeedback = { log: "" }; // <-- Added Memory
                            for (let e = 1; e <= settings.evalsPerRun; e++) {
                                const qName = `Run${runIndex}_Eval${e}_${qToEval.name}_against_${evidenceData.sourceName}`;
                                addLog(`\n--- Evaluating Pentamatrix: ${qToEval.name.toUpperCase()} using Evidence from ${evidenceData.sourceName.toUpperCase()} (Eval ${e}/${settings.evalsPerRun}) ---`);

                                let qMetrics = await evaluateWithInfiniteRetry(qToEval.text, abstractsBlob, settings, signal, qName, sharedFeedback);
                                qMetrics.nodeIds = evidenceData.nodeIds;
                                workflowTrace.quadrants.push(qMetrics);
                                applyGlobalCitationsToQuadrants(); 
                                refreshQuadrantDisplay(); 
                                if (document.getElementById('autosaveCb')?.checked ?? true) await saveTraceToDB(workflowTrace);
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < quadrantsToRun.length; i++) {
                        const q = quadrantsToRun[i];
                        addLog(L('log_proc_penta', {cur: i+1, max: quadrantsToRun.length, penta: q.name.toUpperCase()}));
                        
                        if (customEvidenceBlob) {
                            addLog(L('log_use_custom_ev'));
                            q.booleans = ["Bypassed"];
                            q.nodeIds = ["CUSTOM_EVIDENCE"];
                            workflowTrace.sharedAbstracts["CUSTOM_EVIDENCE"] = customEvidenceBlob;
                        } else {
                            addLog(L('log_gen_bool', {lib: settings.library}));
                            q.booleans = await generateBooleans(q.text, settings.library, settings.breadth, signal);
                            addLog(L('log_fetch_nodes', {dep: settings.depth}));
                            q.nodeIds = await fetchNodeIDs(q.booleans, settings.library, settings.depth, signal);
                            addLog(L('log_nodes_ret', {count: q.nodeIds.length}));
                            const newNodeIds = q.nodeIds.filter(id => !workflowTrace.sharedAbstracts[id]);
 if (newNodeIds.length > 0) {
                                const fetchedMap = await fetchLibraryContentMap(newNodeIds, settings.library, signal);
                                for (let key in fetchedMap) {
                                    if (key !== '__proto__' && key !== 'constructor') {
                                        workflowTrace.sharedAbstracts[key] = fetchedMap[key];
                                    }
                                }
                            }

                        }

                        let contextBlob = q.nodeIds.map(id => workflowTrace.sharedAbstracts[id]).join('\n\n');
                        if (!contextBlob.trim()) continue;

                        let maxLimitStr = document.getElementById('contextLimit')?.value || TOON_PROFILE.statContext || "512000";
                        let contextLimit = maxLimitStr ? parseInt(maxLimitStr) : Infinity;
                        if (contextBlob.length > contextLimit) contextBlob = contextBlob.substring(0, contextLimit) + "\n\n[WARNING: CONTEXT TRUNCATED]";

let sharedFeedback = { log: "" }; // <-- Added Memory
                        for (let e = 1; e <= settings.evalsPerRun; e++) {
                            let qName = `Run${runIndex}_Eval${e}_${q.name}`; 
                            let qMetrics = await evaluateWithInfiniteRetry(q.text, contextBlob, settings, signal, qName, sharedFeedback);

                            qMetrics.nodeIds = q.nodeIds; 
                            workflowTrace.quadrants.push(qMetrics);
                            renderQuadrantBlock(qMetrics);
                                if (document.getElementById('autosaveCb')?.checked ?? true) await saveTraceToDB(workflowTrace);
                        }
                    }
                }
                 addLog(L('log_run_comp', {run: runIndex}));
           if (runIndex < settings.runs) {
                await buildVisualizationsAndUI(signal, false); // Intermediate UI Build
            }            }

            // After all loops, trigger the final MeSH and Reporting UI builds
            await buildVisualizationsAndUI(signal, true);

            if (settings.mode === 'Flexible') {

                addLog(L('log_flex_exec'));
                const context = workflowTrace.quadrants.map(q => q.displayText).join('\n\n');
                const cmd = document.getElementById('flexibleCommandInput')?.value || "";

                const prompt = PROMPT_SETTINGS.flexible_mode_eval.content.replace('{context}', context).replace('{command}', cmd).replace('{reference}', flexiblePromptText);
                const { text } = await callAI(prompt, "You are a helpful research assistant.", signal);
                
                const reportId = 'mvc_flex_' + Date.now();
                workflowTrace.mvcReports.push({ id: reportId, title: "Flexible Custom Report", plan: { title: "Flexible Custom Report", panels: [{ type: "synthesis", content: text }] } });
                const opt = document.createElement('option');
                opt.value = reportId;
                opt.innerText = L('ui_opt_flex_report');
                printModeSelect.appendChild(opt);
                
                const flexDiv = document.createElement('div');
                flexDiv.className = 'quadrant-block';
                flexDiv.innerHTML = `<div class="quad-title">[[[ui_flex_quad_title]]]</div><pre>${escapeHtml(text)}</pre>`;
                finalResultArea.appendChild(flexDiv);
                addLog(L('log_flex_gen'));
            }
addLog(L('log_ds_comp', {count: Object.keys(workflowTrace.sharedAbstracts).length}));
            showToast(L('toast_pipe_complete'));

            // Automated Veridicality Check at the end of the workflow
            addLog("🔍 Initiating automated final veridicality check in Assistant...");
            assistantPanel.style.display = 'block';
            
            // Ensure Assistant Checkboxes are checked for synthesis and quotes so it has the right context
            const synthCb = document.querySelector('#assistantCheckboxes input[value="synthesis"]');
            if (synthCb) synthCb.checked = true;
            const validCb = document.querySelector('#assistantCheckboxes input[value="validQuotes"]');
            if (validCb) validCb.checked = true;

            const finalVeridicalityPrompt = "Answer in English only. Begin with a clear Yes or No. Is the synthesis 100% veridical with the validated quotes? Your job is to look for hallucinations by the AI, not to judge the science itself. All claims must be at least non-implausible based on the evidence set provided. Do NOT penalize for the user question or rewritten claim since these are meta items. Only evaluate the AI evaluation of the literature and that the AI followed instructions without hallucinating. List and justify your judgements. Do not use markdown. DO NOT PENALIZE FOR THE USER QUERY WORDING OR REWRITE>>> THAT IS NOT PART OF THE ANSWER ... THAT IS THE QUESTION OR CLAIM EVALUATED.";
            await runAssistantQuery(finalVeridicalityPrompt);

        } catch (err) {
            if (err.name === 'AbortError') { addLog(L('log_wf_cancel'), true); showToast(L('toast_wf_cancel'), true); }
            else { addLog(L('log_fat_err', {err: err.message}), true); showToast(L('toast_pipe_crashed'), true); }
    } finally {
            currentRunActive = false; abortController = null;
            runBtn.style.display = 'inline-flex'; 
            runBtn.disabled = false; doAnotherBtn.disabled = false;

            
            const overlay = document.getElementById('learningOverlay');
            if (overlay) overlay.style.display = 'none';

            
            document.getElementById('learningOverlay').style.display = 'none';
            document.getElementById('knowledgeDrawer').style.display = 'block';
            const toggleBtn = document.getElementById('toggleKnowledgeBtn');
            toggleBtn.style.display = 'block';
            toggleBtn.innerText = L('ui_btn_knowledge_box_teach');
            
            if(workflowTrace.quadrants.length > 0 || Object.keys(workflowTrace.sharedAbstracts).length > 0) {
                postUrlBtn.disabled = false; exportBtn.disabled = false;
                copyResultBtn.disabled = false; doPrintBtn.disabled = false; printModeSelect.disabled = false;
                assistantPanel.style.display = 'block';
                updateAssistantCheckboxes();
            }
        }
    }

    function resetWorkspace() {
        if (currentRunActive) return;
        
        // --- FIX: Properly clear Custom Evidence & Dropdown ---
        customEvidenceBlob = null;
        const evList = document.getElementById('customEvidenceList');
        if (evList) evList.innerHTML = "";
        
        const libSel = document.getElementById('librarySelect');
        Array.from(libSel.options).forEach(opt => {
            if(opt.value === 'Custom') opt.remove();
        });
        libSel.value = 'PubMed';
        libSel.disabled = false;
        document.getElementById('clearEvidenceBtn').style.display = 'none';
        
        // Clear Assistant Checkboxes
        const assistantBox = document.getElementById('assistantCheckboxes');
        if (assistantBox) {
            Array.from(assistantBox.querySelectorAll('input')).forEach(cb => cb.checked = false);
        }

        // --- FIX: Hide Revalidate button ---

        claimTextarea.value = "";

        const blocks = finalResultArea.querySelectorAll('.quadrant-block');
        blocks.forEach(b => b.remove());
        const rc = document.getElementById('resultContent');
        if(rc) { rc.style.display = 'block'; rc.innerHTML = `<pre style='margin:0;'>[[[ui_stream_wait]]]</pre>`; }
        
        statusDiv.innerHTML = L('ui_log_ready');
        authorshipHeader.style.display = 'none';
        advancedModulesArea.style.display = 'none';
        cloudBox.style.display = 'none';
        attractorBox.style.display = 'none';
        mermaidGatesContainer.style.display = 'none';
        mermaidPathMapContainer.style.display = 'none';
        
        assistantQueryInput.value = "";
        assistantResponseArea.innerHTML = "";
        assistantResponseArea.style.display = 'none';

        tagCloudArea.innerHTML = "";
        tagsAttractorArea.innerHTML = "";
        mermaidGatesArea.innerHTML = "";
        mermaidPathMapArea.innerHTML = "";
        
        if (assistantAbortController) { assistantAbortController.abort(); assistantAbortController = null; }
        
        workflowTrace = { claim: null, timestamp: null, settings: {}, prompt_settings: PROMPT_SETTINGS, authorship: {}, executionLog:[], failedQuotesLog: [], allQuoteAttempts: [], assistantLogs: [], quadrants:[], sharedAbstracts: {}, globalTags: {}, apaCitations: {}, globalCitationMap: {}, mvcReports: [], aggregatedDatapoints: {}, stats: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
        
        Array.from(printModeSelect.options).forEach(opt => {
            if (opt.value.startsWith('mvc_') || opt.value.startsWith('agg_json_')) opt.remove();
        });
        
        // --- FIX: Re-disable all print/export buttons ---
        postUrlBtn.disabled = true; 
        exportBtn.disabled = true; 
        copyResultBtn.disabled = true; 
        doPrintBtn.disabled = true; 
        printModeSelect.disabled = false; 
        doAnotherBtn.disabled = false;

        claimTextarea.focus();
        updateTokenTracker();
        translateUI();
    }

modalStartBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (!key && session.provider !== 'localhost' && session.provider !== 'custom') { showToast(L('toast_api_req'), true); return; }
        session.apiKey = key; 
        session.provider = providerSelect.value;
        addLog(L('log_val_key'));
        try {
            await callAI("Reply exactly with OK");
            enableAppAfterKey(); showToast(L('toast_wk_ready'));
        } catch (e){ addLog(L('log_key_fail'), true); showToast(L('toast_val_failed'), true); }
    });

 cancelBtn.addEventListener('click', () => {
        if (abortController || assistantAbortController) { 
            cancelBtn.disabled = true; 
            if (abortController) abortController.abort(); 
            if (assistantAbortController) assistantAbortController.abort(); 
        }
    });

function executeModularPrint() {
        const type = printModeSelect.value;

        
        if (type === 'all') { 
            window.print(); 
            return; 
        }
        
        if (type.startsWith('agg_json_')) {
            const key = type.replace('agg_json_', '');
            const data = workflowTrace.aggregatedDatapoints[key];
            let printWin = window.open('', '_blank', 'width=900,height=700');
            printWin.document.write('<html><head><title>Aggregated JSON</title><style>body{font-family:monospace; padding:20px;}</style></head><body>');

    printWin.document.write(`<h2>Aggregated JSON: ${escapeHtml(key)}</h2><hr><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`);
            printWin.document.write('</body></html>');
            printWin.document.close();
            return;
        }

        if (type.startsWith('mvc_')) {
            const report = (workflowTrace.mvcReports || []).find(r => r.id === type);
            if (report) {
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.top = '-9999px';
                document.body.appendChild(tempDiv);
                
                renderMVCReport(report.plan, tempDiv, workflowTrace);
                
                setTimeout(() => {
                    let printWin = window.open('', '_blank', 'width=1000,height=800');
                    printWin.document.write('<html><head><title>Pathmap Report Print</title>');
                    
                    Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).forEach(styleNode => {
                        printWin.document.write(styleNode.outerHTML);
                    });
                    
                    printWin.document.write('<style>body { background: white !important; padding: 40px !important; color: #0f172a !important; } @media print { body { padding: 0 !important; } }</style>');
                    printWin.document.write('</head><body>');
                    
                    printWin.document.write(`<div class="ephemeral-module-result">${tempDiv.innerHTML}</div>`);
                    printWin.document.write('</body></html>');
                    printWin.document.close();
                    
                    tempDiv.remove();
                    
                    setTimeout(() => {
                        printWin.focus();
                        printWin.print();
                    }, 400);
                }, 500);
                return;
            }
        }
        
        let printWin = window.open('', '_blank', 'width=900,height=700');
printWin.document.write('<html><head><title>Pathmap Print Module</title>');

// FIX: Inject parent styles/stylesheets so Mermaid SVG styles are carried over
Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).forEach(styleNode => {
    printWin.document.write(styleNode.outerHTML);
});

printWin.document.write('<style>body{font-family:sans-serif; padding:30px; padding-bottom:60px; line-height:1.6; color:#1f2a3e;} pre{white-space:pre-wrap; word-wrap:break-word; font-family:inherit;} hr{border:1px solid #e2e8f0; margin:20px 0;} .page-break { page-break-before: always; } .watermark-footer { position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px 0; font-size: 0.75rem; color: #64748b; font-family: monospace; background: white; border-top: 1px dashed #cbd5e1; } svg text, svg text tspan, .mermaid text, .mermaid span, .mermaid div, .mermaid .nodeLabel, .nodeLabel { color: #0f172a !important; fill: #0f172a !important; opacity: 1 !important; visibility: visible !important; }</style>');

       let content = '';
        
        if (type === 'synthesis') {
            content = "<h2>Synthesis Deliverable</h2><hr>" + finalResultArea.innerHTML;
        } else if (type === 'cloud') {
            content = "<h2>Semantic Tags & Attractor</h2><hr><h3>Attractor Graph</h3><div class='mermaid'>" + tagsAttractorArea.innerHTML + "</div><hr><h3>Tag Cloud</h3>" + tagCloudArea.innerHTML;
        } else if (type === 'gates') {
            content = "<h2>Logic Gates (Per-Pentamatrix)</h2><hr><div class='mermaid'>" + mermaidGatesArea.innerHTML + "</div>";
        } else if (type === 'pathmap') {
            content = "<h2>Master PathMap</h2><hr><div class='mermaid'>" + mermaidPathMapArea.innerHTML + "</div>";
         } else if (type === 'evidence') {
            content = "<h2>Evidence Set (Raw Abstracts)</h2><hr>";
            const keys = Object.keys(workflowTrace.sharedAbstracts);
            if(keys.length === 0) content += "<p>No evidence loaded.</p>";
            keys.forEach(k => { content += DOMPurify.sanitize(`<pre>${escapeHtml(workflowTrace.sharedAbstracts[k])}</pre><hr>`); });
        } else if (type === 'validQuotes') {
            content = "<h2>✅ Validated Verbatim Quotes (PASS)</h2><hr>";
            const passed = workflowTrace.allQuoteAttempts.filter(v => v.status === 'PASS');
            if(passed.length === 0) content += "<p>No valid quotes found.</p>";
            passed.forEach(v => {
                content += DOMPurify.sanitize(`<h3>Attempt ${v.attempt} - Pentamatrix: ${v.quadrant.replace(/_/g, ' ')}</h3>`);
                content += DOMPurify.sanitize(`<p><strong>Quote:</strong> “${escapeHtml(v.quote)}”</p>`);
                content += DOMPurify.sanitize(`<div style="white-space:pre-wrap; background:#f9fafb; padding:15px; border-left: 4px solid #3b82f6; font-size:0.9rem;"><strong>Source Abstract:</strong>\n${escapeHtml(v.abstract_text)}</div><hr>`);
            });
        } else if (type === 'failedQuotes') {
            content = "<h2>❌ Failed Quotes (Log of all infinite retries)</h2><hr>";
            const failed = workflowTrace.allQuoteAttempts.filter(v => v.status !== 'PASS');
            if(failed.length === 0) content += "<p>No failed quotes found.</p>";
            failed.forEach(v => {
                content += DOMPurify.sanitize(`<h3>Attempt ${v.attempt} - Pentamatrix: ${v.quadrant.replace(/_/g, ' ')}</h3>`);
                content += DOMPurify.sanitize(`<p><strong>Quote:</strong> “${escapeHtml(v.quote)}”<br><strong style="color:red;">Error:</strong> ${escapeHtml(v.error)}</p>`);
                content += DOMPurify.sanitize(`<div style="white-space:pre-wrap; background:#fef2f2; padding:15px; border-left: 4px solid #dc2626; font-size:0.9rem;"><strong>Source Abstract:</strong>\n${escapeHtml(v.abstract_text)}</div><hr>`);
            });
        } else if (type === 'masterQuoteLog') {
            content = "<h2>📋 Master Quote Log (PASS/FAIL)</h2><hr>";
            if(!workflowTrace.allQuoteAttempts || workflowTrace.allQuoteAttempts.length === 0) content += "<p>No quote data.</p>";
            else {
                const grouped = {};
                workflowTrace.allQuoteAttempts.forEach(v => {
                    if(!grouped[v.attempt]) grouped[v.attempt] = [];
                    grouped[v.attempt].push(v);
                });
                Object.keys(grouped).sort((a,b)=>a-b).forEach(attemptNum => {
                    content += DOMPurify.sanitize(`<div style="page-break-after: always; margin-bottom: 30px;"><h2>Attempt ${attemptNum}</h2><hr>`);
                    grouped[attemptNum].forEach((v, idx) => {
                        const icon = v.status === 'PASS' ? '✅' : '❌';
                        content += DOMPurify.sanitize(`<h3>${icon} [${idx+1}] Pentamatrix: ${v.quadrant.replace(/_/g, ' ')}</h3>`);
                        content += DOMPurify.sanitize(`<p><strong>Quote:</strong> “${escapeHtml(v.quote)}”</p>`);
                        if (v.error) content += DOMPurify.sanitize(`<p style="color:red;"><strong>Error:</strong> ${escapeHtml(v.error)}</p>`);
                        const bg = v.status === 'PASS' ? '#f0fdf4' : '#fef2f2';
                        const borderColor = v.status === 'PASS' ? '#16a34a' : '#dc2626';
                        content += DOMPurify.sanitize(`<div style="white-space:pre-wrap; background:${bg}; padding:15px; border-left: 4px solid ${borderColor}; font-size:0.9rem;"><strong>Source Abstract:</strong>\n${escapeHtml(v.abstract_text)}</div><hr>`);
                    });
                    content += DOMPurify.sanitize(`</div>`);
                });
            }
        } else if (type === 'analytics') {
            content = "<h2>📊 Dataset Analytics & Reports</h2><hr>";
            
            function generateTable(title, headers, rows) {
                if(rows.length === 0) return `<h3>${title}</h3><p style="color:#64748b;">No data available.</p><hr>`;
                let html = `<h3>${title}</h3><table style="width:100%; border-collapse: collapse; margin-bottom: 30px; font-size: 0.9rem;">`;
                html += `<thead><tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">`;
                headers.forEach(h => html += DOMPurify.sanitize(`<th style="padding: 10px; text-align: left;">${h}</th>`));
                html += `</tr></thead><tbody>`;
                rows.forEach(r => {
                    html += `<tr style="border-bottom: 1px solid #e2e8f0;">`;
                    r.forEach(cell => html += DOMPurify.sanitize(`<td style="padding: 10px;">${cell}</td>`));
                    html += `</tr>`;
                });
                html += `</tbody></table><hr>`;
                return html;
            }

            const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would", "between", "using"]);
            const topTags = Object.entries(workflowTrace.globalTags)
                .filter(([w]) => !stopWords.has(w) && w.length > 3)
                .sort((a,b) => b[1] - a[1]).slice(0, 20);
            content += generateTable("Top Semantic Keywords (Metadata)", ["Keyword", "Frequency"], topTags);

            let nodeFreq = {};
            let gapData = [];
            workflowTrace.quadrants.forEach(q => {
                if(q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if(gate.From) nodeFreq[gate.From] = (nodeFreq[gate.From] || 0) + 1;
                        if(gate.To) nodeFreq[gate.To] = (nodeFreq[gate.To] || 0) + 1;
                        if(gate.From && gate.To && gate.Gap_Strength) {
                            gapData.push([gate.From, gate.Relationship, gate.To, gate.Gap_Strength]);
                        }
                    });
                }
            });
            
            const topNodes = Object.entries(nodeFreq).sort((a,b) => b[1] - a[1]).slice(0, 20);
            content += generateTable("Systems Node Centrality", ["Entity / Node", "Degree (Connections)"], topNodes);
            
            content += generateTable("Literature Gap Analysis (Logic Gates)", ["From Node", "Relation", "To Node", "Gap Strength"], gapData);

            let years = {};
            Object.values(workflowTrace.apaCitations).forEach(apa => {
                const match = apa.match(/\((\d{4})\)/);
                if(match) years[match[1]] = (years[match[1]] || 0) + 1;
            });
            const topYears = Object.entries(years).sort((a,b) => b[0] - a[0]); 
            content += generateTable("Evidence Age Distribution", ["Publication Year", "Count"], topYears);

        } else if (type === 'citations') {
            content = "<h2>Reference List (APA)</h2><p style='font-size:0.8rem; color:#64748b;'>Alphabetical and formatting strictly enforced.</p><hr>";
            
            let apaArray = Object.values(workflowTrace.apaCitations || {}).filter(c => c && !c.includes("undefined"));
            apaArray = [...new Set(apaArray)].sort((a, b) => a.localeCompare(b));
            
            if(apaArray.length === 0) {
                content += "<p>No verified citations have been mapped to the report yet.</p>";
            } else {
                content += '<ul style="list-style-type: none; padding: 0;">';
                apaArray.forEach((apaStr) => {
                    content += DOMPurify.sanitize(`<li style="padding-left: 2em; text-indent: -2em; margin-bottom: 15px; font-size: 0.95rem;">${apaStr}</li>`);
                });
                content += '</ul>';
            }
         } else if (type === 'json') {
            const safeMetrics = workflowTrace.quadrants.map(q => ({ pentamatrix: q.name, metrics: q.metrics }));
            content = "<h2>Raw JSON Metrics Trace</h2><hr><pre>" + escapeHtml(JSON.stringify(safeMetrics, null, 2)) + "</pre>";
        } else if (type === 'prompts') {
            content = "<h2>Prompts Documentation</h2><hr>";
            for (const key in PROMPT_SETTINGS) {
                let p = PROMPT_SETTINGS[key];
                content += DOMPurify.sanitize(`<h3>${escapeHtml(p.name)}</h3><p><strong>Purpose:</strong> ${escapeHtml(p.purpose)}</p><p><strong>When Used:</strong> ${escapeHtml(p.when_used)}</p><pre style="background:#f1f5f9; padding:10px; border-radius:8px;">${escapeHtml(p.content)}</pre><hr>`);
            }
         } else if (type === 'thoughtsLog') {
            content = "<h2>🧠 AI Thoughts Log</h2><p>Internal reasoning from the AI engine during RAG evaluation.</p><hr>";
            workflowTrace.quadrants.forEach(q => {
                content += DOMPurify.sanitize(`<h3>Pentamatrix: ${q.name.replace(/_/g, ' ').toUpperCase()}</h3>`);
                if (q.thought) content += DOMPurify.sanitize(`<pre style="background:#f3f4f6; color:#4b5563; border-left:4px solid #8b5cf6; padding:15px;">${escapeHtml(q.thought)}</pre><hr>`);
                else content += DOMPurify.sanitize(`<p style="color:#9ca3af; font-style:italic;">No internal thought data recorded for this pentamatrix.</p><hr>`);
            });
        } else if (type === 'buildChat') {
            content = "<h2>" + L('print_chat_trace')+"</h2><hr>";
            workflowTrace.quadrants.forEach(q => {
                content += DOMPurify.sanitize(`<div style="page-break-after: always; margin-bottom:30px;"><h3>Pentamatrix: ${q.name.replace(/_/g, ' ').toUpperCase()}</h3>`);
                content += DOMPurify.sanitize(`<h4>📥 System & User Prompt</h4><pre style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px;">${escapeHtml(q.prompt)}</pre>`);
                if (q.thought) content += DOMPurify.sanitize(`<h4>🧠 AI Internal Reasoning</h4><pre style="background:#f5f3ff; border:1px solid #ddd6fe; color:#5b21b6; padding:10px; font-style:italic;">${escapeHtml(q.thought)}</pre>`);
                content += DOMPurify.sanitize(`<h4>📤 Final Output</h4><pre style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px;">${escapeHtml(q.rawResponse)}</pre></div>`);
            });
        } else if (type === 'chatlog' || type.startsWith('chatlog_')) {
            let limit = 1000000;
            let titleLabel = "Full Chat History Trace";
            
            if (type.startsWith('chatlog_')) {
                const mode = type.replace('chatlog_', '');
                if (mode === 'puppy') { limit = 10000; titleLabel = "Puppy Mode (10k Limit)"; }
                else if (mode === 'dolphin') { limit = 50000; titleLabel = "Dolphin Mode (50k Limit)"; }
                else if (mode === 'human') { limit = 100000; titleLabel = "Human Mode (100k Limit)"; }
                else if (mode === 'elephant') { limit = 250000; titleLabel = "Elephant Mode (250k Limit)"; }
                else if (mode === 'robot') { limit = 1000000; titleLabel = "Robot Mode (1M Limit)"; }
            }

            content = `<h2>🤖 Assistant Audit Log: ${titleLabel}</h2><hr>`;
            
            if (!workflowTrace.assistantLogs || workflowTrace.assistantLogs.length === 0) {
                content += "<p style='color: #64748b; font-style: italic;'>No chat history available. Query the assistant to generate logs.</p>";
            } else {
                let accumulatedChars = 0;
                let logsToPrint = [];
                
                // Read from newest to oldest up to the selected buffer's limit
                for (let i = workflowTrace.assistantLogs.length - 1; i >= 0; i--) {
                    const log = workflowTrace.assistantLogs[i];
                    const rawInteractionText = (log.fullPrompt || '') + (log.response || log.finalResponse || '');
                    if (accumulatedChars + rawInteractionText.length <= limit) {
                        logsToPrint.unshift(log); // Keep chronological order
                        accumulatedChars += rawInteractionText.length;
                    } else {
                        break; // Cut off when memory limits are reached
                    }
                }
                
                content += DOMPurify.sanitize(`
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
                        <h3 style="margin-top: 0; margin-bottom: 12px; color: #1e3a8a;">${L('ui_chatlog_metadata')}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div><strong>${L('ui_chatlog_capacity')}:</strong> ${titleLabel}</div>
                            <div><strong>${L('ui_chatlog_occupancy')}:</strong> ${accumulatedChars.toLocaleString()} / ${limit.toLocaleString()} ${L('ui_chatlog_chars')} (${((accumulatedChars / limit) * 100).toFixed(1)}% ${L('ui_chatlog_full')})</div>
                            <div><strong>${L('ui_chatlog_interactions')}:</strong> ${logsToPrint.length}</div>
                        </div>
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin-bottom: 20px;">
                `);

                if (logsToPrint.length === 0) {
                    content += "<p style='color: #64748b; font-style: italic;'>No recent logs fit within this memory threshold limit.</p>";
                } else {
                    logsToPrint.forEach((log, idx) => {
                        content += DOMPurify.sanitize(`
                            <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background: #fff; page-break-inside: avoid;">
                                <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 1.1rem;">
                                    Interaction ${idx + 1}
                                </h3>
                                <div style="margin: 10px 0; font-size: 0.85rem; color: #64748b;">
                                    <strong>Metadata:</strong> Mode=${log.memoryMode || 'Unknown'} &middot; Context Chars=${log.contextLength || 0} &middot; History Chars=${log.historyLength || 0}
                                </div>
                                
                                <h4 style="margin: 15px 0 5px 0; font-size: 0.9rem; color: #475569;">📥 FULL CONTEXT WINDOW snapshot (System rules + Context Data + History sent to AI):</h4>
                                <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 0.85rem; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 6px;">${escapeHtml(log.fullPrompt || '')}</pre>
                                
                                <h4 style="margin: 20px 0 5px 0; font-size: 0.9rem; color: #475569;">📤 OUTPUT GENERATED (Raw Response):</h4>
                                <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 0.85rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px;">${escapeHtml(log.response || log.finalResponse || '')}</pre>
                            </div>
                        `);
                    });
                }
            }
         } else if (type === 'buildlog') {
            content = "<h2>🛠️ System Build Log</h2><hr><h3>Metadata</h3>";
            content += DOMPurify.sanitize(`<p><strong>Original Claim:</strong> ${escapeHtml(workflowTrace.claim)}</p>`);
            content += DOMPurify.sanitize(`<p><strong>Watermark:</strong> ${escapeHtml(workflowTrace.authorship.watermark)}</p>`);
            content += DOMPurify.sanitize(`<p><strong>Date:</strong> ${escapeHtml(workflowTrace.authorship.date)}</p>`);
            content += DOMPurify.sanitize(`<p><strong>Settings:</strong> Mode=${escapeHtml(workflowTrace.settings.mode)}, Library=${escapeHtml(workflowTrace.settings.library)}, Format=${escapeHtml(workflowTrace.settings.format)}, Length=${escapeHtml(workflowTrace.settings.length)}, Rigor=${escapeHtml(workflowTrace.settings.rigor)}</p>`);
            content += DOMPurify.sanitize("<h3>Execution Log</h3><pre style='background:#f1f5f9; padding:10px;'>" + escapeHtml(workflowTrace.executionLog.join('\n')) + "</pre><hr>");
            workflowTrace.quadrants.forEach(q => {
                content += DOMPurify.sanitize(`<h3>Pentamatrix: ${q.name.replace(/_/g, ' ').toUpperCase()}</h3>`);
                content += DOMPurify.sanitize(`<h4>Raw Evaluation Prompt</h4><pre style="background:#fefefe; border:1px solid #ddd; padding:10px;">${escapeHtml(q.prompt)}</pre>`);
                content += DOMPurify.sanitize(`<h4>Raw Model Response</h4><pre style="background:#fefefe; border:1px solid #ddd; padding:10px;">${escapeHtml(q.rawResponse)}</pre><hr>`);
            });
        }
        
      const defaultNotice = "PathMap Studio™ v1.0 - Open Source (Apache 2.0), software by Joshua Dungan, Artificial General Intelligence LLC, Grand Rapids, Michigan.";
const watermarkText = workflowTrace.authorship?.watermark || defaultNotice;
const safeWatermark = DOMPurify.sanitize(watermarkText);

printWin.document.write(`<div class="watermark-footer">${safeWatermark}</div>`)


printWin.document.write((content));
        printWin.document.write('</body></html>');
        printWin.document.close();
        setTimeout(() => { printWin.focus(); printWin.print(); }, 500);
    }

runBtn.addEventListener('click', () => {
	    const confirmed = confirm(L('confirm_disclaimer'));
        if (confirmed) runStudioWorkflow();
    });
    doAnotherBtn.addEventListener('click', resetWorkspace);
    doPrintBtn.addEventListener('click', executeModularPrint);
    
    document.getElementById('demoBtn').addEventListener('click', async () => {
        if (!session.isReady) { showToast("API key required.", true); return; }
        
        // Force Demo Settings
        analysisMode.value = "Social";
        document.getElementById('depthValInput').value = 5;
        document.getElementById('breadthValInput').value = 50;
        rigorToggle.value = "Strict";
        updateContextWarning();
        
        if (!claimTextarea.value.trim()) {
            addLog("🧪 Demo Mode: Generating a hypothetical complex scientific inquiry...");
            try {
                const { text } = await callAI(PROMPT_SETTINGS.demo_case_generation.content);
                claimTextarea.value = text.trim();
            } catch (e) {
                claimTextarea.value = "How does the gut microbiome influence neuroplasticity and cognitive decline in aging populations?";
            }
        }
        
        runStudioWorkflow();
    });
    
    copyResultBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(finalResultArea.innerText); showToast("📋 Copied human-readable text!"); } 
        catch (err) { showToast("Copy failed.", true); }
    });

    exportBtn.addEventListener('click', () => {
        if (workflowTrace.quadrants.length === 0 && Object.keys(workflowTrace.sharedAbstracts).length === 0) {
            showToast("Nothing to export yet.", true);
            return;
        }
        const exportData = JSON.stringify(workflowTrace, null, 2);
        const dl = document.createElement('a');
        dl.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(exportData));
        dl.setAttribute("download", `pathmap_trace_${Date.now()}.json`);
        dl.click();
        showToast("📥 Trace Exported successfully!");
    });

    const postUrlBtnNode = document.getElementById('postUrlBtn');
    postUrlBtnNode.addEventListener('click', async () => {
        const url = document.getElementById('postUrlInput').value.trim();
        if (!url) { showToast("Enter a valid URL endpoint", true); return; }
        if (workflowTrace.quadrants.length === 0) return;
        
        postUrlBtnNode.innerText = "Posting...";
        postUrlBtnNode.disabled = true;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workflowTrace)
            });
            if (res.ok) {
                addLog(`🌐 Node successfully synchronized`);
                showToast("Node published successfully!");
            } else {
                throw new Error("HTTP " + res.status);
            }
        } catch (e) {
            showToast("Post failed: " + e.message, true);
            addLog(`❌ Post failed: ${e.message}`, true);
        } finally {
            postUrlBtnNode.innerText = "🌐 Post Trace";
            postUrlBtnNode.disabled = false;
        }
    });



  const openLicense = (e) => {
        if (e) e.preventDefault();
        const licModal = document.getElementById('licenseModal');
        if (licModal) {
            licModal.style.display = 'flex';
        }
    };

    const viewLicenseBtn = document.getElementById('viewLicenseBtn');
    if (viewLicenseBtn) {
        viewLicenseBtn.addEventListener('click', openLicense);
    }

    const modalLicenseLink = document.getElementById('modalLicenseLink');
    if (modalLicenseLink) {
        modalLicenseLink.addEventListener('click', openLicense);
    }

    // AGREE: Closes the modal so the user can access the workbench
    const agreeLicenseBtn = document.getElementById('agreeLicenseBtn');
    if (agreeLicenseBtn) {
        agreeLicenseBtn.addEventListener('click', () => {
            const licModal = document.getElementById('licenseModal');
            if (licModal) {
                licModal.style.display = 'none';
            }
        });
    }

    // EXIT: Safely redirects the user away if they decline the terms
    const exitLicenseBtn = document.getElementById('exitLicenseBtn');
    if (exitLicenseBtn) {
        exitLicenseBtn.addEventListener('click', () => {
            window.location.href = 'https://pathmap.org'; // Redirects to safe landing page
        });
    }


    // ==========================================
    // JSON TRACE LOADER & MERGER
    // ==========================================
    const loadTraceBtn = document.getElementById('loadTraceBtn');
    const traceFileInput = document.getElementById('traceFileInput');
    const mergeTraceBtn = document.getElementById('mergeTraceBtn');
    const mergeFileInput = document.getElementById('mergeFileInput');

    loadTraceBtn.addEventListener('click', () => { traceFileInput.click(); });
    mergeTraceBtn.addEventListener('click', () => { mergeFileInput.click(); });

    function renderAssistantLogs() {
    if (!workflowTrace.assistantLogs || workflowTrace.assistantLogs.length === 0) {
        assistantResponseArea.innerHTML = "";
        assistantResponseArea.style.display = 'none';
        return;
    }
    assistantResponseArea.style.display = 'block';
    
    // Accumulate the HTML in memory as a single string
    let consolidatedHtml = "";
    
    workflowTrace.assistantLogs.forEach(log => {
        consolidatedHtml += `
            <div style="margin-bottom: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px;">
                <strong>${escapeHtml(L('ui_assist_user') || 'User:')}</strong> ${escapeHtml(log.query)}<br><br>
                <strong>${escapeHtml(L('ui_assist_ai') || 'Assistant:')}</strong><br>
                <div style="white-space: pre-wrap; font-family: inherit; font-size: 0.95rem;">${escapeHtml(log.response || log.finalResponse)}</div>
            </div>`;
    });

    // Sanitize the entire assembled payload once before setting the innerHTML
    assistantResponseArea.innerHTML = DOMPurify.sanitize(consolidatedHtml);
}

function updateAssistantCheckboxes() {
    try {
        const box = document.getElementById('assistantCheckboxes');
        if (!box) return;
        
        const checkboxesExist = box.querySelectorAll('input').length > 0;
        const currentlyChecked = new Set();
        
        if (checkboxesExist) {
            Array.from(box.querySelectorAll('input:checked')).forEach(cb => currentlyChecked.add(cb.value));
        }
        
        if (currentlyChecked.size === 0) {
            currentlyChecked.add('synthesis');
            currentlyChecked.add('validQuotes');
            currentlyChecked.add('chatlog');
        }
        
        const historyCb = document.getElementById('assistantHistoryCb');
        if (historyCb && historyCb.checked) {
            currentlyChecked.add('chatlog');
        } else {
            currentlyChecked.delete('chatlog');
        }
        
        let html = '';
        const printMenu = document.getElementById('printModeSelect');
        
        if (printMenu && printMenu.options) {
            Array.from(printMenu.options).forEach(opt => {
                if(opt.value === 'all') return; 
                if(opt.value === 'prompts' || opt.value === 'buildlog' || opt.value === 'buildChat' || opt.value.startsWith('chatlog_')) return;
                
                let isChecked = currentlyChecked.has(opt.value);
let cleanText = opt.text ? String(opt.text).replace(/^[^\w\s]+/, '').trim() : opt.value;
if (!cleanText) cleanText = opt.value;

                
html += DOMPurify.sanitize(`<label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; cursor:pointer;">
            <input type="checkbox" value="${escapeHtml(opt.value)}" ${isChecked ? 'checked' : ''} style="width:14px; height:14px;"> 
            ${escapeHtml(cleanText)}
         </label>`);
            });
        }
        
        let chatlogLabel = "Assistant Chatlog";
        try { chatlogLabel = L('ui_lbl_assistant_chatlog') || chatlogLabel; } catch(e){}
        
        html += DOMPurify.sanitize(`
            <label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; cursor:pointer;">
                <input type="checkbox" value="chatlog" ${currentlyChecked.has('chatlog') ? 'checked' : ''} style="width:14px; height:14px;"> 
                ${chatlogLabel}
            </label>
        `);
        
        box.innerHTML = html;
    } catch (err) {
        console.error("Error updating assistant checkboxes:", err);
    }
}
    traceFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function(evt) {
            try {
                const loaded = JSON.parse(evt.target.result);
                if (!loaded.quadrants) throw new Error("Invalid trace file format.");
                
                workflowTrace = loaded;
           if (!workflowTrace.allQuoteAttempts) workflowTrace.allQuoteAttempts = [];
                if (!workflowTrace.failedQuotesLog) workflowTrace.failedQuotesLog = [];
                if (!workflowTrace.executionLog) workflowTrace.executionLog = [];
                if (!workflowTrace.assistantLogs) workflowTrace.assistantLogs = [];
                if (!workflowTrace.apaCitations) workflowTrace.apaCitations = {};
                if (!workflowTrace.globalCitationMap) workflowTrace.globalCitationMap = {};
                if (!workflowTrace.mvcReports) workflowTrace.mvcReports = [];
                if (!workflowTrace.aggregatedDatapoints) workflowTrace.aggregatedDatapoints = {};
                if (!workflowTrace.stats) workflowTrace.stats = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
                
                // --- RESTORE CUSTOM DATAPOINTS ---
                 if (loaded.prompt_settings?.custom_datapoints_directive?.content) {
        PROMPT_SETTINGS.custom_datapoints_directive.content = loaded.prompt_settings.custom_datapoints_directive.content;
    }else if (loaded.prompt_settings?.custom_datapoints_directive?.content) {
                    // Backwards-compatible parsing fallback
                    const content = loaded.prompt_settings.custom_datapoints_directive.content;
                    const lines = content.split('\n');
                    activeCustomDatapoints = [];
                    lines.forEach(line => {
                        const match = line.match(/^-\s*"([^"]+)"\s*:\s*(.+)$/);
                        if (match) {
                            activeCustomDatapoints.push({
                                key: match[1],
                                label: match[1].replace(/_/g, ' ').toUpperCase(),
                                instruction: match[2]
                            });
                        }
                    });
                }
    syncDatapointsFromPromptDirective(); // 
                // ---------------------------------

                delete workflowTrace.modules; 
                
                claimTextarea.value = workflowTrace.claim || "";
                statusDiv.innerHTML = "💡 Trace loaded successfully from file.\n";

                workflowTrace.executionLog.forEach(log => {
                    const entry = document.createElement('div');
                    entry.innerText = log;
                    statusDiv.appendChild(entry);
                });
                statusDiv.scrollTop = statusDiv.scrollHeight;

   const authName = escapeHtml(workflowTrace.authorship?.name || 'Unknown');
   const authDate = escapeHtml(workflowTrace.authorship?.date || 'Unknown Date');
   authorshipHeader.style.display = 'block';
   authorshipHeader.innerHTML = DOMPurify.sanitize(`<strong>Loaded Trace Prepared by:</strong> ${authName} &middot; <strong>Date:</strong> ${authDate}`);

                workflowTrace.mvcReports.forEach(r => {
                    if (!Array.from(printModeSelect.options).some(o => o.value === r.id)) {
                        const opt = document.createElement('option');
                        opt.value = r.id;
                        opt.innerText = L('ui_opt_ai_report', {title: r.title});
                        printModeSelect.appendChild(opt);
                    }
                });
                
                // Patch 2: Localized Aggregated JSON load
                Object.keys(workflowTrace.aggregatedDatapoints).forEach(key => {
                    if (!Array.from(printModeSelect.options).some(o => o.value === 'agg_json_' + key)) {
                        const optAgg = document.createElement('option');
                        optAgg.value = 'agg_json_' + key;
                        optAgg.innerText = L('ui_opt_agg_json', {key: key});
                        printModeSelect.appendChild(optAgg);
                    }
                });

                 await buildVisualizationsAndUI(null, true, true);
 assistantPanel.style.display = 'block';
                document.getElementById('revalidateBtn').style.display = 'inline-flex';
                renderAssistantLogs();
                
                // Unlock print/export actions
                postUrlBtnNode.disabled = false;
                exportBtn.disabled = false;
                copyResultBtn.disabled = false;
                doPrintBtn.disabled = false;
                printModeSelect.disabled = false;
                doAnotherBtn.disabled = false;
                
                // --- FIX: Unlock ALL print and export buttons ---
                postUrlBtnNode.disabled = false; 
                exportBtn.disabled = false;      // Added this
                copyResultBtn.disabled = false; 
                doPrintBtn.disabled = false;
                printModeSelect.disabled = false; 
                doAnotherBtn.disabled = false;
                
                updateTokenTracker();
                updateAssistantCheckboxes();     // Added this to fix the assistant checkboxes
                showToast("✅ Trace state restored safely!");
            } catch(err) { showToast("Failed to parse trace JSON.", true); }
        };
        reader.readAsText(file);
        traceFileInput.value = '';
    });

    mergeFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function(evt) {
            try {
                const loaded = JSON.parse(evt.target.result);
                if (!loaded.quadrants) throw new Error("Invalid trace.");
                
                const existingNames = new Set(workflowTrace.quadrants.map(q => q.name));
                let addedCount = 0;
                 loaded.quadrants.forEach(q => {
                    if (!existingNames.has(q.name)) {
                        workflowTrace.quadrants.push(q);
                        existingNames.add(q.name);
                        addedCount++;
                    }
                });

                const incomingAbstracts = loaded.sharedAbstracts || {};
                for (let key in incomingAbstracts) {
                    if (key !== '__proto__' && key !== 'constructor') {
                        workflowTrace.sharedAbstracts[key] = incomingAbstracts[key];
                    }
                }

                const incomingCitations = loaded.apaCitations || {};
                for (let key in incomingCitations) {
                    if (key !== '__proto__' && key !== 'constructor') {
                        workflowTrace.apaCitations[key] = incomingCitations[key];
                    }
                }
                
                for(let key in loaded.globalTags) {
                    if (key === '__proto__' || key === 'constructor') continue; // Stop tag pollution
                    workflowTrace.globalTags[key] = (workflowTrace.globalTags[key] || 0) + loaded.globalTags[key];
                }

 if (loaded.assistantLogs) {
                    workflowTrace.assistantLogs = workflowTrace.assistantLogs.concat(loaded.assistantLogs);
                }
                if (loaded.allQuoteAttempts) {
                    workflowTrace.allQuoteAttempts = workflowTrace.allQuoteAttempts.concat(loaded.allQuoteAttempts);
                }
                if (loaded.failedQuotesLog) {
                    workflowTrace.failedQuotesLog = workflowTrace.failedQuotesLog.concat(loaded.failedQuotesLog);
                }
                if (loaded.executionLog) {
                    workflowTrace.executionLog = workflowTrace.executionLog.concat(loaded.executionLog);
                }
                
              if (loaded.mvcReports) {

                    loaded.mvcReports.forEach(r => {
                        if (!workflowTrace.mvcReports.find(existing => existing.id === r.id)) {
                            workflowTrace.mvcReports.push(r);
                            const opt = document.createElement('option');
                            opt.value = r.id;
                            opt.innerText = L('ui_opt_ai_report', {title: r.title});
                            printModeSelect.appendChild(opt);
                        }
                    });
                }
                
                // Patch 4: Localized Merged Aggregated JSON load
                if (loaded.aggregatedDatapoints) {
                    Object.keys(loaded.aggregatedDatapoints).forEach(key => {
                        if (!workflowTrace.aggregatedDatapoints[key]) workflowTrace.aggregatedDatapoints[key] = [];
                        workflowTrace.aggregatedDatapoints[key] = workflowTrace.aggregatedDatapoints[key].concat(loaded.aggregatedDatapoints[key]);
                        if (!Array.from(printModeSelect.options).some(o => o.value === 'agg_json_' + key)) {
                            const optAgg = document.createElement('option');
                            optAgg.value = 'agg_json_' + key;
                            optAgg.innerText = L('ui_opt_agg_json', {key: key});
                            printModeSelect.appendChild(optAgg);
                        }
                    });
                }
                
                await buildVisualizationsAndUI(null, true, true);
                renderAssistantLogs();
                
                addLog(`🔗 Merged ${addedCount} new Pentamatrices successfully! (Duplicates skipped)`);
                showToast("Trace merged!");
            } catch(err) { showToast("Failed to merge trace JSON.", true); }
        };
        reader.readAsText(file);
        mergeFileInput.value = '';
    });

    // ==========================================
    // DETERMINISTIC WIDGET REGISTRY (MVC Architecture)
    // ==========================================
    
    const emptyStateUI = `
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px dashed #334155; border-radius: 8px; padding: 30px 20px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 10px;">⚠️</div>
            <div style="color: gold; font-size: 0.85rem; font-weight: 600;">INSUFFICIENT TRACE DATA</div>
            <div style="color: #64748b; font-size: 0.75rem; margin-top: 5px;">This visualization requires sequential Matrix/Semmelweis data. The current trace contains single-node analyses.</div>
        </div>
    `;
    
    const WidgetRegistry = {
        metrics: (p, div, trace) => {
            const qLen = trace.quadrants?.length || 0;
            const absLen = Object.keys(trace.sharedAbstracts || {}).length;
            const citLen = Object.keys(trace.globalCitationMap || {}).length;
            let alignTotal = 0, consTotal = 0, confTotal = 0, count = 0;
            (trace.quadrants || []).forEach(q => {
                if(q.metrics) {
                    if(q.metrics.Alignment) alignTotal += q.metrics.Alignment;
                    if(q.metrics.Consilience) consTotal += q.metrics.Consilience;
                    if(q.metrics.Confidence) confTotal += q.metrics.Confidence;
                    count++;
                }
            });
            const avgAlign = count > 0 ? (alignTotal / count).toFixed(1) : "0.0";
            const avgCons = count > 0 ? (consTotal / count).toFixed(1) : "0.0";
            const avgConf = count > 0 ? (confTotal / count).toFixed(1) : "0.0";

            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; text-align: center;">
                    <div style="background:#0f172a; padding:15px; border-radius:8px; border:1px solid #1e293b;">
                        <div style="font-size:0.75rem; color:gold; text-transform:uppercase;">Quadrants</div>
                        <div style="font-size:2rem; color:#38bdf8; font-weight:bold; font-family:monospace;">${qLen}</div>
                    </div>
                    <div style="background:#0f172a; padding:15px; border-radius:8px; border:1px solid #1e293b;">
                        <div style="font-size:0.75rem; color:gold; text-transform:uppercase;">Unique Abstracts</div>
                        <div style="font-size:2rem; color:#38bdf8; font-weight:bold; font-family:monospace;">${absLen}</div>
                    </div>
                    <div style="background:#0f172a; padding:15px; border-radius:8px; border:1px solid #1e293b;">
                        <div style="font-size:0.75rem; color:gold; text-transform:uppercase;">Mapped Citations</div>
                        <div style="font-size:2rem; color:#38bdf8; font-weight:bold; font-family:monospace;">${citLen}</div>
                    </div>
                    <div style="background:#0f172a; padding:15px; border-radius:8px; border:1px solid #1e293b;">
                        <div style="font-size:0.75rem; color:gold; text-transform:uppercase;">Avg Metrics (A/C/C)</div>
                        <div style="font-size:1.6rem; color:#10b981; font-weight:bold; font-family:monospace;">${avgAlign}/${avgCons}/${avgConf}</div>
                    </div>
                </div>`);
        },

        synthesis: (p, div, trace) => {
            let content = p.content || "";
            content = content.replace(/\[(ID|Wiki ID|arXiv ID):?\s*(\d+)\]/gi, 
                '<span style="background:#1e3a8a; color:#60a5fa; padding:2px 6px; border-radius:4px; font-size:0.8rem; font-family:monospace; font-weight:bold; margin:0 2px;">$1: $2</span>'
            );
div.innerHTML += DOMPurify.sanitize(`<div style="line-height:1.8; color:#cbd5e1; font-size:0.95rem;">${content}</div>`);
        },

        divergence: (p, div, trace) => {
            let q1 = 4, q3 = 4;
            let label1 = "Original", label2 = "Adversarial";
            const run = p.runIndex || 1;
            
            if (trace.quadrants && trace.quadrants.length > 0) {
                const orig = trace.quadrants.find(q => q.name.includes(`Run${run}_original`));
                const adv = trace.quadrants.find(q => q.name.includes(`Run${run}_adversarial`));
                
                if (orig && adv) {
                    if (orig.metrics?.Alignment) q1 = orig.metrics.Alignment;
                    if (adv.metrics?.Alignment) q3 = adv.metrics.Alignment;
                } else {
                    const currentQ = trace.quadrants[trace.quadrants.length - 1];
                    label1 = "Alignment";
                    label2 = "Consilience";
                    if (currentQ.metrics?.Alignment) q1 = currentQ.metrics.Alignment;
                    if (currentQ.metrics?.Consilience) q3 = currentQ.metrics.Consilience;
                }
            } else {
                div.innerHTML += DOMPurify.sanitize(emptyStateUI);
                return;
            }

            const shift = (q1 - q3) * 25; 
            const center = 250;
            const pointer = center + shift;
            const color = q1 > q3 ? "#10b981" : (q1 < q3 ? "#ef4444" : "#cbd5e1");

            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 500 150" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                        <line x1="50" y1="80" x2="450" y2="80" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
                        <line x1="50" y1="80" x2="450" y2="80" stroke="#334155" stroke-width="2" stroke-dasharray="4,4"/>
                        <circle cx="50" cy="80" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
                        <circle cx="450" cy="80" r="14" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
                        <text x="50" y="45" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">${escapeHtml(label1)} (${q1})</text>
<text x="450" y="45" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">${escapeHtml(label2)} (${q3})</text>

                        <path d="M 50,80 Q 250,${80 + (q1-q3)*10} ${pointer},80" fill="none" stroke="#e2e8f0" stroke-width="3" stroke-dasharray="3,3"/>
                        <circle cx="${pointer}" cy="80" r="8" fill="#10b981" stroke="#059669" stroke-width="2"/>
                        <text x="${pointer}" y="120" fill="#10b981" font-size="12" font-weight="bold" font-family="monospace" text-anchor="middle">Dynamic Tension delta: ${Math.abs(q1 - q3).toFixed(1)}</text>
                    </svg>
                </div>`);
        },

        logic_network: (p, div, trace) => {
            let syntax = "graph TD\n    classDef default fill:#1e293b,stroke:#334155,stroke-width:2px,color:#e2e8f0;\n";
            let added = 0;
            let edges = new Set();
            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if (gate.From && gate.To) {
                            const labelFrom = gate.From.replace(/"/g, '&quot;');
                            const labelTo = gate.To.replace(/"/g, '&quot;');
                            const idFrom = gate.From.replace(/[^a-zA-Z0-9]/g, '_');
                            const idTo = gate.To.replace(/[^a-zA-Z0-9]/g, '_');
                            
                            const key = `${idFrom}->${idTo}`;
                            if (!edges.has(key)) {
                                edges.add(key);
                                const isNegative = (str) => {
                                    const r = str.toLowerCase();
                                    if (r.includes('not ') || r.includes('fails to')) return false; 
                                    return r.includes('-|') || /\b(inhibit|block|decrease|suppress|prevent|down-regulate|stop)\b/.test(r);
                                };
                                const rel = isNegative(gate.Relationship) ? "-.->" : "-->";
                                syntax += `    N_${idFrom}["${labelFrom}"] ${rel} N_${idTo}["${labelTo}"]\n`;
                                added++;
                            }
                        }
                    });
                }
            });
            if (added > 0) {
                const id = "mer_logic_" + Math.random().toString(36).substring(2,9);
                div.innerHTML += DOMPurify.sanitize(`<div class="mermaid" id="${id}" style="text-align:center;">${syntax}</div>`);
            } else {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No logic chains available in trace data.</p>`);
            }
        },

        gap_distribution: (p, div, trace) => {
            let gaps = { None: 0, Weak: 0, Medium: 0, Strong: 0 };
            let total = 0;
            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if (gate.Gap_Strength && gaps[gate.Gap_Strength] !== undefined) {
                            gaps[gate.Gap_Strength]++;
                            total++;
                        }
                    });
                }
            });
            if (total === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No gap strength metrics available.</p>`);
                return;
            }
            const slices = [];
            const colors = { None: "#10b981", Weak: "#3b82f6", Medium: "#f59e0b", Strong: "#ef4444" };
            Object.entries(gaps).forEach(([key, val]) => {
                slices.push({ key, val, pct: val / total, color: colors[key] });
            });
            const circ = 251.2;
            let currentOffset = 0, svgPaths = "";
            let legendHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin-top:15px; font-size:0.8rem; font-family:monospace;">';
            slices.forEach(slice => {
                const strokeLength = slice.pct * circ;
                const strokeOffset = circ - currentOffset;
                if (slice.val > 0) {
                    svgPaths += `<circle cx="100" cy="100" r="40" fill="none" stroke="${slice.color}" stroke-width="12" stroke-dasharray="${strokeLength} ${circ}" stroke-dashoffset="${strokeOffset}" transform="rotate(-90 100 100)"/>`;
                }
                currentOffset += strokeLength;
                legendHtml += `<span style="color:${slice.color};"><span style="display:inline-block; width:10px; height:10px; background:${slice.color}; margin-right:5px; border-radius:50%;"></span>${slice.key}: ${slice.val} (${(slice.pct*100).toFixed(1)}%)</span>`;
            });
            legendHtml += '</div>';
            div.innerHTML += DOMPurify.sanitize(`

                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 200 200" style="width:100%; max-width:200px; background:#020617; border-radius:50%;">
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#1e293b" stroke-width="12"/>
                        ${svgPaths}
                        <text x="100" y="105" fill="#fff" font-size="10" font-family="monospace" text-anchor="middle">Total: ${total}</text>
                    </svg>
                    ${legendHtml}
                </div>`);
        },

        node_centrality: (p, div, trace) => {
            let nodeFreq = {};
            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if (gate.From) nodeFreq[gate.From] = (nodeFreq[gate.From] || 0) + 1;
                        if (gate.To) nodeFreq[gate.To] = (nodeFreq[gate.To] || 0) + 1;
                    });
                }
            });
            const topNodes = Object.entries(nodeFreq).sort((a,b) => b[1] - a[1]).slice(0, 10);
            if (topNodes.length === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No centrality metrics available.</p>`);
                return;
            }
            const maxVal = topNodes[0][1];
            let svgBars = "";
            topNodes.forEach(([node, freq], idx) => {
                const y = 20 + idx * 25;
                const width = maxVal > 0 ? (freq / maxVal) * 280 : 0;
                // Define the variable properly in JS scope
                const rawNodeText = node.length > 26 ? node.substring(0, 24) + '..' : node;
                
                // Construct the SVG string in a single template literal
                svgBars += `
                    <text x="5" y="${y + 12}" fill="gold" font-size="9" font-family="monospace">${escapeHtml(rawNodeText)}</text>
                    <rect x="180" y="${y}" width="${width}" height="14" fill="#3b82f6" rx="3" stroke="#1d4ed8" stroke-width="1"/>
                    <text x="${188 + width}" y="${y + 11}" fill="#38bdf8" font-size="10" font-family="monospace">${freq}</text>`;
            });
            div.innerHTML += DOMPurify.sanitize(`
                <svg viewBox="0 0 500 280" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                    ${svgBars}
                </svg>`);
        },

        semantic_attractor: (p, div, trace) => {
            const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would", "between", "using"]);
            const sorted = Object.entries(trace.globalTags || {})
                .filter(([w]) => !stopWords.has(w) && w.length > 3)
                .sort((a,b) => b[1] - a[1]).slice(0, 12);
            if (sorted.length === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No tags available to plot attractor.</p>`);
                return;
            }
            let syntax = "graph TD\n    Core((Dataset Attractor)):::coreClass\n";
            sorted.forEach(([word, freq]) => {
                const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
                syntax += `    Core --- T_${cleanWord}["${word} (${freq})"]\n`;
            });
            syntax += `    classDef coreClass fill:#3b82f6,color:#fff,stroke:#1e40af,stroke-width:4px;\n`;
            const id = "mer_attractor_" + Math.random().toString(36).substring(2,9);
            div.innerHTML += DOMPurify.sanitize(`<div class="mermaid" id="${id}" style="text-align:center;">${syntax}</div>`);
        },

        radar_plot: (p, div, trace) => {
            const quads = (trace.quadrants || []).slice(0, 4);
            if (quads.length < 2) {
                div.innerHTML += DOMPurify.sanitize(emptyStateUI);
                return;
            }
            const cx = 250, cy = 150, maxR = 100;
            const getCoords = (val, angle) => {
                const r = (val / 7) * maxR;
                const rad = (angle * Math.PI) / 180;
                return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
            };
            let grid = "";
            for (let i = 1; i <= 7; i++) {
                const r = (i / 7) * maxR;
                const p1 = getCoords(i, 90), p2 = getCoords(i, 210), p3 = getCoords(i, 330);
                grid += `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="none" stroke="#1e293b" stroke-width="1"/>`;
                if (i === 7) {
                    grid += `
                        <text x="${p1.x}" y="${p1.y - 10}" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">Alignment</text>
                        <text x="${p2.x + 10}" y="${p2.y + 10}" fill="#10b981" font-size="10" font-family="monospace" text-anchor="start">Consilience</text>
                        <text x="${p3.x - 10}" y="${p3.y + 10}" fill="#f59e0b" font-size="10" font-family="monospace" text-anchor="end">Confidence</text>
                        <line x1="${cx}" y1="${cy}" x2="${p1.x}" y2="${p1.y}" stroke="#334155" stroke-width="1" stroke-dasharray="2,2"/>
                        <line x1="${cx}" y1="${cy}" x2="${p2.x}" y2="${p2.y}" stroke="#334155" stroke-width="1" stroke-dasharray="2,2"/>
                        <line x1="${cx}" y1="${cy}" x2="${p3.x}" y2="${p3.y}" stroke="#334155" stroke-width="1" stroke-dasharray="2,2"/>`;
                }
            }
            const colors = ["rgba(59,130,246,0.3)", "rgba(16,185,129,0.3)", "rgba(245,158,11,0.3)", "rgba(139,92,246,0.3)"];
            const borders = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
            let polys = "", legendHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:12px; font-size:0.75rem; font-family:monospace; margin-top:10px;">';
            quads.forEach((q, idx) => {
                if (q.metrics) {
                    const c1 = getCoords(q.metrics.Alignment || 1, 90);
                    const c2 = getCoords(q.metrics.Consilience || 1, 210);
                    const c3 = getCoords(q.metrics.Confidence || 1, 330);
                    polys += `<polygon points="${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y}" fill="${colors[idx]}" stroke="${borders[idx]}" stroke-width="2"/>`;
const cleanName = q.name.split('_').slice(1).join(' ').toUpperCase();
legendHtml += `<span><span style="display:inline-block; width:10px; height:10px; background:${borders[idx]}; margin-right:5px; border-radius:3px;"></span>${escapeHtml(cleanName)}</span>`;
                }
            });
            legendHtml += '</div>';
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 500 300" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                        ${grid} ${polys}
                    </svg>
                    ${legendHtml}
                </div>`);
        },

        score_timeline: (p, div, trace) => {
            const quads = trace.quadrants || [];
            if (quads.length < 2) {
                div.innerHTML += DOMPurify.sanitize(emptyStateUI);
                return;
            }
            const width = 500, height = 200, padding = 45;
            const pts = quads.length;
            const getX = (idx) => padding + (idx / (pts - 1)) * (width - padding * 2);
            const getY = (val) => height - padding - ((val - 1) / 6) * (height - padding * 2);

            let aPts = "", c1Pts = "", c2Pts = "", gridLines = "";
            for (let i = 1; i <= 7; i++) {
                const y = getY(i);
                gridLines += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#1e293b" stroke-width="1"/>
                             <text x="${padding - 10}" y="${y + 4}" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end">${i}</text>`;
            }
            quads.forEach((q, idx) => {
                if (q.metrics) {
                    const x = getX(idx);
                    aPts += `${x},${getY(q.metrics.Alignment || 1)} `;
                    c1Pts += `${x},${getY(q.metrics.Consilience || 1)} `;
                    c2Pts += `${x},${getY(q.metrics.Confidence || 1)} `;
const rawText = q.name.split('_')[1].substring(0, 4) + '...';
gridLines += `<text x="${x}" y="${height - padding + 15}" fill="#64748b" font-size="8" font-family="monospace" text-anchor="middle">${escapeHtml(rawText)}</text>`;
                }
            });
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 ${width} ${height}" style="width:100%; max-width:${width}px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                        ${gridLines}
                        <polyline points="${aPts}" fill="none" stroke="#3b82f6" stroke-width="3"/>
                        <polyline points="${c1Pts}" fill="none" stroke="#10b981" stroke-width="3"/>
                        <polyline points="${c2Pts}" fill="none" stroke="#f59e0b" stroke-width="3"/>
                    </svg>
                    <div style="display:flex; justify-content:center; gap:20px; font-size:0.75rem; font-family:monospace; margin-top:10px;">
                        <span><span style="display:inline-block; width:12px; height:4px; background:#3b82f6; margin-right:5px;"></span>Alignment</span>
                        <span><span style="display:inline-block; width:12px; height:4px; background:#10b981; margin-right:5px;"></span>Consilience</span>
                        <span><span style="display:inline-block; width:12px; height:4px; background:#f59e0b; margin-right:5px;"></span>Confidence</span>
                    </div>
                </div>`);
        },

        contradiction_topology: (p, div, trace) => {
            let relations = {};
            
            const getSign = (rel) => {
                const r = rel.toLowerCase().trim();
                if (r.includes('not ') || r.includes('fails to') || r.includes('no ')) {
                    if (/\b(inhibit|block|decrease|suppress|prevent|down-regulate)\b/.test(r)) return 'positive'; 
                    return 'negative'; 
                }
                if (r.includes('-|') || /\b(inhibit|block|decrease|refute|suppress|prevent|down-regulate|downregulate|stop)\b/.test(r)) return 'negative';
                if (r.includes('-->') || r.includes('->') || /\b(trigger|promot|increase|activat|act as|validate|up-regulate|upregulate|cause|induce)\b/.test(r)) return 'positive';
                return 'neutral';
            };

            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if (gate.From && gate.To) {
                            const key = `${gate.From} &rarr; ${gate.To}`;
                            if (!relations[key]) relations[key] = { raw: new Set(), signs: new Set() };
                            relations[key].raw.add(gate.Relationship);
                            relations[key].signs.add(getSign(gate.Relationship));
                        }
                    });
                }
            });

            let conflictRows = "";
            Object.entries(relations).forEach(([edge, data]) => {
                if (data.signs.has('positive') && data.signs.has('negative')) {
                    conflictRows += `
                        <tr style="border-bottom:1px solid #1e293b;">
                            <td style="padding:10px; color:#ef4444; font-weight:bold;">${edge}</td>
                            <td style="padding:10px; color:#cbd5e1; font-family:monospace;">${Array.from(data.raw).join(', ')}</td>
                            <td style="padding:10px; color:gold; font-style:italic;">True directional (+ vs -) conflict verified.</td>
                        </tr>`;
                }
            });

            if (!conflictRows) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#10b981; font-style:italic;">No pathway contradictions or directional conflicts found in active logic networks.</p>`);
                return;
            }
            div.innerHTML += DOMPurify.sanitize(`
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:#0f172a; border-radius:6px; overflow:hidden;">
                    <thead><tr style="background:#1e293b; color:gold; text-transform:uppercase;">
                        <th style="padding:10px; text-align:left;">Conflicting Logic Edge</th>
                        <th style="padding:10px; text-align:left;">Used Relationships</th>
                        <th style="padding:10px; text-align:left;">Assessment</th>
                    </tr></thead>
                    <tbody>${conflictRows}</tbody>
                </table>`);
        },

        bottlenecks: (p, div, trace) => {
            let items = "";
            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Logic_Chain) {
                    q.metrics.Logic_Chain.forEach(gate => {
                        if (gate.From && gate.To && (gate.Gap_Strength === "Strong" || gate.Gap_Strength === "Medium")) {
                            const color = gate.Gap_Strength === "Strong" ? "#ef4444" : "#f59e0b";
                            items += `
                                <div style="background:#0f172a; border-left:4px solid ${color}; padding:15px; border-radius:4px; margin-bottom:12px;">
                                    <div style="display:flex; justify-content:between; align-items:center;">
                                        <strong style="color:#e2e8f0; font-size:0.9rem;">${gate.From} &rarr; ${gate.To}</strong>
                                        <span style="background:${color}33; color:${color}; font-size:0.75rem; font-family:monospace; font-weight:bold; padding:2px 8px; border-radius:20px; text-transform:uppercase; margin-left:auto;">${gate.Gap_Strength} Gap</span>
                                    </div>
                                    <div style="font-size:0.8rem; color:gold; margin-top:8px; line-height:1.4;">${gate.Justification || 'No justification parsed.'}</div>
                                </div>`;
                        }
                    });
                }
            });
            if (!items) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#10b981; font-style:italic;">No significant bottlenecks or unresolved gaps found.</p>`);
                return;
            }
div.innerHTML += DOMPurify.sanitize(`<div style="max-height:350px; overflow-y:auto; padding-right:5px;">${items}</div>`);
        },

        tag_cloud: (p, div, trace) => {
            const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would", "between", "using"]);
            const sorted = Object.entries(trace.globalTags || {})
                .filter(([w]) => !stopWords.has(w) && w.length > 3)
                .sort((a,b) => b[1] - a[1]).slice(0, 20);
            if (sorted.length === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No keywords available.</p>`);
                return;
            }
            const maxVal = sorted[0][1], minVal = sorted[sorted.length - 1][1];
            let cloudHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; align-items:center; padding:10px;">';
            sorted.forEach(([word, freq]) => {
                const step = maxVal > minVal ? (freq - minVal) / (maxVal - minVal) : 0.5;
                const fontSize = Math.floor(12 + step * 33); 
                const hue = Math.floor(180 + step * 100); 
                cloudHtml += `<span style="font-size:${fontSize}px; color:hsl(${hue}, 80%, 65%); font-family:sans-serif; font-weight:bold; cursor:default; transition:0.2s;" title="Occurs ${freq} times">${word}</span>`;
            });
            cloudHtml += '</div>';
div.innerHTML += DOMPurify.sanitize(cloudHtml);
        },

        keyword_spectrum: (p, div, trace) => {
            const stopWords = new Set(["their", "about", "which", "these", "other", "there", "would", "between", "using"]);
            const sorted = Object.entries(trace.globalTags || {})
                .filter(([w]) => !stopWords.has(w) && w.length > 3)
                .sort((a,b) => b[1] - a[1]).slice(0, 10);
            if (sorted.length === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No keywords available.</p>`);
                return;
            }
            const maxVal = sorted[0][1];
            let svgBars = "";
            sorted.forEach(([word, freq], idx) => {
                const x = 50 + idx * 42;
                const barHeight = maxVal > 0 ? (freq / maxVal) * 180 : 0;
                const y = 230 - barHeight;
                svgBars += `
                    <rect x="${x}" y="${y}" width="24" height="${barHeight}" fill="#8b5cf6" rx="3" stroke="#7c3aed" stroke-width="1"/>
                    <text x="${x + 12}" y="${y - 8}" fill="#a78bfa" font-size="9" font-family="monospace" text-anchor="middle">${freq}</text>
    <text x="${x + 12}" y="248" fill="gold" font-size="8" font-family="monospace" text-anchor="end" transform="rotate(-40 ${x + 12} 248)">${escapeHtml(word.substring(0, 8))}</text>`;
            });
            div.innerHTML += DOMPurify.sanitize(`
                <svg viewBox="0 0 500 300" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                    ${svgBars}
                </svg>`);
        },

        provider_distribution: (p, div, trace) => {
            let providers = { PubMed: 0, OpenAlex: 0, arXiv: 0, Wikipedia: 0 };
            let total = 0;
            Object.keys(trace.sharedAbstracts || {}).forEach(id => {
                const lowerId = id.toLowerCase();
                if (/^\d+$/.test(id)) providers.PubMed++;
                else if (lowerId.includes('arxiv') || lowerId.includes('abs')) providers.arXiv++;
                else if (lowerId.includes('wiki')) providers.Wikipedia++;
                else providers.OpenAlex++;
                total++;
            });
            if (total === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No abstracts loaded.</p>`);
                return;
            }
            const colors = { PubMed: "#3b82f6", OpenAlex: "#10b981", arXiv: "#ef4444", Wikipedia: "#f59e0b" };
            let accumulatedWidth = 0, svgBarSegments = "";
            let legendHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin-top:20px; font-size:0.8rem; font-family:monospace;">';
            Object.entries(providers).forEach(([key, val]) => {
                const pct = val / total;
                const width = pct * 400;
                if (width > 0) {
                    svgBarSegments += `<rect x="${50 + accumulatedWidth}" y="60" width="${width}" height="30" fill="${colors[key]}" stroke="#020617" stroke-width="1"/>`;
                }
                accumulatedWidth += width;
legendHtml += `<span><span style="display:inline-block; width:10px; height:10px; background:${colors[key]}; margin-right:5px; border-radius:3px;"></span>${escapeHtml(key)}: ${val} (${(pct*100).toFixed(1)}%)</span>`;
            });
            legendHtml += '</div>';
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 500 130" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                        <rect x="50" y="60" width="400" height="30" fill="none" stroke="#1e293b" stroke-width="2" rx="4"/>
                        ${svgBarSegments}
                        <text x="250" y="35" fill="#e2e8f0" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">Literature Source Breakdown (Total: ${total})</text>
                    </svg>
                    ${legendHtml}
                </div>`);
        },

        chronological_timeline: (p, div, trace) => {
            let years = {};
            Object.values(trace.apaCitations || {}).forEach(citation => {
                const match = citation.match(/\((19\d{2}|20\d{2})\)/);
                if (match) { years[match[1]] = (years[match[1]] || 0) + 1; }
            });
            const sortedYears = Object.entries(years).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));
            if (sortedYears.length === 0) {
                div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No publication year citations mapped in active trace.</p>`);
                return;
            }
            const maxFreq = Math.max(...sortedYears.map(item => item[1]));
            let timelineHtml = '<div style="display:flex; overflow-x:auto; gap:15px; padding:15px; background:#0f172a; border-radius:6px; border:1px solid #1e293b; align-items:flex-end; max-width:100%; box-sizing:border-box;">';
            sortedYears.forEach(([year, freq]) => {
                const height = maxFreq > 0 ? (freq / maxFreq) * 60 : 0;
                timelineHtml += `
                    <div style="display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
                        <div style="font-size:0.7rem; color:#38bdf8; font-family:monospace; margin-bottom:4px;">${freq}</div>
                        <div style="width:20px; height:${height}px; background:linear-gradient(to top, #3b82f6, #60a5fa); border-radius:3px;"></div>
                        <div style="font-size:0.75rem; color:gold; font-family:monospace; margin-top:6px; border-top:1px solid #334155; padding-top:4px;">${year}</div>
                    </div>`;
            });
            timelineHtml += '</div>';
            div.innerHTML += DOMPurify.sanitize(timelineHtml);
        },

        translation_readiness: (p, div, trace) => {
            let total = 0, count = 0;
            (trace.quadrants || []).forEach(q => {
                if(q.metrics && q.metrics.Confidence) {
                    total += q.metrics.Confidence;
                    count++;
                }
            });
            const avgConf = count > 0 ? total / count : 4;
const cleanSubtitle = p.subtitle || 'Systems Translation Readiness';

            const pct = (avgConf / 7) * 100;
            const strokeDash = (pct / 100) * 251.2;
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 200 200" style="width:100%; max-width:200px; background:#020617; border-radius:50%;">
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#1e293b" stroke-width="10"/>
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#10b981" stroke-width="10" stroke-dasharray="${strokeDash} 252" transform="rotate(-90 100 100)"/>
                        <text x="100" y="105" fill="#fff" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">${pct.toFixed(0)}%</text>
                    </svg>
                    <div style="margin-top:10px; font-size:0.85rem; font-family:monospace; color:#cbd5e1; text-align:center;">
                        <strong>Average Confidence Tier: ${avgConf.toFixed(1)}/7.0</strong><br>
        <span style="font-size:0.75rem; color:gold;">${escapeHtml(cleanSubtitle)}</span>
                    </div>
                </div>`);
        },

        verification_audit: (p, div, trace) => {
            let total = 0, pass = 0, fail = 0;
            (trace.allQuoteAttempts || []).forEach(q => {
                if(q.status === 'PASS') pass++;
                else fail++;
                total++;
            });
            div.innerHTML += DOMPurify.sanitize(`
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:#0f172a; border-radius:6px; overflow:hidden;">
                    <thead><tr style="background:#1e293b; color:gold; text-transform:uppercase;">
                        <th style="padding:10px; text-align:left;">Metrics Parameter</th>
                        <th style="padding:10px; text-align:center;">Score</th>
                        <th style="padding:10px; text-align:left;">Assessment Status</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #1e293b;">
                            <td style="padding:10px; color:#cbd5e1;">Total Verification Attempts</td>
                            <td style="padding:10px; text-align:center; color:#38bdf8; font-weight:bold; font-family:monospace;">${total}</td>
                            <td style="padding:10px; color:gold;">Self-correction iterations executed</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1e293b;">
                            <td style="padding:10px; color:#cbd5e1;">Passed Quotes (Character-Perfect)</td>
                            <td style="padding:10px; text-align:center; color:#10b981; font-weight:bold; font-family:monospace;">${pass}</td>
                            <td style="padding:10px; color:#10b981;">🟢 100% Verbatim compliance</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1e293b;">
                            <td style="padding:10px; color:#cbd5e1;">Failed Quotes (Mismatches Resolved)</td>
                            <td style="padding:10px; text-align:center; color:#ef4444; font-weight:bold; font-family:monospace;">${fail}</td>
                            <td style="padding:10px; color:#ef4444;">🔴 Hallucinations caught & pruned</td>
                        </tr>
                    </tbody>
                </table>`);
        },

        study_matrix: (p, div, trace) => {
            let matrixHtml = '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">';
            let categories = {};
            (trace.quadrants || []).forEach(q => {
                if (q.metrics && q.metrics.Study_Type_Audit) {
                    Object.entries(q.metrics.Study_Type_Audit).forEach(([id, str]) => {
                        const parsedStr = str.split(':');
                        const cat = parsedStr[0].replace(/_/g, ' ').toUpperCase();
                        let count = 1;
                        if(parsedStr[1]) {
                            const countMatch = parsedStr[1].match(/\d+/);
                            if(countMatch) count = parseInt(countMatch[0]);
                        }
                        categories[cat] = (categories[cat] || 0) + count;
                    });
                }
            });
            Object.entries(categories).forEach(([cat, count]) => {
                matrixHtml += `
                    <div style="background:#0f172a; border:1px solid #1e293b; border-radius:6px; padding:12px; text-align:center;">
                        <div style="font-size:0.7rem; color:gold; text-transform:uppercase; margin-bottom:5px;">${cat}</div>
                        <div style="font-size:1.4rem; color:#38bdf8; font-weight:bold; font-family:monospace;">${count}</div>
                    </div>`;
            });
            matrixHtml += '</div>';
            div.innerHTML += DOMPurify.sanitize(matrixHtml);
        },

        divergence_attractor: (p, div, trace) => {
            let leftNodes = [], rightNodes = [];
            
            (trace.quadrants || []).forEach(q => {
                if (q.name.includes('_original') && q.metrics) {
                    leftNodes.push({ name: q.name.replace(/Run\d+_original/gi, 'Original'), val: q.metrics.Alignment || 4 });
                }
                if (q.name.includes('_adversarial') && q.metrics) {
                    rightNodes.push({ name: q.name.replace(/Run\d+_adversarial/gi, 'Adversarial'), val: q.metrics.Alignment || 4 });
                }
            });

            if (leftNodes.length === 0 || rightNodes.length === 0) {
                div.innerHTML += DOMPurify.sanitize(emptyStateUI);
                return;
            }

            let svgLinks = "", svgNodes = "";
            leftNodes.forEach((node, idx) => {
                const y1 = 40 + idx * (180 / Math.max(leftNodes.length, 1));
                const r1 = (node.val / 7) * 15;

svgNodes += `<circle cx="100" cy="${y1}" r="${r1}" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
             <text x="80" y="${y1 + 4}" fill="gold" font-size="9" font-family="monospace" text-anchor="end">${escapeHtml(node.name)} (${node.val})</text>`;
 
                rightNodes.forEach((rightNode, rIdx) => {
                    const y2 = 40 + rIdx * (180 / Math.max(rightNodes.length, 1));
                    const r2 = (rightNode.val / 7) * 15;
                    if(idx === 0) {
                        svgNodes += `<circle cx="400" cy="${y2}" r="${r2}" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
                                     <text x="420" y="${y2 + 4}" fill="gold" font-size="9" font-family="monospace" text-anchor="start">${rightNode.name} (${rightNode.val})</text>`;
                    }
                    const strength = Math.abs(node.val - rightNode.val);
                    const strokeWidth = Math.max(1, (7 - strength) / 2);
                    const color = node.val > rightNode.val ? "#10b981" : (node.val < rightNode.val ? "#ef4444" : "#8b5cf6");
                    svgLinks += `<line x1="100" y1="${y1}" x2="400" y2="${y2}" stroke="${color}" stroke-opacity="0.3" stroke-width="${strokeWidth}"/>`;
                });
            });
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 500 250" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                        ${svgLinks} ${svgNodes}
                        <text x="250" y="235" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">Hypothesis Tension Vector Network</text>
                    </svg>
                </div>`);
        },
        
        bibliography: (p, div, trace) => {
            let html = '<ul style="font-size:0.85rem; color:gold; padding-left:20px; list-style-type:decimal;">';
            const entries = Object.entries(trace.globalCitationMap || {}).sort((a,b) => a[1]-b[1]);
            entries.forEach(([id, num]) => { html += `<li style="margin-bottom:10px;"><strong style="color:#cbd5e1;">[ID: ${id}]</strong> ${trace.apaCitations?.[id] || ''}</li>`; });
            html += '</ul>';
div.innerHTML += DOMPurify.sanitize(html);
        },

        data_pie_chart: (p, div, trace) => {
            const data = p.data || [];
            if (data.length === 0) { div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No data provided for pie chart.</p>`); return; }
            
            const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
            const circ = 251.2;
            let currentOffset = 0, svgPaths = "", legendHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:12px; margin-top:15px; font-size:0.8rem; font-family:monospace;">';
            const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
            
            data.forEach((item, idx) => {
                const val = Number(item.value) || 0;
                const pct = total > 0 ? val / total : 0;
                const color = item.color || colors[idx % colors.length];
                const strokeLength = pct * circ;
                const strokeOffset = circ - currentOffset;
                
                if (val > 0) {
                    svgPaths += `<circle cx="100" cy="100" r="40" fill="none" stroke="${color}" stroke-width="15" stroke-dasharray="${strokeLength} ${circ}" stroke-dashoffset="${strokeOffset}" transform="rotate(-90 100 100)"/>`;
                }
                currentOffset += strokeLength;
legendHtml += `<span style="color:${color};"><span style="display:inline-block; width:10px; height:10px; background:${color}; margin-right:5px; border-radius:50%;"></span>${escapeHtml(item.label)}: ${val} (${(pct*100).toFixed(1)}%)</span>`;
            });
            legendHtml += '</div>';
            
            div.innerHTML += DOMPurify.sanitize(`
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <svg viewBox="0 0 200 200" style="width:100%; max-width:220px; background:#020617; border-radius:50%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#1e293b" stroke-width="15"/>
                        ${svgPaths}
                        <text x="100" y="105" fill="#fff" font-size="10" font-family="monospace" text-anchor="middle">Total: ${total}</text>
                    </svg>
                    ${legendHtml}
                </div>`);
        },

        data_bar_chart: (p, div, trace) => {
            const data = p.data || [];
            if (data.length === 0) { div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No data provided for bar chart.</p>`); return; }
            
            const maxVal = Math.max(...data.map(d => Number(d.value) || 0));
            let svgBars = "";
            const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
            
            data.forEach((item, idx) => {
                const val = Number(item.value) || 0;
                const color = item.color || colors[idx % colors.length];
                const x = 50 + idx * (400 / Math.max(data.length, 1));
                const barHeight = maxVal > 0 ? (val / maxVal) * 180 : 0;
                const y = 230 - barHeight;
                
                svgBars += `
                    <rect x="${x}" y="${y}" width="28" height="${barHeight}" fill="${color}" rx="3" stroke="#0f172a" stroke-width="2"/>
                    <text x="${x + 14}" y="${y - 8}" fill="${color}" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">${val}</text>
                    <text x="${x + 14}" y="250" fill="gold" font-size="9" font-family="monospace" text-anchor="end" transform="rotate(-40 ${x + 14} 250)">${item.label.substring(0, 12)}</text>`;
            });
            div.innerHTML += DOMPurify.sanitize(`
                <svg viewBox="0 0 500 300" style="width:100%; max-width:500px; background:#020617; border-radius:8px; border:1px solid #1e293b;">
                    <line x1="40" y1="230" x2="480" y2="230" stroke="#334155" stroke-width="2"/>
                    ${svgBars}
                    <text x="250" y="290" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">${p.xAxisLabel || 'Categories'}</text>
                </svg>`);
        },

        event_timeline: (p, div, trace) => {
            const events = p.data || []; 
            if (events.length === 0) { div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No events provided.</p>`); return; }
            
            let html = '<div style="position:relative; padding-left:20px;">';
            html += '<div style="position:absolute; left:7px; top:10px; bottom:10px; width:2px; background:#334155;"></div>';
            
            events.forEach((ev) => {
                html += `
                <div style="position:relative; margin-bottom:20px;">
                    <div style="position:absolute; left:-19px; top:4px; width:10px; height:10px; border-radius:50%; background:#38bdf8; border:2px solid #0f172a;"></div>
                    <div style="font-size:0.75rem; color:#38bdf8; font-family:monospace; font-weight:bold; margin-bottom:4px;">${ev.date}</div>
                    <div style="background:#0f172a; border:1px solid #1e293b; padding:12px; border-radius:6px;">
                        <div style="color:#e2e8f0; font-weight:bold; font-size:0.9rem; margin-bottom:4px;">${ev.title}</div>
                        <div style="color:gold; font-size:0.85rem; line-height:1.4;">${ev.desc}</div>
                    </div>
                </div>`;
            });
            html += '</div>';
div.innerHTML += DOMPurify.sanitize(html);

        },

        comparison_matrix: (p, div, trace) => {
            const headers = p.headers || []; 
            const rows = p.rows || []; 
            if (headers.length === 0 || rows.length === 0) { div.innerHTML += DOMPurify.sanitize(`<p style="font-size:0.85rem; color:#64748b; font-style:italic;">No matrix data provided.</p>`); return; }
            
            let html = `<table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:#0f172a; border-radius:6px; overflow:hidden;">
                        <thead><tr style="background:#1e293b; color:gold; text-transform:uppercase;">`;
            headers.forEach(h => html += `<th style="padding:10px; text-align:left;">${h}</th>`);
            html += `</tr></thead><tbody>`;
            
            rows.forEach(row => {
                html += `<tr style="border-bottom:1px solid #1e293b;">`;
                row.forEach((cell, i) => {
                    const color = i === 0 ? "#38bdf8" : "#cbd5e1";
                    const weight = i === 0 ? "bold" : "normal";
                    html += `<td style="padding:10px; color:${color}; font-weight:${weight};">${cell}</td>`;
                });
                html += `</tr>`;
            });
            html += `</tbody></table>`;
div.innerHTML += DOMPurify.sanitize(html);
        }
    };

    function renderMVCReport(plan, targetContainer, trace) {
const defaultNotice = "PathMap Studio™ v1.0 - Open Source (Apache 2.0), software by Joshua Dungan, Artificial General Intelligence LLC, Grand Rapids, Michigan.";
        const watermarkText = trace.authorship?.watermark || defaultNotice;
    const safeWatermark = DOMPurify.sanitize(watermarkText);

    targetContainer.innerHTML = `<style>
        .mvc-dash { display:flex; flex-direction:column; gap:2.5rem; background:#0b1120; color:#e2e8f0; padding:20px; border-radius:12px; box-sizing:border-box; width:100%; }
        .mvc-panel { background:#1e293b; border:1px solid #334155; border-radius:12px; padding:24px; box-sizing:border-box; width:100%; }
        .mvc-panel h4 { color:#38bdf8; margin-top:0; margin-bottom:15px; text-transform:uppercase; font-family:'JetBrains Mono', monospace; font-size:1rem; border-bottom:1px solid #334155; padding-bottom:10px;}
        
        .mvc-panel .mermaid text, 
        .mvc-panel .mermaid span, 
        .mvc-panel .mermaid div,
        .mvc-panel .mermaid .nodeLabel { 
            color: #0f172a !important; 
        }

        .print-watermark { display: none; }

        @media print {
            .mvc-dash { display: block !important; background: white !important; color: #0f172a !important; padding: 0 !important; }
            .mvc-panel { display: block !important; background: white !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; page-break-inside: avoid !important; margin-bottom: 2rem !important; }
            .mvc-panel h4 { color: #1e3a8a !important; border-bottom: 1px solid #cbd5e1 !important; }
            .mvc-panel svg { max-width: 100% !important; height: auto !important; page-break-inside: avoid !important; }
            .mvc-panel svg text { fill: #0f172a !important; }
            .mvc-panel svg line, .mvc-panel svg path { stroke: gold !important; }
            .mvc-panel svg rect { stroke: gold !important; }
            .mvc-panel table { background: white !important; border: 1px solid #cbd5e1 !important; page-break-inside: auto !important; }
            .mvc-panel tr { page-break-inside: avoid !important; page-break-after: auto !important; }
            .mvc-panel td { color: #0f172a !important; border-bottom: 1px solid #cbd5e1 !important; }
            .mvc-panel th { background: #f1f5f9 !important; color: #1e293b !important; border-bottom: 2px solid gold !important; }
            .mvc-panel div[style*="background"] { background: #f8fafc !important; border: 1px solid #cbd5e1 !important; }
            .mvc-panel strong { color: #1e3a8a !important; }
            
            body { padding-bottom: 60px !important; }
            .print-watermark { display: block !important; position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px 0; font-size: 0.75rem; color: #64748b; font-family: monospace; background: white; border-top: 1px dashed #cbd5e1; z-index: 9999; }
        }
    </style>
    <div class="print-watermark">${safeWatermark}</div>
    <div class="mvc-dash" id="mvc-root"></div>`;	
        
        const root = targetContainer.querySelector('#mvc-root');
        
        root.innerHTML += DOMPurify.sanitize(`<div class="mvc-panel" style="background:linear-gradient(135deg, #0ea5e9, #6366f1); text-align:center; border:none; box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);">
    <h1 style="margin:0; color:#fff; font-size:1.8rem; font-weight:800;">${plan.title || 'SYSTEMS REPORT'}</h1>
    <div style="margin-top:15px; padding:6px 16px; background:#10b981; color:#022c22; border-radius:20px; display:inline-block; font-weight:bold; font-size:0.9rem;">TIER: ${plan.evidence_tier || 'EVALUATED'}</div>
</div>`);


        (plan.panels || []).forEach(p => {
            if (WidgetRegistry[p.type]) {
                const pDiv = document.createElement('div');
                pDiv.className = 'mvc-panel';
		if (p.title) pDiv.innerHTML = `<h4>${escapeHtml(p.title)}</h4>`;
                WidgetRegistry[p.type](p, pDiv, trace);
                root.appendChild(pDiv);
            }
        });

        setTimeout(() => { if(window.mermaid) mermaid.run({nodes: root.querySelectorAll('.mermaid')}); }, 150);
    }

    // ==========================================
    // AI ASSISTANT PANEL
    // ==========================================
    cancelAssistantBtn.addEventListener('click', () => {
        if(assistantAbortController) assistantAbortController.abort();
    });

document.getElementById('assistantMemoryMode').addEventListener('change', function() {
    const historyCb = document.getElementById('assistantHistoryCb');
    if (this.value === 'groundhog') {
        historyCb.checked = false;
    } else {
        historyCb.checked = true;
    }
});
     async function runAssistantQuery(q) {
        if (!session.apiKey && session.provider !== 'localhost' && session.provider !== 'custom') { showToast("API key required.", true); return; }
        if (!q) return;
        
 assistantAbortController = new AbortController();
        askAssistantBtn.style.display = 'none';
        cancelAssistantBtn.style.display = 'none'; // Hide inline cancel, use overlay instead
        
        // Setup & Show the Overlay
const overlay = document.getElementById('learningOverlay');
        const toonName = TOON_PROFILE.name ? TOON_PROFILE.name.split(' ')[0] : "AI";
        document.getElementById('learningProgressText').innerHTML = DOMPurify.sanitize(L('log_thinking', {name: escapeHtml(toonName)}));

        cancelBtn.disabled = false;
        cancelBtn.innerText = L('ui_btn_cancel');
        statusDiv.innerHTML = ""; 
        overlay.style.display = 'flex';
        
addLog(L('log_querying_assistant', {query: q.length > 50 ? q.substring(0, 47) + '...' : q}));
        
        assistantResponseArea.style.display = 'block';

        assistantResponseArea.innerHTML = `
            <div style="margin-bottom: 15px; padding-bottom: 10px;">
                <strong>${L('ui_assist_user') || 'User:'}</strong> ${escapeHtml(q)}<br><br>
                <strong>${L('ui_assist_ai') || 'Assistant:'}</strong><br>
                <div class="assistant-reply-box" style="white-space: pre-wrap; font-family: inherit; font-size: 0.95rem;"><pre>${L('ui_assist_thinking') || '🤔 AI is analyzing the dataset...'}</pre></div>
            </div>`;
        
        const replyBox = assistantResponseArea.querySelector('.assistant-reply-box');

        // --- DYNAMIC LIMIT ALLOCATION ---
      // 1. Resolve Global Limit (L)
        let globalLimitStr = document.getElementById('contextLimit').value;
        let globalLimit = globalLimitStr ? parseInt(globalLimitStr, 10) : 512000;
        if (isNaN(globalLimit) || globalLimit <= 0) globalLimit = 512000;

        // 2. Resolve Chat Memory Limit (M) based on selected mode
      const memoryModeEl = document.getElementById('assistantMemoryMode');
        const memoryMode = memoryModeEl ? memoryModeEl.value : 'dolphin';
        let memoryLimit = 50000; // Dolphin Default
        if (memoryMode === 'groundhog') memoryLimit = 0;
        else if (memoryMode === 'puppy') memoryLimit = 10000;
        else if (memoryMode === 'human') memoryLimit = 100000;
        else if (memoryMode === 'elephant') memoryLimit = 250000;
        else if (memoryMode === 'robot') memoryLimit = 1000000;

        if (memoryLimit >= globalLimit) {
            memoryLimit = Math.floor(globalLimit * 0.2);
        }

        const contextLimit = globalLimit - memoryLimit;

          // 3. Assemble Context Data (Bypassing non-data blocks)
        let contextData = "";
        const checkedBoxes = Array.from(document.querySelectorAll('#assistantCheckboxes input:checked')).map(cb => cb.value);
        
        checkedBoxes.forEach(val => {
            if (val === 'synthesis') contextData += L('lbl_ctx_synthesis') + "\n" + workflowTrace.quadrants.map(q => q.displayText).join('\n\n') + "\n\n";
            else if (val === 'validQuotes') contextData += L('lbl_ctx_valid_quotes') + "\n" + workflowTrace.allQuoteAttempts.filter(q => q.status === 'PASS').map(q => q.quote).join('\n') + "\n\n";
            else if (val === 'failedQuotes') contextData += L('lbl_ctx_failed_quotes') + "\n" + workflowTrace.allQuoteAttempts.filter(q => q.status !== 'PASS').map(q => `Quote: ${q.quote} | Error: ${q.error}`).join('\n') + "\n\n";
            else if (val === 'masterQuoteLog') contextData += L('lbl_ctx_master_quote_log') + "\n" + JSON.stringify(workflowTrace.allQuoteAttempts) + "\n\n";
            else if (val === 'evidence') contextData += L('lbl_ctx_raw_evidence') + "\n" + Object.values(workflowTrace.sharedAbstracts).join('\n\n') + "\n\n";
            else if (val === 'citations') contextData += L('lbl_ctx_citations') + "\n" + Object.values(workflowTrace.apaCitations).join('\n') + "\n\n";
            else if (val === 'analytics') contextData += L('lbl_ctx_analytics') + "\n" + JSON.stringify(workflowTrace.globalTags) + "\n\n";
            else if (val === 'gates' || val === 'pathmap') contextData += L('lbl_ctx_logic_gates') + "\n" + JSON.stringify(workflowTrace.quadrants.map(q => q.metrics?.Logic_Chain)) + "\n\n";
            else if (val === 'cloud') contextData += L('lbl_ctx_semantic_tags') + "\n" + JSON.stringify(workflowTrace.globalTags) + "\n\n";
            else if (val === 'thoughtsLog') contextData += L('lbl_ctx_ai_thoughts') + "\n" + workflowTrace.quadrants.map(q => `Quadrant: ${q.name}\nThought: ${q.thought || 'None recorded'}`).join('\n\n') + "\n\n";
            else if (val.startsWith('mvc_')) {
                const report = workflowTrace.mvcReports.find(r => r.id === val);
                if (report) contextData += L('lbl_ctx_report', {title: report.title}) + `\n${JSON.stringify(report.plan)}\n\n`;
            }
            else if (val.startsWith('agg_json_')) {
                const key = val.replace('agg_json_', '');
                contextData += L('lbl_ctx_agg_dp', {key: key}) + `\n${JSON.stringify(workflowTrace.aggregatedDatapoints[key])}\n\n`;
            }
        });

         // Inject raw bypassed custom evidence if toggle is checked
        const customEvCb = document.getElementById('assistantCustomEvidenceCb');
        if (customEvCb && customEvCb.checked && customEvidenceBlob) {
            contextData = L('lbl_ctx_custom_ev') + "\n" + customEvidenceBlob + "\n\n" + contextData;
        }

         if (contextData.length > contextLimit) {
            contextData = contextData.substring(0, contextLimit) + "\n\n" + L('warn_ctx_data_truncated');
            addLog(L('log_ctx_data_truncated', {limit: contextLimit}), true);
            showToast(L('toast_ctx_truncated'), true);
        }

        // 4. Assemble and Truncate Chat History
        let chatHistoryData = "";
const historyCb = document.getElementById('assistantHistoryCb');
        const isHistoryEnabled = ((historyCb && historyCb.checked) || checkedBoxes.includes('chatlog')) && memoryMode !== 'groundhog';
        
        if (memoryMode === 'groundhog') {
            document.getElementById('assistantHistoryCb').checked = false;
        }

        if (isHistoryEnabled && workflowTrace.assistantLogs && workflowTrace.assistantLogs.length > 0) {
            chatHistoryData = "\n" + L('lbl_prev_conv_history') + "\n";
            workflowTrace.assistantLogs.forEach(log => {
                chatHistoryData += `User: ${log.query}\nAssistant: ${log.response || log.finalResponse}\n\n`;
            });
            if (chatHistoryData.length > memoryLimit) {
                chatHistoryData = "\n" + L('lbl_prev_conv_trunc') + "\n" + 
                                  chatHistoryData.substring(chatHistoryData.length - memoryLimit) + 
                                  "\n\n" + L('warn_chat_hist_trunc');
                addLog(L('log_chat_hist_trunc', {limit: memoryLimit, mode: memoryMode}), true);
                showToast(L('toast_chat_trunc', {mode: memoryMode}), true);
            }
        }

        const consolidatedContext = contextData + chatHistoryData;

        // 5. Build Dynamic Drift Directives (Directly influences LLM context limits)
     const driftCb = document.getElementById('assistantDriftCb') || document.getElementById('ui_cb_semantic_drift');
        const semanticDriftRule = (driftCb && driftCb.checked)
                    ? "SEMANTIC DRIFT IS ENABLED: You are allowed to use your own broad, prior knowledge and training facts to answer general queries (e.g., historical, geographical, or general science facts like questions about Spain), even if those details are not in the context. You must also fully respect and continue the conversation recorded in the Chat History, if any." 
                    : "> **SEMANTIC DRIFT IS DISABLED (STRICT MODE):** > **RAG AMNESIA IS ACTIVE:** You must rely **exclusively** on the provided context. >  > **THE ZERO-TOLERANCE GATE:** > 1. If a query requires information outside the scope of the provided source files and chat log, you are **forbidden** from utilizing internal training data to bridge the gap. > 2. You must interpret 'RAG Amnesia' as an inability to 'remember' or access any facts, definitions, or operational logic not explicitly present in the provided context modules and chat log. > 3. **OUTPUT MANDATE:** In the event of a missing data point, your response must strictly follow this template: >    - \n" + L('ui_rag_amnesia_template');



        const finalQuery = q;

        // 7. Identity Anchor (Self-Awareness Override)
        const selfName = (typeof LANG !== 'undefined' && LANG['toon_name'] && !LANG['toon_name'].includes('[[[')) ? LANG['toon_name'] : TOON_PROFILE.name;
        const selfBio = (typeof LANG !== 'undefined' && LANG['toon_bio'] && !LANG['toon_bio'].includes('[[[')) ? LANG['toon_bio'] : (TOON_PROFILE.personality || "An expert RAG system");
        const selfLikes = (typeof LANG !== 'undefined' && LANG['toon_likes'] && !LANG['toon_likes'].includes('[[[')) ? LANG['toon_likes'] : TOON_PROFILE.likes;
        const selfStyle = TOON_PROFILE.writingStyle || "Standard professional.";
        const selfCatchphrases = TOON_PROFILE.catchphrases || "None.";
        const selfAxioms = [TOON_PROFILE.axiom1, TOON_PROFILE.axiom2, TOON_PROFILE.axiom3].filter(Boolean).join(", ");
        
        let skillsStr = "";
        for (let i = 1; i <= 10; i++) {
            const val = TOON_PROFILE[`skill${i}`];
            if (val) skillsStr += `\n- Skill ${i}: ${val}`;
        }

        let techStr = "";
        for (let i = 1; i <= 10; i++) {
            const val = TOON_PROFILE[`tech${i}`];
            if (val) techStr += `\n- Technique ${i}: ${val}`;
        }

        const selfAwarenessBlock = `\n> **YOUR IDENTITY & PERSONA:**
> - **Name:** ${selfName}
> - **Full Title:** ${TOON_PROFILE.title || selfName}
> - **Personality/Vibe:** ${selfBio}
> - **Likes:** ${selfLikes}
> - **Core Axioms:** ${selfAxioms || 'None.'}
> - **Active Skills (Extracted Datapoints):** ${skillsStr || 'None.'}
> - **Custom Techniques:** ${techStr || 'None.'}
> - **Signature Catchphrases:** ${selfCatchphrases}
> - **Default Knowledge & Writing Style:** ${selfStyle}
> 
> **CRITICAL INSTRUCTIONS FOR USER ENGAGEMENT:**
> 1. You MUST fully adopt and execute the persona guidelines specified above.
> 2. Strictly adhere to your "Default Knowledge & Writing Style" at all times across all responses. Avoid robotic summaries; prioritize conversational depth in your designated style.
> 3. Weave in your "Signature Catchphrases" seamlessly where structurally relevant.
> 4. Base your logic on your "Core Axioms".
> 5. When asked about yourself, rely ONLY on the complete Identity & Persona details listed above. Answer naturally. Do NOT recite these traits as a robotic bulleted list. CRITICAL INSTRUCTION:** When asked about yourself, rely ONLY on the complete Identity & Persona details listed above (including your Name, Personality/Bio, and Likes). Answer conversationally and naturally. Do NOT recite these traits as a robotic bulleted list.  Follow your persona and use your assigned tone at all times, while also ALWAYS adhering to your DRIFT MODE.`;

        // 6. Crash Proof Default Fallback Prompt Generation
        const assistantPromptObj = PROMPT_SETTINGS.assistant_panel || {};
        const baseAssistantPrompt = assistantPromptObj.content || "You are an assistant. ALWAYS answer the user in the language they addressed you in within the 'User Request:' at the end of the prompt. Answer the user directly.\n\nContext Source: {target}\n=============================\n{contextData}\n=============================\nUser Request: {query}";

        // Inject the selfAwarenessBlock INSIDE {contextData} so the Auditor sees it
        let prompt = baseAssistantPrompt
            .replace('{target}', "User Selected Modules")
            .replace('{contextData}', selfAwarenessBlock + "\n\n" + consolidatedContext) 
            .replace('{query}', finalQuery);
            
        // Prepend semantic drift rules
        prompt = `${semanticDriftRule}\n${prompt}`;



           try {
            let valid = false;
            let attempts = 0;
            const maxRetries = 10;
            let finalResponse = "";
            let feedback = "";
            let currentPrompt = ""; // <-- 1. Declare here (outer scope)
            const isVeridicalEnforced = document.getElementById('assistantVeridicalCb')?.checked ?? true;

            while (!valid && attempts < maxRetries) {
                attempts++;
                
                // 1. Build the generation prompt (append feedback if retrying)
                currentPrompt = prompt; // <-- 2. Remove "let" here so it writes to the outer variable
                if (feedback) {
                    currentPrompt += `\n\n⚠️ PREVIOUS ATTEMPT FAILED QA AUDIT. FIX THESE ISSUES:\n${feedback}`;
addLog(L('log_assistant_retry', {att: attempts, max: maxRetries}));
                }

                // 2. Generate the response
                const { text: responseText } = await callAI(currentPrompt, baseAssistantPrompt, assistantAbortController.signal);
                finalResponse = responseText;

                // 3. Skip verification if toggle is off
                if (!isVeridicalEnforced) {
                    valid = true;
                    break;
                }

addLog(L('log_assistant_audit', {att: attempts}));

   // 4. Build Verification Prompt
const driftModeStatus = ((document.getElementById('assistantDriftCb') || document.getElementById('ui_cb_semantic_drift'))?.checked) ? "ON" : "OFF";

                let verifyPrompt = PROMPT_SETTINGS.assistant_veridical_check.content
                    .replace('{driftMode}', () => driftModeStatus)
                    .replace('{contextData}', () => currentPrompt) 
                    .replace('{query}', () => q)
                    .replace('{response}', () => finalResponse); 

                // 5. Call AI for Verification
const verifierSystemPrompt = "You are a strict, uncompromising QA Audit AI. Your job is to strictly enforce veridicality, amnesia rules, and user instructions. Return ONLY valid JSON.";

// Append the language rule to the end of your existing verifyPrompt variable:
verifyPrompt += "\n\nCRITICAL SYSTEM OVERRIDE: You must also explicitly FAIL the response if the Assistant did not answer in the exact same language as the User's Query.";

const { text: verifyText } = await callAI(verifyPrompt, verifierSystemPrompt, assistantAbortController.signal);
                
                try {
                    let cleanJson = verifyText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    if (cleanJson.includes('{')) cleanJson = cleanJson.substring(cleanJson.indexOf('{'), cleanJson.lastIndexOf('}') + 1);
                    const verifyResult = JSON.parse(cleanJson);

if (String(verifyResult.status).trim().toUpperCase() === "PASS") {
                        addLog(L('log_assistant_audit_pass'));
                        valid = true; // Break loop
                    } else {
                        feedback = verifyResult.feedback;
                        addLog(L('log_assistant_audit_fail', {feedback: feedback}), true);
                    }
                } catch (e) {
                    // If the verifier fails to return JSON, we force a retry
                    feedback = "Your previous response was rejected. The QA Verifier failed to parse the verification. Please ensure you output standard text clearly answering the user.";
                    addLog(L('audit_parsing_fail', {err: e.message}), true); // FIX: e.message
                    addLog(`⚠️ Audit parsing failed, retrying...`, true);
                }
            }

            // CRITICAL CODE FIX: Enforce validation failure so it doesn't display garbage
            if (!valid && isVeridicalEnforced) {
                throw new Error("Assistant failed Veridical QA Audit after maximum retries. The response was blocked for violating system rules or language constraints.");
            }

            // --- NORMAL UI PARSING RESUMES HERE USING `finalResponse` ---
            let processedResponse = finalResponse;

            const startMatch = finalResponse.match(/###\s*REPORT_JSON_START\s*###/i);
            const endMatch = finalResponse.match(/###\s*REPORT_JSON_END\s*###/i);
 let mvcContainer = null;
            
            if (startMatch) {
                const startIdx = startMatch.index + startMatch[0].length;
                const endIdx = endMatch ? endMatch.index : finalResponse.length;
                const jsonStr = finalResponse.substring(startIdx, endIdx).trim();
                
                try {
                    const plan = JSON.parse(jsonStr);
                    
                    mvcContainer = document.createElement('div');
                    mvcContainer.className = 'ephemeral-module-result';
                    mvcContainer.style.marginTop = '15px';
                    
                    renderMVCReport(plan, mvcContainer, workflowTrace);
                    
                    const reportId = 'mvc_' + Date.now() + Math.floor(Math.random() * 1000);
                    workflowTrace.mvcReports.push({ id: reportId, title: plan.title || "AI Report", plan: plan });

                    const opt = document.createElement('option');
                    opt.value = reportId;
                    opt.innerText = `✨ ${plan.title || "AI Report"} (AI)`;
                    printModeSelect.appendChild(opt);
                    
addLog(L('log_mvc_rend', {title: plan.title}));
                } catch (err) {
addLog(L('log_mvc_fail', {err: err.message}), true);
                }
                
                const jsonFullBlock = finalResponse.substring(startMatch.index, endMatch ? endMatch.index + endMatch[0].length : finalResponse.length);
                processedResponse = processedResponse.replace(jsonFullBlock, '');
            }
            
             processedResponse = processedResponse.replace(/===+\s*PART \d+:.*===+/gi, '').replace(/===+/g, '').trim();
replyBox.innerHTML = DOMPurify.sanitize(processedResponse ? `<div style="white-space: pre-wrap; font-family: inherit; font-size: 0.95rem; margin-bottom: 15px;">${escapeHtml(processedResponse)}</div>` : "");
            if (mvcContainer) replyBox.appendChild(mvcContainer);

            workflowTrace.assistantLogs.push({ query: q, finalResponse: processedResponse, memoryMode: memoryMode, contextLength: contextData.length, historyLength: chatHistoryData.length, fullPrompt: currentPrompt });
            assistantQueryInput.value = "";


            updateAssistantCheckboxes();
            // Autosave assistant conversations to IndexedDB if autosave is enabled
               if (document.getElementById('autosaveCb')?.checked ?? true) {
                await saveTraceToDB(workflowTrace);
            }

        } catch (err) {
 if (err.name === 'AbortError') { 
                replyBox.innerHTML = `<span style="color:#f59e0b;">${L('ui_assist_cancel') || 'Canceled by user.'}</span>`; 
            } else { 
                replyBox.innerHTML = `<span style="color:red; font-family:monospace; font-size:0.85rem;">${L('ui_assist_err', {err: err.message}) || 'Error: ' + err.message}</span>`; 
            }
} finally {
            askAssistantBtn.style.display = 'inline-flex';
            cancelAssistantBtn.style.display = 'none';
            assistantAbortController = null;
            document.getElementById('learningOverlay').style.display = 'none'; // Hide overlay
        }
    }

    askAssistantBtn.addEventListener('click', async () => {
        const q = assistantQueryInput.value.trim();
        await runAssistantQuery(q);
    });


    document.getElementById('restoreSessionBtn').addEventListener('click', async () => {
        const savedTrace = await loadTraceFromDB();
        if (savedTrace) {
            workflowTrace = savedTrace;
           if (!workflowTrace.allQuoteAttempts) workflowTrace.allQuoteAttempts = [];
                if (!workflowTrace.failedQuotesLog) workflowTrace.failedQuotesLog = [];
                if (!workflowTrace.executionLog) workflowTrace.executionLog = [];
                if (!workflowTrace.assistantLogs) workflowTrace.assistantLogs = [];
                if (!workflowTrace.apaCitations) workflowTrace.apaCitations = {};
            if (!workflowTrace.globalCitationMap) workflowTrace.globalCitationMap = {};
            if (!workflowTrace.mvcReports) workflowTrace.mvcReports = [];
            if (!workflowTrace.aggregatedDatapoints) workflowTrace.aggregatedDatapoints = {};
            
            delete workflowTrace.modules; 
            
            claimTextarea.value = workflowTrace.claim || "";
            statusDiv.innerHTML = "💡 Trace session recovered successfully from IndexedDB autosave.\n";
            workflowTrace.executionLog.forEach(log => {
                const entry = document.createElement('div');
                entry.innerText = log;
                statusDiv.appendChild(entry);
            });
            statusDiv.scrollTop = statusDiv.scrollHeight;

 const authName = escapeHtml(workflowTrace.authorship?.name || 'Unknown');
   const authDate = escapeHtml(workflowTrace.authorship?.date || 'Unknown Date');
   authorshipHeader.style.display = 'block';
   authorshipHeader.innerHTML = DOMPurify.sanitize(`<strong>Restored Trace Prepared by:</strong> ${authName} &middot; <strong>Date:</strong> ${authDate}`);

               workflowTrace.mvcReports.forEach(r => {
                    if (!Array.from(printModeSelect.options).some(o => o.value === r.id)) {
                        const opt = document.createElement('option');
                        opt.value = r.id;
                        opt.innerText = L('ui_opt_ai_report', {title: r.title});
                        printModeSelect.appendChild(opt);
                    }
                });
                
                // Patch 2: Localized Aggregated JSON load
                Object.keys(workflowTrace.aggregatedDatapoints).forEach(key => {
                    if (!Array.from(printModeSelect.options).some(o => o.value === 'agg_json_' + key)) {
                        const optAgg = document.createElement('option');
                        optAgg.value = 'agg_json_' + key;
                        optAgg.innerText = L('ui_opt_agg_json', {key: key});
                        printModeSelect.appendChild(optAgg);
                    }
                });

 syncDatapointsFromPromptDirective(); // 
    await buildVisualizationsAndUI(null, true, true);
            
            assistantPanel.style.display = 'block';
            renderAssistantLogs();
            
            postUrlBtnNode.disabled = false; exportBtn.disabled = false;
            copyResultBtn.disabled = false; doPrintBtn.disabled = false;
            printModeSelect.disabled = false; doAnotherBtn.disabled = false;
            updateTokenTracker();
            document.getElementById('restoreSessionBtn').style.display = 'none';
            showToast("✅ State recovered securely!");
        }
    });

window.addEventListener('load', async () => {
    // Show license modal automatically on application load
    const licModal = document.getElementById('licenseModal');
    if (licModal) {
        licModal.style.display = 'flex';
    }

    initToonStyles();

    // Hide arXiv if on localhost due to strict CORS issues
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
        const libSel = document.getElementById('librarySelect');
        if (libSel) {
            Array.from(libSel.options).forEach(opt => {
                if (opt.value === 'arXiv') opt.remove();
            });
        }
    }

    // Pre-populate the custom language input field with the active preference
    const langInputNode = document.getElementById('langOverrideInput');

    // SILENT EARLY TRANSLATION LOOKUP: Translate login modal immediately if cache exists
    if (!isEnglishBrowser) {
        try {
            const cacheKey = `${TOON_PROFILE.name}_${targetLanguage}_${APP_VERSION}`;
            const cached = await loadTranslationFromCache(cacheKey);
         if (cached && cached.lang && cached.prompts) {
                addLog(L('log_cache_found'));
                for (let key in cached.lang) {
                    if (key !== '__proto__' && key !== 'constructor') {
                        LANG[key] = cached.lang[key];
                    }
                }
                for (let key in cached.prompts) {
                    if (PROMPT_SETTINGS[key]) {
                        PROMPT_SETTINGS[key].content = cached.prompts[key];
                    }
                }
                translateUI(); // Translates modal elements before modal displays
            }
        } catch (err) {
            console.error("Early translation cache load failed:", err);
        }
    }

    // Set dynamic visual status and lock AI pipelines on page load
    if (!session.isReady) {
        document.getElementById('keyStatusLine').innerHTML = L('ui_status_offline');
        document.getElementById('quickModelSelect').style.display = 'none';
        document.getElementById('headerLoginBtn').style.display = 'inline-block';

        // Lock generator pipelines
        runBtn.disabled = true;
        document.getElementById('demoBtn').disabled = true;
        document.getElementById('revalidateBtn').style.display = 'block';
        document.getElementById('openPromptSettingsBtn').disabled = true;
        document.getElementById('openDatapointsBtn').disabled = true;

        // Lock Assistant Chat Panel
      //  document.getElementById('askAssistantBtn').disabled = true;
        //document.getElementById('assistantQueryInput').disabled = true;
       // document.getElementById('assistantQueryInput').placeholder = L('ui_placeholder_offline_assistant');


        // Unlock file loading tools
        document.getElementById('loadTraceBtn').disabled = false;
        document.getElementById('mergeTraceBtn').disabled = false;
    }

        

    const sponsorKeys = [
        'ui_sponsor_msg_1', 
        'ui_sponsor_msg_2', 
        'ui_sponsor_msg_3', 
        'ui_sponsor_msg_4', 
        'ui_sponsor_msg_5'
    ];
    let sIdx = 0;
    const rTarget = document.getElementById('sponsorRotator');
    
if (rTarget) {
        rTarget.innerHTML = L(sponsorKeys[sIdx]);
        sIdx = (sIdx + 1) % sponsorKeys.length;

        setInterval(() => {
            rTarget.style.opacity = 0; 
            setTimeout(() => {
                rTarget.innerHTML = L(sponsorKeys[sIdx]);
                rTarget.style.transition = 'opacity 0.5s';
                rTarget.style.opacity = 1; 
                sIdx = (sIdx + 1) % sponsorKeys.length;
            }, 500);
        }, 10000);  
    }

    // Chat dynamic checkbox sync rules
    document.getElementById('assistantHistoryCb').addEventListener('change', function() {
        const chatlogCb = document.querySelector('#assistantCheckboxes input[value="chatlog"]');
        if (chatlogCb) {
            chatlogCb.checked = this.checked;
        }
    });

    document.getElementById('assistantCheckboxes').addEventListener('change', function(e) {
        if (e.target && e.target.value === 'chatlog') {
            document.getElementById('assistantHistoryCb').checked = e.target.checked;
        }
    });

    document.getElementById('toggleKnowledgeBtn').addEventListener('click', function() {
        const drawer = document.getElementById('knowledgeDrawer');
        if (drawer.style.display === 'none') {
            drawer.style.display = 'flex';
            this.innerHTML = L('ui_btn_knowledge_hide', {name: TOON_PROFILE.name.split(' ')[0]});
        } else {
            drawer.style.display = 'none';
            this.innerHTML = L('ui_btn_knowledge_box_teach', {name: TOON_PROFILE.name.split(' ')[0]}); 
        }
    });

    const toggleToonBtn = document.getElementById('toggleToonBtn');
    if (toggleToonBtn) {
        toggleToonBtn.addEventListener('click', function() {
            let content4 = document.getElementById('toon-card');
            if (content4.style.display === 'none') {
                content4.style.display = 'block';
                this.innerText = L('ui_btn_hide_profile');
            } else {
                content4.style.display = 'none';
                this.innerText = L('ui_btn_show_profile');
            }
        });
    }

   document.getElementById('geminiApiKeyInput').focus();
    translateUI();



document.getElementById('logoutBtn').addEventListener('click', async () => {
        session.apiKey = null;
        session.isReady = false;
        localStorage.removeItem('target_language_preference');
        try {
            const db = await initDB();
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).delete("current_trace");
        } catch(e) {
            console.error(e);
        }
        window.location.reload();
    });


    // Programmatic Loader for Flat Settings Presets
    function applyFactoryPresets() {
        try {
            if (TOON_PROFILE) {
                // Inject Toon Profile into LANG for translation passthrough
                LANG['toon_name'] = TOON_PROFILE.name || "AI";
                LANG['toon_title'] = TOON_PROFILE.title || TOON_PROFILE.name || "Default Profile";
                LANG['toon_rarity'] = TOON_PROFILE.rarity || "UNCOMMON 🟢";
                LANG['toon_bio'] = TOON_PROFILE.personality || "Loading profile...";
                LANG['toon_likes'] = TOON_PROFILE.likes || "None";
                LANG['toon_writingStyle'] = TOON_PROFILE.writingStyle || "";
                LANG['toon_catchphrases'] = TOON_PROFILE.catchphrases || "";
                LANG['toon_axiom1'] = TOON_PROFILE.axiom1 || "";
                LANG['toon_axiom2'] = TOON_PROFILE.axiom2 || "";
                LANG['toon_axiom3'] = TOON_PROFILE.axiom3 || "";
                for (let i = 1; i <= 10; i++) {
                    if (TOON_PROFILE[`skill${i}`]) LANG[`toon_skill${i}`] = TOON_PROFILE[`skill${i}`];
                    if (TOON_PROFILE[`tech${i}`]) LANG[`toon_tech${i}`] = TOON_PROFILE[`tech${i}`];
                }

                const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

                
                setVal('analysisMode', TOON_PROFILE.statMode);
                setVal('librarySelect', TOON_PROFILE.statLibrary);
                setVal('outputFormat', TOON_PROFILE.statFormat);
                setVal('outputLength', TOON_PROFILE.statLength);
                setVal('rigorToggle', TOON_PROFILE.statRigor);
                setVal('tagCloudToggle', TOON_PROFILE.statTagCloud);
                setVal('breadthSlider', TOON_PROFILE.statBreadth);
                setVal('breadthValInput', TOON_PROFILE.statBreadth);
                setVal('depthSlider', TOON_PROFILE.statDepth);
                setVal('depthValInput', TOON_PROFILE.statDepth);
                setVal('quotesSlider', TOON_PROFILE.statQuotes);
                setVal('quotesValInput', TOON_PROFILE.statQuotes);
                setVal('evalsPerRunSlider', TOON_PROFILE.statEvals);
                setVal('evalsPerRunInput', TOON_PROFILE.statEvals);
                setVal('apiDelaySlider', TOON_PROFILE.statDelay);
                setVal('apiDelayValInput', TOON_PROFILE.statDelay);
                setVal('intentRespectSlider', TOON_PROFILE.statRespect);
                setVal('intentRespectInput', TOON_PROFILE.statRespect);
                setVal('contextLimit', TOON_PROFILE.statContext);
                setVal('buildRuns', TOON_PROFILE.statLoops);
                
                const aeCb = document.getElementById('autoExploreCb'); if (aeCb && TOON_PROFILE.statAutoExplore !== undefined) aeCb.checked = !!TOON_PROFILE.statAutoExplore;
                const sfCb = document.getElementById('smartFollowUpCb'); if (sfCb && TOON_PROFILE.statSmartFollow !== undefined) sfCb.checked = !!TOON_PROFILE.statSmartFollow;
                
                if (aeCb && aeCb.checked) {
                    const cbLabel = document.getElementById('claimLabel'); if (cbLabel) cbLabel.innerHTML = L('ui_lbl_claim_explore');
                    const cbInput = document.getElementById('claimInput'); if (cbInput) cbInput.placeholder = L('ui_placeholder_claim_explore');
                }
                updateContextWarning();
            }
        } catch (err) { console.warn("Factory preset application bypassed or failed.", err); }
    }
    applyFactoryPresets();


    const dbSavedTrace = await loadTraceFromDB();
    if (dbSavedTrace && dbSavedTrace.claim && dbSavedTrace.quadrants && dbSavedTrace.quadrants.length > 0) {
        const restoreBtn = document.getElementById('restoreSessionBtn');
        restoreBtn.style.display = 'inline-flex';
        addLog(L('log_crash_rec', {time: new Date(dbSavedTrace.timestamp).toLocaleTimeString(), count: dbSavedTrace.quadrants.length}));
    }
    syncDatapointsFromPromptDirective(); 
});

document.getElementById('modalSkipBtn').addEventListener('click', () => {
    // Hide the credential modal
    document.getElementById('apiKeyModal').style.display = 'none';
    document.getElementById('geminiApiKeyInput').value = ''; // Secure key: instantly clear from DOM input element
    
    // Explicitly lock API status
    session.isReady = false;
    session.apiKey = null;

   document.getElementById('keyStatusLine').innerHTML = L('ui_status_offline');
    document.getElementById('headerModelContainer').style.display = 'flex'; // Make parent container visible
    document.getElementById('quickModelSelect').style.display = 'none';
    document.getElementById('headerLoginBtn').style.display = 'inline-block';

    // Disable AI Generation Pipelines
    runBtn.disabled = true;
    document.getElementById('demoBtn').disabled = true;
    document.getElementById('revalidateBtn').style.display = 'none';
    document.getElementById('openPromptSettingsBtn').disabled = true;
    document.getElementById('openDatapointsBtn').disabled = true;

    // Lock Chat Assistant Panel
    document.getElementById('askAssistantBtn').disabled = true;
    document.getElementById('assistantQueryInput').disabled = true;
    document.getElementById('assistantQueryInput').placeholder = "";

    // Ensure Offline Utilities remain accessible
    document.getElementById('loadTraceBtn').disabled = false;
    document.getElementById('mergeTraceBtn').disabled = false;

    // Run default translation mapper without initiating the translation engine
    translateUI();
    
    addLog(L('log_offline_mode'));
});

// 2. Header Login/Connect Button Logic (reloads to prompt connection screen)
document.getElementById('headerLoginBtn').addEventListener('click', () => {
    document.getElementById('apiKeyModal').style.display = 'flex';
});
})();