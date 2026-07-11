const { GoogleGenAI, Type, Schema } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CRM_FIELDS = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description"
];

// We define a JSON schema for the AI to output exactly what we want.
const responseSchema = {
  type: Type.ARRAY,
  description: "An array of structured CRM lead records extracted from the raw CSV data.",
  items: {
    type: Type.OBJECT,
    properties: {
      created_at: { type: Type.STRING, description: "Lead creation date (must be parseable by new Date())" },
      name: { type: Type.STRING, description: "Lead name" },
      email: { type: Type.STRING, description: "Primary email address" },
      country_code: { type: Type.STRING, description: "Mobile country code (e.g., +91)" },
      mobile_without_country_code: { type: Type.STRING, description: "Mobile number without country code" },
      company: { type: Type.STRING, description: "Company name" },
      city: { type: Type.STRING, description: "City" },
      state: { type: Type.STRING, description: "State" },
      country: { type: Type.STRING, description: "Country" },
      lead_owner: { type: Type.STRING, description: "Lead owner email or name" },
      crm_status: { type: Type.STRING, description: "MUST BE EXACTLY ONE OF: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. If none match, leave empty." },
      crm_note: { type: Type.STRING, description: "Remarks, follow-ups, extra emails/phones, or useful unstructured info." },
      data_source: { type: Type.STRING, description: "MUST BE EXACTLY ONE OF: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. If none match confidently, leave empty." },
      possession_time: { type: Type.STRING, description: "Property possession time" },
      description: { type: Type.STRING, description: "Additional description" }
    }
  }
};

const BATCH_SIZE = 20; // Process 20 rows at a time to prevent AI hallucination and token limits

const systemInstruction = `You are an intelligent data extraction assistant. Your job is to map messy CSV row data into a strict CRM schema.
CRITICAL RULES:
1. "crm_status": Use ONLY one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE.
2. "data_source": Use ONLY one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. Leave blank if unsure.
3. "created_at": Must be a valid format for JS new Date(created_at). e.g., '2026-05-13 14:20:48' or ISO.
4. "crm_note": If there are multiple emails or phones, use the primary one for the respective fields, and put the extra ones in this "crm_note" field. Also include any random remarks, unstructured data, or comments here. Escape line breaks with \\n.
5. If a field is not present in the input, leave it null or empty string.

You will receive a JSON array of messy objects (rows from a CSV). Return a corresponding JSON array of cleaned objects matching the required schema. Ensure the output array has the EXACT SAME LENGTH as the input array, and in the SAME ORDER.`;

async function processBatch(batch) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: JSON.stringify(batch),
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for deterministic mapping
      }
    });

    const parsedResponse = JSON.parse(response.text());
    return parsedResponse;
  } catch (error) {
    console.error("Error processing batch with AI:", error);
    // If structured output fails, fallback to standard JSON block extraction might be needed,
    // but the SDK handles JSON generation well with responseSchema.
    throw error;
  }
}

async function processRecordsWithAI(records) {
  const imported = [];
  const skipped = [];
  
  // Create batches
  const batches = [];
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    batches.push(records.slice(i, i + BATCH_SIZE));
  }

  console.log(`Starting AI processing for ${records.length} records in ${batches.length} batches.`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length}...`);
    
    try {
      const processedBatch = await processBatch(batch);
      
      // Validation & Filtering
      processedBatch.forEach((record, index) => {
        const hasEmail = record.email && record.email.trim() !== "";
        const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim() !== "";
        
        if (hasEmail || hasMobile) {
          imported.push(record);
        } else {
          // If no email or mobile, add to skipped.
          // Keep the original messy record in skipped for reference.
          skipped.push(batch[index]);
        }
      });
    } catch (error) {
      console.error(`Failed to process batch ${i + 1}`);
      // If a batch fails completely, we add all its records to skipped
      skipped.push(...batch);
    }
  }

  return { imported, skipped };
}

module.exports = {
  processRecordsWithAI
};
