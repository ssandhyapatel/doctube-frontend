 import { uid } from "../utils/common.js";

export function mkDisease(name, slug, detail) {
  function freshBase() {
    return {
      overview:
        "Detailed clinical profile for this entity is being authored. This entry exists in the taxonomy and is ready to receive structured content.",
      epidemiology: "—",
      features: "—",
      pathology: "—",
      genetics: "—",
      pearls: "Content pending.",
      keySigns: [],
      imaging: {},
      differentials: [],
      media: [],
    };
  }
  return {
    name,
    slug,
    detail: detail
      ? { ...freshBase(), ...detail, media: detail.media || [] }
      : freshBase(),
  };
}

// TAXONOMY DATA — exact tree from the brief, fully wired with slugs
// ---------------------------------------------------------------------------

const TAXONOMY = [
  {
    name: "Neuroradiology",
    slug: "neuroradiology",
    icon: "🧠",
    categories: [
      {
        name: "Brain",
        slug: "brain",
        subcategories: [
          { name: "Congenital & Developmental Disorders", slug: "congenital-developmental", diseases: [
            mkDisease("Chiari Malformation", "chiari-malformation"),
            mkDisease("Dandy-Walker Malformation", "dandy-walker-malformation"),
            mkDisease("Lissencephaly", "lissencephaly"),
            mkDisease("Gray Matter Heterotopia", "gray-matter-heterotopia"),
          ]},
          { name: "Trauma", slug: "trauma", diseases: [
            mkDisease("Diffuse Axonal Injury", "diffuse-axonal-injury"),
            mkDisease("Epidural Hematoma", "epidural-hematoma"),
            mkDisease("Subdural Hematoma", "subdural-hematoma"),
            mkDisease("Traumatic Subarachnoid Hemorrhage", "traumatic-subarachnoid-hemorrhage"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Pyogenic Cerebral Abscess", "pyogenic-cerebral-abscess", {
              overview: "A focal suppurative infection of the brain parenchyma, typically evolving through cerebritis to a mature, encapsulated abscess.",
              epidemiology: "Risk factors include contiguous spread (sinusitis, otomastoiditis), hematogenous spread (endocarditis, IV drug use), and immunosuppression.",
              features: "Classic triad of fever, headache, and focal neurologic deficit is present in a minority; subacute presentation is common.",
              pathology: "Capsule composed of collagen and reactive astrocytes; thinner on the ventricular side, predisposing to ventricular rupture.",
              genetics: "Not applicable — infectious, not neoplastic.",
              pearls: "Smooth, thin, uniform ring enhancement with restricted diffusion in the central cavity is the key discriminator from glioblastoma or metastasis.",
              keySigns: ["Smooth thin-walled ring enhancement", "Restricted diffusion centrally", "Dual rim sign on T2"],
              imaging: {
                T1: "Hypointense center, isointense capsule",
                T2_FLAIR: "Hyperintense center with surrounding edema; dual rim sign (hypointense outer rim)",
                T1_C: "Smooth, thin, complete ring enhancement",
                DWI_ADC: "Marked restricted diffusion in the cavity (low ADC) — unlike necrotic tumor",
                Perfusion: "Low rCBV at the rim, unlike glioblastoma",
              },
              differentials: ["ring-enhancing-brain-lesions"],
            }),
            mkDisease("Tubercular Meningitis", "tubercular-meningitis"),
            mkDisease("Tuberculoma", "tuberculoma"),
            mkDisease("Cryptococcosis", "cryptococcosis"),
            mkDisease("Herpes Encephalitis", "herpes-encephalitis"),
          ]},
          { name: "Vascular Disorders", slug: "vascular-disorders", diseases: [
            mkDisease("Acute Ischemic Stroke", "acute-ischemic-stroke", {
              overview: "Infarction of brain parenchyma due to vascular occlusion, most commonly within the MCA territory. Time-critical diagnosis governing thrombectomy eligibility.",
              epidemiology: "Leading cause of long-term disability worldwide; incidence rises sharply after age 55.",
              features: "Sudden focal neurologic deficit — hemiparesis, aphasia, neglect — depending on the vascular territory involved.",
              pathology: "Cytotoxic edema progresses to liquefactive necrosis over days; hemorrhagic transformation risk increases with infarct size and reperfusion.",
              genetics: "Not primarily a genetic disease; some inherited thrombophilias and CADASIL are relevant in younger patients.",
              pearls: "Loss of gray-white differentiation and sulcal effacement on NCCT are the earliest signs, often subtle in the first few hours — this is exactly what the ASPECTS score quantifies.",
              keySigns: ["Loss of insular ribbon", "Hyperdense MCA sign", "Sulcal effacement"],
              imaging: {
                T1: "Often unremarkable acutely",
                T2_FLAIR: "Hyperintense after ~6 hours; FLAIR-DWI mismatch suggests <4.5h window",
                T1_C: "Usually no enhancement acutely; gyriform enhancement subacutely",
                DWI_ADC: "Restricted diffusion within minutes — most sensitive early sign",
                Perfusion: "Core-penumbra mismatch on CTP guides thrombectomy decisions",
              },
              differentials: [],
            }),
            mkDisease("Arteriovenous Malformation", "arteriovenous-malformation"),
            mkDisease("Cavernoma", "cavernoma"),
            mkDisease("Intracranial Aneurysm", "intracranial-aneurysm"),
          ]},
          { name: "Demyelinating & White Matter Disorders", slug: "demyelinating-white-matter", diseases: [
            mkDisease("Multiple Sclerosis", "multiple-sclerosis", {
              overview: "An immune-mediated demyelinating disease of the CNS characterized by lesions disseminated in time and space.",
              epidemiology: "Female predominance (3:1), onset typically 20-40 years, strong latitude gradient in prevalence.",
              features: "Relapsing-remitting course in most patients; optic neuritis, sensory disturbance, and limb weakness are common presenting features.",
              pathology: "Perivenular demyelinating plaques with relative axonal preservation in early lesions.",
              genetics: "Polygenic risk with strongest association at HLA-DRB1*15:01.",
              pearls: "Dawson's fingers — periventricular lesions oriented perpendicular to the ventricular surface — reflect perivenular spread and are a classic discriminator from small vessel disease.",
              keySigns: ["Dawson's fingers", "Open-ring enhancement", "Central vein sign"],
              imaging: {
                T1: "Hypointense 'black holes' in chronic lesions",
                T2_FLAIR: "Ovoid periventricular hyperintensities perpendicular to ventricles",
                T1_C: "Open-ring enhancement in active demyelinating lesions",
                DWI_ADC: "Usually unrestricted, unlike acute infarcts",
                Perfusion: "Not routinely used for diagnosis",
              },
              differentials: ["ring-enhancing-brain-lesions"],
            }),
            mkDisease("Tumefactive Demyelination", "tumefactive-demyelination"),
            mkDisease("ADEM", "adem"),
          ]},
          { name: "Neurodegenerative Disorders", slug: "neurodegenerative", diseases: [
            mkDisease("Alzheimer Disease", "alzheimer-disease"),
            mkDisease("Frontotemporal Dementia", "frontotemporal-dementia"),
            mkDisease("Parkinson Disease", "parkinson-disease"),
            mkDisease("Progressive Supranuclear Palsy", "progressive-supranuclear-palsy"),
          ]},
          { name: "Metabolic & Toxic Disorders", slug: "metabolic-toxic", diseases: [
            mkDisease("Hypoxic-Ischemic Encephalopathy", "hypoxic-ischemic-encephalopathy"),
            mkDisease("Wernicke Encephalopathy", "wernicke-encephalopathy"),
            mkDisease("Osmotic Demyelination Syndrome", "osmotic-demyelination-syndrome"),
            mkDisease("Carbon Monoxide Toxicity", "carbon-monoxide-toxicity"),
          ]},
          { name: "Epilepsy", slug: "epilepsy", diseases: [
            mkDisease("Mesial Temporal Sclerosis", "mesial-temporal-sclerosis"),
            mkDisease("Focal Cortical Dysplasia", "focal-cortical-dysplasia"),
            mkDisease("Hypothalamic Hamartoma", "hypothalamic-hamartoma"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Glioblastoma", "glioblastoma", {
              overview: "A WHO CNS Grade 4 diffuse astrocytic glioma and the most common primary malignant brain tumor in adults. Characteristically infiltrative, highly vascular, and necrosis-prone.",
              epidemiology: "Peak incidence in the 6th-7th decades. Slight male predominance (1.6:1). Accounts for ~50% of all gliomas.",
              features: "Progressive focal neurological deficit, headache (often worse in the morning), seizures, and personality change evolving over weeks.",
              pathology: "Pseudopalisading necrosis, microvascular proliferation, and high mitotic index on histology. Often centered in white matter with cortical and callosal extension.",
              genetics: "IDH-wildtype in the majority. EGFR amplification, TERT promoter mutation, and chromosome 7 gain/10 loss are common molecular markers used for classification.",
              pearls: "Classic 'butterfly glioma' pattern when it crosses the corpus callosum bilaterally. Look for thick, irregular ring enhancement with central necrosis and extensive vasogenic edema — but remember up to 10% can be non-enhancing.",
              keySigns: ["Butterfly lesion (corpus callosum crossing)", "Thick irregular ring enhancement", "Central necrosis"],
              imaging: {
                T1: "Iso- to hypointense mass, often with hemorrhagic foci",
                T2_FLAIR: "Hyperintense with extensive surrounding vasogenic edema, finger-like white matter projections",
                T1_C: "Thick, irregular peripheral enhancement with central non-enhancing necrosis",
                DWI_ADC: "Variable; solid components may show reduced diffusion",
                Perfusion: "Markedly elevated rCBV at the enhancing margin — helps distinguish from abscess/demyelination",
              },
              differentials: ["ring-enhancing-brain-lesions"],
            }),
            mkDisease("Astrocytoma", "astrocytoma"),
            mkDisease("Oligodendroglioma", "oligodendroglioma"),
            mkDisease("Primary CNS Lymphoma", "primary-cns-lymphoma"),
            mkDisease("Metastasis", "metastasis"),
            mkDisease("Meningioma", "meningioma", {
              overview: "The most common primary extra-axial intracranial neoplasm, arising from arachnoid cap cells. Overwhelmingly WHO Grade 1 (benign).",
              epidemiology: "Female predominance (2-3:1), peak in 5th-6th decades. Associated with NF2 mutations and prior radiation exposure.",
              features: "Often incidental. Symptomatic lesions cause focal deficits, seizures, or headache depending on location (parasagittal, sphenoid wing, convexity).",
              pathology: "Whorled spindle cell architecture with psammoma bodies on histology. Broad dural base.",
              genetics: "NF2 (chromosome 22q) inactivation in a large subset, particularly multiple or atypical meningiomas.",
              pearls: "Dural tail sign is highly suggestive but not pathognomonic. CSF cleft sign confirms the extra-axial location. Hyperostosis of adjacent calvarium is a classic clue on CT.",
              keySigns: ["Dural tail sign", "CSF cleft sign", "Calvarial hyperostosis"],
              imaging: {
                T1: "Isointense to gray matter",
                T2_FLAIR: "Variable, often isointense; surrounding edema variable",
                T1_C: "Intense, homogeneous enhancement with dural tail",
                DWI_ADC: "Usually unremarkable unless atypical/malignant",
                Perfusion: "Elevated CBV (external carotid supply pattern)",
              },
              differentials: ["dural-based-masses"],
            }),
            mkDisease("Schwannoma", "schwannoma"),
            mkDisease("Solitary Fibrous Tumor", "solitary-fibrous-tumor"),
          ]},
          { name: "Hydrocephalus & CSF Disorders", slug: "hydrocephalus-csf", diseases: [
            mkDisease("Normal Pressure Hydrocephalus", "normal-pressure-hydrocephalus"),
            mkDisease("Obstructive Hydrocephalus", "obstructive-hydrocephalus"),
          ]},
        ],
      },
      {
        name: "Spine",
        slug: "spine",
        subcategories: [
          { name: "Congenital Disorders", slug: "congenital-disorders", diseases: [
            mkDisease("Spina Bifida", "spina-bifida"),
            mkDisease("Tethered Cord Syndrome", "tethered-cord-syndrome"),
            mkDisease("Diastematomyelia", "diastematomyelia"),
          ]},
          { name: "Degenerative Disorders", slug: "degenerative-disorders", diseases: [
            mkDisease("Lumbar Disc Herniation", "lumbar-disc-herniation"),
            mkDisease("Spinal Canal Stenosis", "spinal-canal-stenosis"),
            mkDisease("Spondylolisthesis", "spondylolisthesis"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Pyogenic Spondylodiscitis", "pyogenic-spondylodiscitis"),
            mkDisease("Spinal Tuberculosis (Pott Disease)", "spinal-tuberculosis-pott-disease"),
            mkDisease("Spinal Epidural Abscess", "spinal-epidural-abscess"),
          ]},
          { name: "Trauma", slug: "trauma", diseases: [
            mkDisease("Burst Fracture", "burst-fracture-spine"),
            mkDisease("Chance Fracture", "chance-fracture"),
            mkDisease("Traumatic Spinal Cord Contusion", "traumatic-spinal-cord-contusion"),
          ]},
          { name: "Demyelinating Disorders", slug: "demyelinating-disorders", diseases: [
            mkDisease("Spinal Multiple Sclerosis Plaque", "spinal-multiple-sclerosis-plaque"),
            mkDisease("Neuromyelitis Optica Spectrum Disorder", "neuromyelitis-optica-spectrum-disorder"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Spinal Meningioma", "spinal-meningioma"),
            mkDisease("Spinal Schwannoma", "spinal-schwannoma"),
            mkDisease("Ependymoma", "ependymoma"),
            mkDisease("Vertebral Metastasis", "vertebral-metastasis"),
          ]},
          { name: "Vascular Disorders", slug: "vascular-disorders", diseases: [
            mkDisease("Spinal Dural Arteriovenous Fistula", "spinal-dural-arteriovenous-fistula"),
            mkDisease("Spinal Cord Infarction", "spinal-cord-infarction"),
          ]},
        ],
      },
      {
        name: "Peripheral Nerves & Plexus",
        slug: "peripheral-nerves-plexus",
        subcategories: [
          { name: "Brachial Plexus", slug: "brachial-plexus", diseases: [
            mkDisease("Brachial Plexus Birth Palsy", "brachial-plexus-birth-palsy"),
            mkDisease("Brachial Plexus Traction Injury", "brachial-plexus-traction-injury"),
          ]},
          { name: "Lumbosacral Plexus", slug: "lumbosacral-plexus", diseases: [
            mkDisease("Lumbosacral Plexopathy", "lumbosacral-plexopathy"),
            mkDisease("Piriformis Syndrome", "piriformis-syndrome"),
          ]},
          { name: "Cranial Neuropathies", slug: "cranial-neuropathies", diseases: [
            mkDisease("Trigeminal Neuralgia (Vascular Compression)", "trigeminal-neuralgia"),
            mkDisease("Bell Palsy", "bell-palsy"),
          ]},
          { name: "Peripheral Nerve Tumors", slug: "peripheral-nerve-tumors", diseases: [
            mkDisease("Neurofibroma", "neurofibroma"),
            mkDisease("Malignant Peripheral Nerve Sheath Tumor", "malignant-peripheral-nerve-sheath-tumor"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Abdominal Radiology",
    slug: "abdominal-radiology",
    icon: "🍽",
    categories: [
      {
        name: "GI Tract",
        slug: "gi-tract",
        subcategories: [
          { name: "Esophagus", slug: "esophagus", diseases: [
            mkDisease("Esophageal Carcinoma", "esophageal-carcinoma"),
            mkDisease("Achalasia", "achalasia"),
            mkDisease("Esophageal Varices", "esophageal-varices"),
          ]},
          { name: "Stomach", slug: "stomach", diseases: [
            mkDisease("Gastric Adenocarcinoma", "gastric-adenocarcinoma"),
            mkDisease("Gastric GIST", "gastric-gist"),
            mkDisease("Peptic Ulcer Disease", "peptic-ulcer-disease"),
          ]},
          { name: "Small Bowel", slug: "small-bowel", diseases: [
            mkDisease("Crohn Disease", "crohn-disease"),
            mkDisease("Small Bowel Obstruction", "small-bowel-obstruction"),
            mkDisease("Small Bowel GIST", "small-bowel-gist"),
          ]},
          { name: "Colon & Rectum", slug: "colon-rectum", diseases: [
            mkDisease("Colorectal Carcinoma", "colorectal-carcinoma"),
            mkDisease("Acute Diverticulitis", "acute-diverticulitis"),
            mkDisease("Ulcerative Colitis", "ulcerative-colitis"),
          ]},
          { name: "Appendix", slug: "appendix", diseases: [
            mkDisease("Acute Appendicitis", "acute-appendicitis"),
            mkDisease("Appendiceal Mucocele", "appendiceal-mucocele"),
          ]},
          { name: "Peritoneum & Mesentery", slug: "peritoneum-mesentery", diseases: [
            mkDisease("Peritoneal Carcinomatosis", "peritoneal-carcinomatosis"),
            mkDisease("Mesenteric Panniculitis", "mesenteric-panniculitis"),
          ]},
        ],
      },
      {
        name: "Hepatobiliary",
        slug: "hepatobiliary",
        subcategories: [
          { name: "Liver", slug: "liver", diseases: [
            mkDisease("Hepatocellular Carcinoma", "hepatocellular-carcinoma", {
              overview: "The most common primary liver malignancy, arising almost exclusively in the setting of chronic liver disease and cirrhosis.",
              epidemiology: "Strongly associated with chronic HBV/HCV infection and cirrhosis of any cause; rising incidence linked to NAFLD/NASH.",
              features: "Often asymptomatic and detected on surveillance ultrasound; advanced disease presents with weight loss, RUQ pain, and rising AFP.",
              pathology: "Trabecular or pseudoglandular architecture; capsule formation in well-differentiated tumors.",
              genetics: "TP53 and CTNNB1 mutations are common; TERT promoter mutations occur early in hepatocarcinogenesis.",
              pearls: "Classic vascular pattern is arterial phase hyperenhancement with washout on portal venous/delayed phases — the core of the LI-RADS classification system.",
              keySigns: ["Arterial hyperenhancement with washout", "Capsule enhancement", "Threshold growth"],
              imaging: {
                T1: "Variable; may show fat or hemorrhage",
                T2_FLAIR: "Mildly hyperintense relative to background liver",
                T1_C: "Arterial phase hyperenhancement, washout on delayed phase, capsule enhancement",
                DWI_ADC: "Restricted diffusion in viable tumor",
                Perfusion: "LI-RADS major features rely on this washout pattern",
              },
              differentials: ["arterial-enhancing-liver-lesions"],
            }),
            mkDisease("Hepatic Adenoma", "hepatic-adenoma"),
            mkDisease("Focal Nodular Hyperplasia", "focal-nodular-hyperplasia"),
            mkDisease("Hepatic Hemangioma", "hepatic-hemangioma"),
          ]},
          { name: "Biliary System", slug: "biliary-system", diseases: [
            mkDisease("Cholangiocarcinoma", "cholangiocarcinoma"),
            mkDisease("Choledocholithiasis", "choledocholithiasis"),
            mkDisease("Gallbladder Carcinoma", "gallbladder-carcinoma"),
          ]},
        ],
      },
      {
        name: "Pancreas",
        slug: "pancreas",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Pancreatic Adenocarcinoma", "pancreatic-adenocarcinoma", {
              overview: "An aggressive ductal adenocarcinoma and the most common pancreatic malignancy, frequently diagnosed at an advanced, unresectable stage.",
              epidemiology: "Incidence rises sharply after age 60; smoking, chronic pancreatitis, and hereditary syndromes (BRCA2, Peutz-Jeghers) increase risk.",
              features: "Painless jaundice (head lesions), weight loss, new-onset diabetes, and vague epigastric pain are common presentations.",
              pathology: "Densely desmoplastic stroma surrounding infiltrative glandular elements — explains the typically hypovascular imaging appearance.",
              genetics: "KRAS mutation in the vast majority; TP53, SMAD4, and CDKN2A alterations occur with progression.",
              pearls: "Hypoattenuating, poorly marginated mass on pancreatic-phase CT with upstream ductal dilatation ('double duct sign' when both CBD and pancreatic duct are obstructed) is the classic discriminator from focal pancreatitis.",
              keySigns: ["Double duct sign", "Hypovascular mass on pancreatic phase", "Vascular encasement"],
              imaging: {
                T1: "Hypointense relative to normal pancreatic parenchyma",
                T2_FLAIR: "Mildly hyperintense, often subtle",
                T1_C: "Hypoenhancing relative to normal pancreas on pancreatic phase",
                DWI_ADC: "Restricted diffusion",
                Perfusion: "Hypovascular — key discriminator from neuroendocrine tumors",
              },
              differentials: ["pancreatic-head-masses"],
            }),
            mkDisease("Pancreatic Neuroendocrine Tumor", "pancreatic-neuroendocrine-tumor"),
            mkDisease("Acute Pancreatitis", "acute-pancreatitis"),
            mkDisease("Chronic Pancreatitis", "chronic-pancreatitis"),
          ]},
        ],
      },
      {
        name: "Spleen",
        slug: "spleen",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Splenic Infarct", "splenic-infarct"),
            mkDisease("Splenic Lymphoma", "splenic-lymphoma"),
            mkDisease("Splenic Hemangioma", "splenic-hemangioma"),
          ]},
        ],
      },
      {
        name: "Retroperitoneum",
        slug: "retroperitoneum",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Retroperitoneal Liposarcoma", "retroperitoneal-liposarcoma"),
            mkDisease("Retroperitoneal Fibrosis", "retroperitoneal-fibrosis"),
          ]},
        ],
      },
      {
        name: "Abdominal Vasculature",
        slug: "abdominal-vasculature",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Abdominal Aortic Aneurysm", "abdominal-aortic-aneurysm"),
            mkDisease("Acute Mesenteric Ischemia", "acute-mesenteric-ischemia"),
            mkDisease("Portal Vein Thrombosis", "portal-vein-thrombosis"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Genitourinary Radiology",
    slug: "genitourinary-radiology",
    icon: "🩺",
    categories: [
      {
        name: "Kidneys",
        slug: "kidneys",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Horseshoe Kidney", "horseshoe-kidney"),
            mkDisease("Duplex Collecting System", "duplex-collecting-system"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Acute Pyelonephritis", "acute-pyelonephritis"),
            mkDisease("Renal Abscess", "renal-abscess"),
            mkDisease("Xanthogranulomatous Pyelonephritis", "xanthogranulomatous-pyelonephritis"),
          ]},
          { name: "Stone Disease", slug: "stone-disease", diseases: [
            mkDisease("Nephrolithiasis", "nephrolithiasis"),
            mkDisease("Staghorn Calculus", "staghorn-calculus"),
          ]},
          { name: "Cystic Disease", slug: "cystic-disease", diseases: [
            mkDisease("Bosniak Category III Cyst", "bosniak-iii-cyst"),
            mkDisease("Autosomal Dominant Polycystic Kidney Disease", "adpkd"),
          ]},
          { name: "Vascular", slug: "vascular", diseases: [
            mkDisease("Renal Artery Stenosis", "renal-artery-stenosis"),
            mkDisease("Renal Vein Thrombosis", "renal-vein-thrombosis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Clear Cell Renal Cell Carcinoma", "clear-cell-rcc"),
            mkDisease("Angiomyolipoma", "angiomyolipoma"),
            mkDisease("Oncocytoma", "oncocytoma"),
          ]},
        ],
      },
      {
        name: "Collecting System & Ureters",
        slug: "collecting-system-ureters",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Ureteropelvic Junction Obstruction", "upj-obstruction"),
          ]},
          { name: "Obstruction", slug: "obstruction", diseases: [
            mkDisease("Ureterolithiasis with Hydronephrosis", "ureterolithiasis-hydronephrosis"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Pyonephrosis", "pyonephrosis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Urothelial Carcinoma of the Ureter", "urothelial-carcinoma-ureter"),
          ]},
        ],
      },
      {
        name: "Urinary Bladder",
        slug: "urinary-bladder",
        subcategories: [
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Cystitis", "cystitis"),
            mkDisease("Emphysematous Cystitis", "emphysematous-cystitis"),
          ]},
          { name: "Neurogenic", slug: "neurogenic", diseases: [
            mkDisease("Neurogenic Bladder", "neurogenic-bladder"),
          ]},
          { name: "Trauma", slug: "trauma", diseases: [
            mkDisease("Bladder Rupture", "bladder-rupture"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Bladder Urothelial Carcinoma", "bladder-urothelial-carcinoma"),
          ]},
        ],
      },
      {
        name: "Adrenal Glands",
        slug: "adrenal-glands",
        subcategories: [
          { name: "Hyperplasia", slug: "hyperplasia", diseases: [
            mkDisease("Adrenal Hyperplasia", "adrenal-hyperplasia"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Adrenal Tuberculosis", "adrenal-tuberculosis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Adrenal Adenoma", "adrenal-adenoma"),
            mkDisease("Pheochromocytoma", "pheochromocytoma"),
            mkDisease("Adrenocortical Carcinoma", "adrenocortical-carcinoma"),
          ]},
        ],
      },
      {
        name: "Male Genital System",
        slug: "male-genital-system",
        subcategories: [
          { name: "Prostate", slug: "prostate", diseases: [
            mkDisease("Prostate Adenocarcinoma", "prostate-adenocarcinoma"),
            mkDisease("Benign Prostatic Hyperplasia", "benign-prostatic-hyperplasia"),
          ]},
          { name: "Seminal Vesicles", slug: "seminal-vesicles", diseases: [
            mkDisease("Seminal Vesicle Cyst", "seminal-vesicle-cyst"),
          ]},
          { name: "Scrotum & Testes", slug: "scrotum-testes", diseases: [
            mkDisease("Testicular Seminoma", "testicular-seminoma"),
            mkDisease("Testicular Torsion", "testicular-torsion"),
            mkDisease("Epididymo-orchitis", "epididymo-orchitis"),
          ]},
          { name: "Penis", slug: "penis", diseases: [
            mkDisease("Peyronie Disease", "peyronie-disease"),
            mkDisease("Penile Carcinoma", "penile-carcinoma"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Thoracic Radiology",
    slug: "thoracic-radiology",
    icon: "🫁",
    categories: [
      {
        name: "Lung Parenchyma",
        slug: "lung-parenchyma",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Congenital Pulmonary Airway Malformation", "cpam"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Community-Acquired Pneumonia", "community-acquired-pneumonia"),
            mkDisease("Pulmonary Tuberculosis", "pulmonary-tuberculosis"),
            mkDisease("Fungal Pneumonia", "fungal-pneumonia"),
          ]},
          { name: "Airway Diseases", slug: "airway-diseases", diseases: [
            mkDisease("Bronchiectasis", "bronchiectasis"),
            mkDisease("Bronchiolitis", "bronchiolitis"),
          ]},
          { name: "Interstitial Lung Diseases", slug: "ild", diseases: [
            mkDisease("Usual Interstitial Pneumonia", "usual-interstitial-pneumonia"),
            mkDisease("Nonspecific Interstitial Pneumonia", "nonspecific-interstitial-pneumonia"),
            mkDisease("Hypersensitivity Pneumonitis", "hypersensitivity-pneumonitis"),
          ]},
          { name: "Occupational Lung Diseases", slug: "occupational-lung-diseases", diseases: [
            mkDisease("Silicosis", "silicosis"),
            mkDisease("Asbestosis", "asbestosis"),
          ]},
          { name: "Vascular Disorders", slug: "vascular-disorders", diseases: [
            mkDisease("ARDS", "ards", {
              overview: "Acute Respiratory Distress Syndrome — a syndrome of acute hypoxemic respiratory failure due to diffuse alveolar damage from a precipitating insult.",
              epidemiology: "Common precipitants include sepsis, pneumonia, aspiration, and trauma; mortality remains substantial despite supportive care advances.",
              features: "Diagnosed by the Berlin criteria: acute onset (within 1 week), bilateral opacities, and hypoxemia not fully explained by cardiac failure.",
              pathology: "Diffuse alveolar damage with hyaline membrane formation in the exudative phase, progressing to fibroproliferative changes.",
              genetics: "Not a primary genetic condition.",
              pearls: "Bilateral, often gravity-dependent ground-glass and consolidative opacities that spare the costophrenic angles relatively early — the key distinction from cardiogenic edema is the absence of cardiomegaly and pleural effusions early on.",
              keySigns: ["Bilateral ground-glass opacities", "Gravity-dependent consolidation", "Absence of cardiomegaly"],
              imaging: {
                T1: "Not applicable — CT/CXR based diagnosis",
                T2_FLAIR: "Not applicable",
                T1_C: "Not applicable",
                DWI_ADC: "Not applicable",
                Perfusion: "Not the primary diagnostic modality",
              },
              differentials: ["bilateral-ground-glass-opacities"],
            }),
            mkDisease("Pulmonary Infarction", "pulmonary-infarction"),
          ]},
          { name: "Smoking-related Diseases", slug: "smoking-related", diseases: [
            mkDisease("Centrilobular Emphysema", "centrilobular-emphysema"),
            mkDisease("Respiratory Bronchiolitis-ILD", "respiratory-bronchiolitis-ild"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Lung Adenocarcinoma", "lung-adenocarcinoma"),
            mkDisease("Squamous Cell Carcinoma of Lung", "squamous-cell-carcinoma-lung"),
            mkDisease("Pulmonary Hamartoma", "pulmonary-hamartoma"),
          ]},
        ],
      },
      {
        name: "Pleura",
        slug: "pleura",
        subcategories: [
          { name: "Effusions", slug: "effusions", diseases: [
            mkDisease("Malignant Pleural Effusion", "malignant-pleural-effusion"),
            mkDisease("Parapneumonic Effusion", "parapneumonic-effusion"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Empyema", "empyema"),
          ]},
          { name: "Pneumothorax", slug: "pneumothorax", diseases: [
            mkDisease("Spontaneous Pneumothorax", "spontaneous-pneumothorax"),
            mkDisease("Tension Pneumothorax", "tension-pneumothorax"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Malignant Pleural Mesothelioma", "malignant-pleural-mesothelioma"),
          ]},
        ],
      },
      {
        name: "Mediastinum",
        slug: "mediastinum",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Bronchogenic Cyst", "bronchogenic-cyst"),
          ]},
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Fibrosing Mediastinitis", "fibrosing-mediastinitis"),
          ]},
          { name: "Vascular", slug: "vascular", diseases: [
            mkDisease("Thoracic Aortic Dissection", "thoracic-aortic-dissection"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Thymoma", "thymoma"),
            mkDisease("Mediastinal Lymphoma", "mediastinal-lymphoma"),
            mkDisease("Mediastinal Germ Cell Tumor", "mediastinal-germ-cell-tumor"),
          ]},
        ],
      },
      {
        name: "Pulmonary Vasculature",
        slug: "pulmonary-vasculature",
        subcategories: [
          { name: "Pulmonary Embolism", slug: "pulmonary-embolism", diseases: [
            mkDisease("Acute Pulmonary Embolism", "acute-pulmonary-embolism"),
          ]},
          { name: "Pulmonary Hypertension", slug: "pulmonary-hypertension", diseases: [
            mkDisease("Chronic Thromboembolic Pulmonary Hypertension", "cteph"),
          ]},
          { name: "AVM", slug: "avm", diseases: [
            mkDisease("Pulmonary Arteriovenous Malformation", "pulmonary-avm"),
          ]},
          { name: "Vasculitis", slug: "vasculitis", diseases: [
            mkDisease("Pulmonary Vasculitis (Granulomatosis with Polyangiitis)", "pulmonary-vasculitis-gpa"),
          ]},
        ],
      },
      {
        name: "Chest Wall & Diaphragm",
        slug: "chest-wall-diaphragm",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Pectus Excavatum", "pectus-excavatum"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Chest Wall Abscess", "chest-wall-abscess"),
          ]},
          { name: "Trauma", slug: "trauma", diseases: [
            mkDisease("Rib Fractures with Flail Chest", "rib-fractures-flail-chest"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Chest Wall Chondrosarcoma", "chest-wall-chondrosarcoma"),
          ]},
        ],
      },
      {
        name: "Cardiac Imaging",
        slug: "cardiac-imaging",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Hypertrophic Cardiomyopathy", "hypertrophic-cardiomyopathy"),
            mkDisease("Myocardial Infarction (Imaging)", "myocardial-infarction-imaging"),
            mkDisease("Pericardial Effusion", "pericardial-effusion"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Head & Neck Radiology",
    slug: "head-neck-radiology",
    icon: "👂",
    categories: [
      {
        name: "Orbit",
        slug: "orbit",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Coloboma", "coloboma"),
          ]},
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Orbital Cellulitis", "orbital-cellulitis"),
            mkDisease("Thyroid Eye Disease", "thyroid-eye-disease"),
          ]},
          { name: "Vascular", slug: "vascular", diseases: [
            mkDisease("Orbital Varix", "orbital-varix"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Retinoblastoma", "retinoblastoma"),
            mkDisease("Optic Nerve Glioma", "optic-nerve-glioma"),
          ]},
        ],
      },
      {
        name: "Sinonasal Region",
        slug: "sinonasal-region",
        subcategories: [
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Chronic Rhinosinusitis", "chronic-rhinosinusitis"),
          ]},
          { name: "Fungal Diseases", slug: "fungal-diseases", diseases: [
            mkDisease("Allergic Fungal Sinusitis", "allergic-fungal-sinusitis"),
            mkDisease("Invasive Fungal Sinusitis", "invasive-fungal-sinusitis"),
          ]},
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Choanal Atresia", "choanal-atresia"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Sinonasal Squamous Cell Carcinoma", "sinonasal-squamous-cell-carcinoma"),
            mkDisease("Inverted Papilloma", "inverted-papilloma"),
          ]},
        ],
      },
      {
        name: "Temporal Bone",
        slug: "temporal-bone",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Mondini Malformation", "mondini-malformation"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Acute Mastoiditis", "acute-mastoiditis"),
            mkDisease("Cholesteatoma", "cholesteatoma"),
          ]},
          { name: "Otosclerosis", slug: "otosclerosis", diseases: [
            mkDisease("Otosclerosis", "otosclerosis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Vestibular Schwannoma", "vestibular-schwannoma"),
            mkDisease("Glomus Jugulare Tumor", "glomus-jugulare-tumor"),
          ]},
        ],
      },
      {
        name: "Skull Base",
        slug: "skull-base",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Encephalocele", "encephalocele"),
          ]},
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Skull Base Osteomyelitis", "skull-base-osteomyelitis"),
          ]},
          { name: "Vascular", slug: "vascular", diseases: [
            mkDisease("Carotid-Cavernous Fistula", "carotid-cavernous-fistula"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Chordoma", "chordoma"),
            mkDisease("Skull Base Chondrosarcoma", "skull-base-chondrosarcoma"),
          ]},
        ],
      },
      {
        name: "Salivary Glands",
        slug: "salivary-glands",
        subcategories: [
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Sialadenitis", "sialadenitis"),
          ]},
          { name: "Obstructive", slug: "obstructive", diseases: [
            mkDisease("Sialolithiasis", "sialolithiasis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Pleomorphic Adenoma", "pleomorphic-adenoma"),
            mkDisease("Warthin Tumor", "warthin-tumor"),
            mkDisease("Mucoepidermoid Carcinoma", "mucoepidermoid-carcinoma"),
          ]},
        ],
      },
      {
        name: "Pharynx & Larynx",
        slug: "pharynx-larynx",
        subcategories: [
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Epiglottitis", "epiglottitis"),
            mkDisease("Peritonsillar Abscess", "peritonsillar-abscess"),
          ]},
          { name: "Vocal Cord Disorders", slug: "vocal-cord-disorders", diseases: [
            mkDisease("Vocal Cord Paralysis", "vocal-cord-paralysis"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Laryngeal Squamous Cell Carcinoma", "laryngeal-squamous-cell-carcinoma"),
            mkDisease("Nasopharyngeal Carcinoma", "nasopharyngeal-carcinoma"),
          ]},
        ],
      },
      {
        name: "Neck Spaces",
        slug: "neck-spaces",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Branchial Cleft Cyst", "branchial-cleft-cyst"),
            mkDisease("Thyroglossal Duct Cyst", "thyroglossal-duct-cyst"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Retropharyngeal Abscess", "retropharyngeal-abscess"),
            mkDisease("Ludwig Angina", "ludwig-angina"),
          ]},
          { name: "Vascular", slug: "vascular", diseases: [
            mkDisease("Carotid Body Tumor", "carotid-body-tumor"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Cervical Lymph Node Metastasis", "cervical-lymph-node-metastasis"),
          ]},
        ],
      },
      {
        name: "Thyroid & Parathyroid",
        slug: "thyroid-parathyroid",
        subcategories: [
          { name: "Diffuse Disease", slug: "diffuse-disease", diseases: [
            mkDisease("Graves Disease", "graves-disease"),
            mkDisease("Hashimoto Thyroiditis", "hashimoto-thyroiditis"),
          ]},
          { name: "Nodules", slug: "nodules", diseases: [
            mkDisease("Papillary Thyroid Carcinoma", "papillary-thyroid-carcinoma"),
            mkDisease("Thyroid Adenoma", "thyroid-adenoma"),
          ]},
          { name: "Tumors", slug: "tumors", diseases: [
            mkDisease("Parathyroid Adenoma", "parathyroid-adenoma"),
            mkDisease("Medullary Thyroid Carcinoma", "medullary-thyroid-carcinoma"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Pediatric Radiology",
    slug: "pediatric-radiology",
    icon: "👶",
    categories: [
      { name: "Neonatal Imaging", slug: "neonatal-imaging", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Necrotizing Enterocolitis", "necrotizing-enterocolitis"),
          mkDisease("Germinal Matrix Hemorrhage", "germinal-matrix-hemorrhage"),
        ]},
      ]},
      { name: "Congenital & Developmental Disorders", slug: "congenital-developmental-disorders", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Congenital Diaphragmatic Hernia", "congenital-diaphragmatic-hernia"),
          mkDisease("VACTERL Association", "vacterl-association"),
        ]},
      ]},
      { name: "Neuroradiology (Pediatric)", slug: "neuroradiology-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Periventricular Leukomalacia", "periventricular-leukomalacia"),
          mkDisease("Pediatric Medulloblastoma", "pediatric-medulloblastoma"),
        ]},
      ]},
      { name: "Thoracic Imaging (Pediatric)", slug: "thoracic-imaging-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Meconium Aspiration Syndrome", "meconium-aspiration-syndrome"),
          mkDisease("Transient Tachypnea of the Newborn", "transient-tachypnea-newborn"),
        ]},
      ]},
      { name: "Abdominal Imaging (Pediatric)", slug: "abdominal-imaging-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Hypertrophic Pyloric Stenosis", "hypertrophic-pyloric-stenosis"),
          mkDisease("Intussusception", "intussusception"),
        ]},
      ]},
      { name: "Genitourinary Imaging (Pediatric)", slug: "genitourinary-imaging-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Posterior Urethral Valves", "posterior-urethral-valves"),
          mkDisease("Wilms Tumor", "wilms-tumor"),
        ]},
      ]},
      { name: "Musculoskeletal Imaging (Pediatric)", slug: "musculoskeletal-imaging-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Developmental Dysplasia of the Hip", "developmental-dysplasia-hip"),
          mkDisease("Slipped Capital Femoral Epiphysis", "slipped-capital-femoral-epiphysis"),
        ]},
      ]},
      { name: "Oncology (Pediatric)", slug: "oncology-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Neuroblastoma", "neuroblastoma"),
          mkDisease("Hepatoblastoma", "hepatoblastoma"),
        ]},
      ]},
      { name: "Emergencies (Pediatric)", slug: "emergencies-pediatric", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Malrotation with Midgut Volvulus", "malrotation-midgut-volvulus"),
          mkDisease("Non-accidental Injury", "non-accidental-injury"),
        ]},
      ]},
      { name: "Syndromes & Metabolic Disorders", slug: "syndromes-metabolic-disorders", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Tuberous Sclerosis Complex", "tuberous-sclerosis-complex"),
          mkDisease("Mucopolysaccharidosis", "mucopolysaccharidosis"),
        ]},
      ]},
    ],
  },
  {
    name: "Musculoskeletal Radiology",
    slug: "musculoskeletal-radiology",
    icon: "🦴",
    categories: [
      {
        name: "Bone Lesions",
        slug: "bone-lesions",
        subcategories: [
          { name: "Benign Tumors", slug: "benign-tumors", diseases: [
            mkDisease("Osteochondroma", "osteochondroma"),
            mkDisease("Enchondroma", "enchondroma"),
          ]},
          { name: "Malignant Tumors", slug: "malignant-tumors", diseases: [
            mkDisease("Osteosarcoma", "osteosarcoma"),
            mkDisease("Ewing Sarcoma", "ewing-sarcoma"),
            mkDisease("Chondrosarcoma", "chondrosarcoma"),
          ]},
          { name: "Tumor-like Lesions", slug: "tumor-like-lesions", diseases: [
            mkDisease("Simple Bone Cyst", "simple-bone-cyst"),
            mkDisease("Fibrous Dysplasia", "fibrous-dysplasia"),
          ]},
          { name: "Metastases", slug: "metastases", diseases: [
            mkDisease("Skeletal Metastasis", "skeletal-metastasis"),
          ]},
        ],
      },
      {
        name: "Soft Tissue Lesions",
        slug: "soft-tissue-lesions",
        subcategories: [
          { name: "Benign Tumors", slug: "benign-tumors", diseases: [
            mkDisease("Lipoma", "lipoma"),
            mkDisease("Soft Tissue Hemangioma", "soft-tissue-hemangioma"),
          ]},
          { name: "Malignant Tumors", slug: "malignant-tumors", diseases: [
            mkDisease("Liposarcoma", "liposarcoma"),
            mkDisease("Synovial Sarcoma", "synovial-sarcoma"),
          ]},
          { name: "Tumor-like Lesions", slug: "tumor-like-lesions", diseases: [
            mkDisease("Myositis Ossificans", "myositis-ossificans"),
            mkDisease("Ganglion Cyst", "ganglion-cyst"),
          ]},
        ],
      },
      {
        name: "Trauma",
        slug: "trauma",
        subcategories: [
          { name: "Upper Limb", slug: "upper-limb", diseases: [
            mkDisease("Distal Radius Fracture", "distal-radius-fracture"),
            mkDisease("Rotator Cuff Tear", "rotator-cuff-tear"),
          ]},
          { name: "Lower Limb", slug: "lower-limb", diseases: [
            mkDisease("Tibial Plateau Fracture", "tibial-plateau-fracture"),
            mkDisease("ACL Tear", "acl-tear"),
          ]},
          { name: "Spine", slug: "spine", diseases: [
            mkDisease("Traumatic Vertebral Compression Fracture", "traumatic-vertebral-compression-fracture"),
          ]},
        ],
      },
      {
        name: "Arthropathy",
        slug: "arthropathy",
        subcategories: [
          { name: "Degenerative", slug: "degenerative", diseases: [
            mkDisease("Osteoarthritis", "osteoarthritis"),
          ]},
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Rheumatoid Arthritis", "rheumatoid-arthritis"),
          ]},
          { name: "Crystal Deposition", slug: "crystal-deposition", diseases: [
            mkDisease("Gout", "gout"),
            mkDisease("CPPD Disease (Pseudogout)", "cppd-disease"),
          ]},
          { name: "Neuropathic", slug: "neuropathic", diseases: [
            mkDisease("Charcot Arthropathy", "charcot-arthropathy"),
          ]},
        ],
      },
      {
        name: "Infection",
        slug: "infection",
        subcategories: [
          { name: "Osteomyelitis", slug: "osteomyelitis", diseases: [
            mkDisease("Acute Hematogenous Osteomyelitis", "acute-hematogenous-osteomyelitis"),
          ]},
          { name: "Septic Arthritis", slug: "septic-arthritis", diseases: [
            mkDisease("Septic Arthritis", "septic-arthritis"),
          ]},
          { name: "Soft Tissue Infection", slug: "soft-tissue-infection", diseases: [
            mkDisease("Necrotizing Fasciitis", "necrotizing-fasciitis"),
          ]},
        ],
      },
      {
        name: "Metabolic Bone Disorders",
        slug: "metabolic-bone-disorders",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Osteoporosis", "osteoporosis"),
            mkDisease("Osteomalacia", "osteomalacia"),
            mkDisease("Paget Disease of Bone", "paget-disease-of-bone"),
          ]},
        ],
      },
      {
        name: "Sports Imaging",
        slug: "sports-imaging",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Stress Fracture", "stress-fracture"),
            mkDisease("Meniscal Tear", "meniscal-tear"),
          ]},
        ],
      },
      {
        name: "Spine",
        slug: "spine-msk",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Lumbar Spondylosis", "lumbar-spondylosis"),
          ]},
        ],
      },
      {
        name: "Pediatric MSK",
        slug: "pediatric-msk",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Osgood-Schlatter Disease", "osgood-schlatter-disease"),
            mkDisease("Legg-Calve-Perthes Disease", "legg-calve-perthes-disease"),
          ]},
        ],
      },
    ],
  },
  {
    name: "OB-GYN & Breast Radiology",
    slug: "obgyn-breast-radiology",
    icon: "👩",
    categories: [
      {
        name: "Uterus",
        slug: "uterus",
        subcategories: [
          { name: "Congenital", slug: "congenital", diseases: [
            mkDisease("Bicornuate Uterus", "bicornuate-uterus"),
            mkDisease("Septate Uterus", "septate-uterus"),
          ]},
          { name: "Benign Disorders", slug: "benign-disorders", diseases: [
            mkDisease("Uterine Leiomyoma", "uterine-leiomyoma"),
            mkDisease("Adenomyosis", "adenomyosis"),
          ]},
          { name: "Pregnancy-related", slug: "pregnancy-related", diseases: [
            mkDisease("Cesarean Scar Pregnancy", "cesarean-scar-pregnancy"),
          ]},
          { name: "Malignancy", slug: "malignancy", diseases: [
            mkDisease("Endometrial Carcinoma", "endometrial-carcinoma"),
          ]},
        ],
      },
      {
        name: "Cervix",
        slug: "cervix",
        subcategories: [
          { name: "Benign Disorders", slug: "benign-disorders", diseases: [
            mkDisease("Cervical Polyp", "cervical-polyp"),
          ]},
          { name: "Malignancy", slug: "malignancy", diseases: [
            mkDisease("Cervical Carcinoma", "cervical-carcinoma"),
          ]},
        ],
      },
      {
        name: "Ovaries & Adnexa",
        slug: "ovaries-adnexa",
        subcategories: [
          { name: "Functional Lesions", slug: "functional-lesions", diseases: [
            mkDisease("Functional Ovarian Cyst", "functional-ovarian-cyst"),
          ]},
          { name: "Benign Tumors", slug: "benign-tumors", diseases: [
            mkDisease("Mature Cystic Teratoma", "mature-cystic-teratoma"),
          ]},
          { name: "Endometriosis", slug: "endometriosis", diseases: [
            mkDisease("Endometrioma", "endometrioma"),
          ]},
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Tubo-ovarian Abscess", "tubo-ovarian-abscess"),
          ]},
          { name: "Torsion", slug: "torsion", diseases: [
            mkDisease("Ovarian Torsion", "ovarian-torsion"),
          ]},
          { name: "Malignancy", slug: "malignancy", diseases: [
            mkDisease("Ovarian Serous Cystadenocarcinoma", "ovarian-serous-cystadenocarcinoma"),
          ]},
        ],
      },
      {
        name: "Fallopian Tubes",
        slug: "fallopian-tubes",
        subcategories: [
          { name: "Infection", slug: "infection", diseases: [
            mkDisease("Pyosalpinx", "pyosalpinx"),
          ]},
          { name: "Ectopic Pregnancy", slug: "ectopic-pregnancy", diseases: [
            mkDisease("Tubal Ectopic Pregnancy", "tubal-ectopic-pregnancy"),
          ]},
          { name: "Neoplasms", slug: "neoplasms", diseases: [
            mkDisease("Fallopian Tube Carcinoma", "fallopian-tube-carcinoma"),
          ]},
        ],
      },
      {
        name: "Pelvic Floor",
        slug: "pelvic-floor",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Pelvic Organ Prolapse", "pelvic-organ-prolapse"),
          ]},
        ],
      },
      {
        name: "Obstetric Imaging",
        slug: "obstetric-imaging",
        subcategories: [
          { name: "First Trimester", slug: "first-trimester", diseases: [
            mkDisease("Missed Abortion", "missed-abortion"),
          ]},
          { name: "Fetal Imaging", slug: "fetal-imaging", diseases: [
            mkDisease("Open Spina Bifida (Fetal)", "open-spina-bifida-fetal"),
          ]},
          { name: "Placenta", slug: "placenta", diseases: [
            mkDisease("Placenta Previa", "placenta-previa"),
            mkDisease("Placenta Accreta Spectrum", "placenta-accreta-spectrum"),
          ]},
          { name: "Umbilical Cord", slug: "umbilical-cord", diseases: [
            mkDisease("Single Umbilical Artery", "single-umbilical-artery"),
            mkDisease("Vasa Previa", "vasa-previa"),
          ]},
        ],
      },
      {
        name: "Gestational Trophoblastic Disease",
        slug: "gestational-trophoblastic-disease",
        subcategories: [
          { name: "General", slug: "general", diseases: [
            mkDisease("Hydatidiform Mole", "hydatidiform-mole"),
            mkDisease("Choriocarcinoma", "choriocarcinoma"),
          ]},
        ],
      },
      {
        name: "Breast Imaging",
        slug: "breast-imaging",
        subcategories: [
          { name: "Congenital & Developmental", slug: "congenital-developmental", diseases: [
            mkDisease("Accessory Breast Tissue", "accessory-breast-tissue"),
          ]},
          { name: "Benign Lesions", slug: "benign-lesions", diseases: [
            mkDisease("Fibroadenoma", "fibroadenoma"),
            mkDisease("Breast Cyst", "breast-cyst"),
          ]},
          { name: "Inflammatory", slug: "inflammatory", diseases: [
            mkDisease("Mastitis", "mastitis"),
            mkDisease("Breast Abscess", "breast-abscess"),
          ]},
          { name: "High-Risk Lesions", slug: "high-risk-lesions", diseases: [
            mkDisease("Atypical Ductal Hyperplasia", "atypical-ductal-hyperplasia"),
            mkDisease("Lobular Carcinoma In Situ", "lobular-carcinoma-in-situ"),
          ]},
          { name: "Malignancy", slug: "malignancy", diseases: [
            mkDisease("Invasive Ductal Carcinoma", "invasive-ductal-carcinoma"),
            mkDisease("Invasive Lobular Carcinoma", "invasive-lobular-carcinoma"),
          ]},
          { name: "Post-treatment Imaging", slug: "post-treatment-imaging", diseases: [
            mkDisease("Post-lumpectomy Fat Necrosis", "post-lumpectomy-fat-necrosis"),
            mkDisease("Implant Rupture", "implant-rupture"),
          ]},
        ],
      },
    ],
  },
  {
    name: "Interventional Radiology",
    slug: "interventional-radiology",
    icon: "⚡",
    categories: [
      { name: "Vascular", slug: "vascular", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Peripheral Arterial Disease (Angioplasty)", "peripheral-arterial-disease-angioplasty"),
          mkDisease("Varicose Veins (Sclerotherapy)", "varicose-veins-sclerotherapy"),
        ]},
      ]},
      { name: "Neurointervention", slug: "neurointervention", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Acute Ischemic Stroke (Mechanical Thrombectomy)", "stroke-mechanical-thrombectomy"),
          mkDisease("Cerebral Aneurysm (Coil Embolization)", "cerebral-aneurysm-coil-embolization"),
        ]},
      ]},
      { name: "Hepatobiliary", slug: "hepatobiliary", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Hepatocellular Carcinoma (TACE / Y90)", "hcc-tace-y90"),
          mkDisease("Biliary Obstruction (PTBD)", "biliary-obstruction-ptbd"),
        ]},
      ]},
      { name: "Genitourinary", slug: "genitourinary", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Renal Cell Carcinoma (Thermal Ablation)", "rcc-thermal-ablation"),
          mkDisease("Obstructive Uropathy (Nephrostomy)", "obstructive-uropathy-nephrostomy"),
        ]},
      ]},
      { name: "Oncology", slug: "oncology", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Lung Tumor Ablation", "lung-tumor-ablation"),
          mkDisease("Bone Metastasis (Cementoplasty)", "bone-metastasis-cementoplasty"),
        ]},
      ]},
      { name: "Non-Vascular", slug: "non-vascular", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Image-guided Abscess Drainage", "image-guided-abscess-drainage"),
          mkDisease("CT-guided Percutaneous Biopsy", "ct-guided-percutaneous-biopsy"),
        ]},
      ]},
      { name: "MSK & Pain", slug: "msk-pain", subcategories: [
        { name: "General", slug: "general", diseases: [
          mkDisease("Facet Joint Injection", "facet-joint-injection"),
          mkDisease("Vertebroplasty for Compression Fracture", "vertebroplasty-compression-fracture"),
        ]},
      ]},
    ],
  },
];
export { TAXONOMY };

export function getTaxonomyOptions() {
  return TAXONOMY.map((sys) => ({
    slug: sys.slug,
    name: sys.name,
    icon: sys.icon,
    categories: sys.categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      subcategories: cat.subcategories.map((sub) => ({
        slug: sub.slug,
        name: sub.name,
      })),
    })),
  }));
}