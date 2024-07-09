import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { createClient } from "@supabase/supabase-js";
export const callSplitPdf = async (url: string, id: string) => {
  const response = await fetch(url);
  const data = await response.blob();
  const loader = new WebPDFLoader(data, {
    parsedItemSeparator: " ",
  });
  return await loader.load().then((res: any[]) =>
    res.map((doc) => {
      doc.metadata = { ...doc.metadata, chatbotId: id };
      doc.chatbotid = id;
      return doc;
    })
  );
};

// Creating supabase client
export const supabaseClient = createClient(
  process.env.SUPABASE_URL_LC_CHATBOT as string,
  process.env.SUPABASE_API_KEY as string
);
