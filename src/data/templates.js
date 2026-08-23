export const TEMPLATES = [
  {
    title: "MRI Brain — Glioblastoma Protocol",
    modality: "MRI",
    diseaseSlug: "glioblastoma",
    content: {
      history: "Progressive headache and left-sided weakness, 3 weeks duration.",
      technique:
        "Multiplanar, multisequence MRI of the brain with and without intravenous contrast, including DWI and perfusion sequences.",
      findings: {
        Mass: "A heterogeneously enhancing mass centered in the right frontal lobe white matter, measuring 4.2 x 3.6 x 3.1 cm.",
        Enhancement:
          "Thick, irregular peripheral enhancement surrounding a central non-enhancing necrotic core.",
        Edema:
          "Extensive surrounding T2/FLAIR hyperintense vasogenic edema with mild mass effect on the adjacent lateral ventricle.",
        Perfusion:
          "Markedly elevated relative cerebral blood volume at the enhancing margin.",
        "Midline shift": "3 mm rightward to leftward midline shift.",
      },
      impression:
        "Findings are highly suspicious for a high-grade glial neoplasm (glioblastoma). Recommend tissue diagnosis and neuro-oncology correlation.",
    },
  },
  {
    title: "CT Abdomen — Pancreatic Protocol",
    modality: "CT",
    diseaseSlug: "pancreatic-adenocarcinoma",
    content: {
      history:
        "Painless jaundice and 8 kg unintentional weight loss over 2 months.",
      technique:
        "Dedicated dual-phase pancreatic CT protocol with pancreatic and portal venous phase acquisitions, oral and intravenous contrast.",
      findings: {
        "Pancreatic mass":
          "A 2.8 cm hypoenhancing mass in the head of the pancreas relative to background parenchyma on the pancreatic phase.",
        "Ductal dilatation":
          "Upstream dilatation of the main pancreatic duct and common bile duct (double duct sign).",
        "Vascular involvement":
          "No definitive encasement of the SMA or celiac axis; abutment of the SMV measuring less than 180 degrees.",
        "Nodes/Mets":
          "No pathologically enlarged lymph nodes or hepatic lesions identified.",
      },
      impression:
        "Findings consistent with pancreatic head adenocarcinoma, currently appearing potentially resectable. Recommend multidisciplinary tumor board review.",
    },
  },
  {
    title: "NCCT Head — Acute Stroke Protocol",
    modality: "CT",
    diseaseSlug: "acute-ischemic-stroke",
    content: {
      history:
        "Acute onset right-sided weakness and slurred speech, last known well 90 minutes prior.",
      technique: "Non-contrast CT of the head.",
      findings: {
        "Gray-white differentiation":
          "Subtle loss of gray-white differentiation in the left insular cortex and lentiform nucleus.",
        ASPECTS: "Estimated ASPECTS score of 8/10.",
        Hemorrhage: "No acute intracranial hemorrhage.",
        "Hyperdense vessel sign":
          "Subtle hyperdensity of the left M1 segment, compatible with thrombus.",
      },
      impression:
        "Findings compatible with acute/hyperacute left MCA territory ischemia. ASPECTS 8. Recommend urgent CTA/CTP correlation for thrombectomy candidacy.",
    },
  },
];